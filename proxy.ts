import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

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
