import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendNewsletterWelcome } from '@/app/lib/email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clamp(s: unknown, max: number): string | undefined {
  if (typeof s !== 'string') return undefined;
  const trimmed = s.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function clampStringArray(
  a: unknown,
  max: number,
  itemMax: number,
): string[] | undefined {
  if (!Array.isArray(a)) return undefined;
  const out = a
    .filter((x): x is string => typeof x === 'string')
    .map((s) => s.trim().slice(0, itemMax))
    .filter(Boolean)
    .slice(0, max);
  return out.length > 0 ? out : undefined;
}

/**
 * Newsletter subscribe handler.
 *
 * Same best-effort pattern as itinerary: Supabase if configured,
 * Resend welcome email if configured, succeed if at least one works.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON.' },
      { status: 400 },
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { ok: false, error: 'Invalid payload.' },
      { status: 400 },
    );
  }

  const input = body as Record<string, unknown>;
  const email = clamp(input.email, 320);

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  // Honeypot — pretend success but don't store.
  if (typeof input.website === 'string' && input.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const row = {
    email: email.toLowerCase(),
    full_name: clamp(input.fullName, 200) ?? null,
    source: clamp(input.source, 100) ?? 'unknown',
    interests: clampStringArray(input.interests, 20, 60) ?? null,
    page_url:
      clamp(input.pageUrl, 500) ??
      req.headers.get('referer')?.slice(0, 500) ??
      null,
    user_agent: req.headers.get('user-agent')?.slice(0, 500) ?? null,
  };

  let dbOk = false;
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (hasSupabase) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert(row, { onConflict: 'email', ignoreDuplicates: false });

      if (error) {
        console.error('[newsletter] supabase upsert error:', error);
      } else {
        dbOk = true;
      }
    } catch (err) {
      console.error('[newsletter] supabase unexpected error:', err);
    }
  }

  // Welcome email (fire-and-forget success; doesn't block response if fails)
  const welcomeResult = await sendNewsletterWelcome(row.email);
  const welcomeOk = welcomeResult.ok === true;
  const welcomeSkipped =
    welcomeResult.ok === false && 'skipped' in welcomeResult && welcomeResult.skipped;

  if (dbOk || welcomeOk) {
    return NextResponse.json({ ok: true });
  }

  if (!hasSupabase && welcomeSkipped) {
    console.error(
      '[newsletter] neither Supabase nor Resend are configured. Subscriber was not stored.',
    );
  }

  return NextResponse.json(
    { ok: false, error: 'Could not subscribe. Please try again.' },
    { status: 500 },
  );
}
