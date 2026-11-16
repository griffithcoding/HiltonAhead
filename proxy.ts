import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { brand } from '@/data/brand';

/**
 * ——— Pre-launch gate ———————————————————————————————————————————————
 *
 * The public site is not ready to show yet. Every public route returns a
 * 503 "coming soon" page until `SITE_OFFLINE=false` is set in the Vercel
 * project (or this block is deleted at launch).
 *
 * Deliberately 503 and NOT `noindex` / `Disallow: /`: 503 is the signal
 * Google documents for temporary unavailability and it preserves existing
 * rankings, whereas noindex would actively deindex the pages we spent the
 * SEO work on. `app/robots.ts` is intentionally left untouched.
 *
 * Admin and API stay reachable so the CRM keeps working and the Stripe /
 * Calendly webhooks and Vercel crons in `vercel.json` keep landing.
 *
 * To preview production yourself: visit
 *   https://www.hiltonahead.com/?preview=<SITE_PREVIEW_SECRET>
 * once. That sets an httpOnly cookie and you browse normally for 30 days.
 */

const PREVIEW_COOKIE = 'ha-preview';
const PREVIEW_PARAM = 'preview';
const PREVIEW_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Prefixes that stay live while the gate is up. */
const ALWAYS_ALLOWED = ['/admin', '/auth', '/api', '/_next'];

/** Gate is ON by default — the site is off until we explicitly turn it on. */
function siteIsOffline(): boolean {
  if (process.env.NODE_ENV === 'development') return false;
  return process.env.SITE_OFFLINE !== 'false';
}

/** Length-independent compare so the secret can't be probed byte-by-byte. */
function secretsMatch(offered: string, expected: string): boolean {
  if (offered.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < offered.length; i += 1) {
    diff |= offered.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

function isAllowedPath(pathname: string): boolean {
  return ALWAYS_ALLOWED.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function comingSoonPage(): NextResponse {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${brand.name} — Coming soon</title>
<style>
  :root { color-scheme: light; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center;
    justify-content: center; padding: 2rem;
    background: #F5EFE4; color: #0A2930;
    font: 16px/1.7 "Instrument Sans", system-ui, -apple-system, sans-serif;
  }
  main { max-width: 30rem; text-align: center; }
  .mark {
    font-size: 11px; letter-spacing: .28em; text-transform: uppercase;
    color: #FF7A5C;
  }
  h1 {
    font-family: Fraunces, Georgia, "Times New Roman", serif;
    font-weight: 400; font-size: clamp(2rem, 7vw, 3rem);
    line-height: 1.08; margin: 1.25rem 0 0; letter-spacing: -.02em;
  }
  h1 em { font-style: italic; color: #FF7A5C; }
  p { margin: 1.25rem 0 0; color: #3C5A61; }
  .rule { width: 3rem; height: 1px; margin: 2rem auto 0; background: rgba(10,41,48,.25); }
  .foot { margin-top: 2rem; font-size: 12px; letter-spacing: .18em;
          text-transform: uppercase; color: rgba(10,41,48,.55); }
</style>
</head>
<body>
  <main>
    <div class="mark">${brand.contact.location}</div>
    <h1>${brand.name} is <em>almost ready.</em></h1>
    <p>We're putting the finishing touches on the island guide. Check back shortly.</p>
    <div class="rule"></div>
    <div class="foot">Opening soon</div>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status: 503,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store, must-revalidate',
      'retry-after': '86400',
    },
  });
}

/**
 * Returns a response when the request should be blocked or redirected,
 * or `null` when it should continue to the normal proxy pipeline.
 */
function offlineGate(request: NextRequest): NextResponse | null {
  if (!siteIsOffline()) return null;

  const { pathname, searchParams } = request.nextUrl;
  if (isAllowedPath(pathname)) return null;

  const secret = process.env.SITE_PREVIEW_SECRET;

  // Unlock: /?preview=<secret> → drop the param, remember it in a cookie.
  const offered = searchParams.get(PREVIEW_PARAM);
  if (secret && offered && secretsMatch(offered, secret)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete(PREVIEW_PARAM);
    const response = NextResponse.redirect(url);
    response.cookies.set(PREVIEW_COOKIE, secret, {
      httpOnly: true,
      sameSite: 'lax',
      secure: url.protocol === 'https:',
      path: '/',
      maxAge: PREVIEW_MAX_AGE,
    });
    return response;
  }

  const cookie = request.cookies.get(PREVIEW_COOKIE)?.value;
  if (secret && cookie && secretsMatch(cookie, secret)) return null;

  return comingSoonPage();
}

/**
 * Supabase session proxy (formerly "middleware" — Next 16 renamed the
 * file/export convention to proxy.ts / export proxy).
 *
 * Runs on every non-static request. Its only job is to refresh the
 * auth session cookie if it's expired so server components see a
 * current user. Without this, cookies set by the server get stale
 * and getUser() returns null even when the browser is "signed in."
 *
 * Based on the official Supabase + Next.js App Router template.
 */
export async function proxy(request: NextRequest) {
  // Pre-launch gate runs first: public routes never reach the session
  // refresh below while the site is off.
  const gated = offlineGate(request);
  if (gated) return gated;

  let response = NextResponse.next({ request });

  // Skip if Supabase isn't configured (e.g., local without env vars).
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options: CookieOptions;
          }>,
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Touching getUser() triggers the cookie refresh when needed.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     *   - _next/static, _next/image (Next.js assets)
     *   - favicon, robots, sitemap
     *   - static image extensions
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
