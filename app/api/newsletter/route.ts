import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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

  // Lightweight honeypot: legit users won't fill this hidden field.
  if (typeof input.website === 'string' && input.website.trim()) {
    // Pretend success but don't store.
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

  try {
    const supabase = await createClient();
    // Upsert on email: re-subscribes update source/interests/updated_at.
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(row, { onConflict: 'email', ignoreDuplicates: false });

    if (error) {
      console.error('[newsletter] supabase upsert error:', error);
      return NextResponse.json(
        { ok: false, error: 'Could not subscribe. Please try again.' },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error('[newsletter] unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not subscribe. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
