import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendItineraryNotification } from '@/app/lib/email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function clamp(s: unknown, max: number): string | undefined {
  if (typeof s !== 'string') return undefined;
  const trimmed = s.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function clampInt(n: unknown, min: number, max: number): number | undefined {
  const num = typeof n === 'number' ? n : typeof n === 'string' ? Number(n) : NaN;
  if (!Number.isFinite(num)) return undefined;
  return Math.max(min, Math.min(max, Math.floor(num)));
}

function clampDate(s: unknown): string | undefined {
  if (typeof s !== 'string' || !ISO_DATE_RE.test(s)) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : s;
}

function clampStringArray(a: unknown, max: number, itemMax: number): string[] | undefined {
  if (!Array.isArray(a)) return undefined;
  const out = a
    .filter((x): x is string => typeof x === 'string')
    .map((s) => s.trim().slice(0, itemMax))
    .filter(Boolean)
    .slice(0, max);
  return out.length > 0 ? out : undefined;
}

/**
 * Itinerary request handler.
 *
 * Flow:
 *   1. Validate the payload.
 *   2. Best-effort insert into Supabase `itinerary_requests` (skipped if
 *      Supabase env vars aren't set, or continues on DB error — we don't
 *      want a lead to vanish because of infra).
 *   3. Send email notification to the ops inbox via Resend (skipped if
 *      RESEND_API_KEY isn't set).
 *   4. Return 200 if at least one storage path (DB or email) succeeded;
 *      500 if both failed.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;

  const email = clamp(input.email, 320);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'A valid email is required.' },
      { status: 400 },
    );
  }

  const normalized = {
    email,
    fullName: clamp(input.fullName, 200),
    phone: clamp(input.phone, 50),
    partySize: clampInt(input.partySize, 1, 500),
    startDate: clampDate(input.startDate),
    endDate: clampDate(input.endDate),
    lodging: clamp(input.lodging, 100),
    interests: clampStringArray(input.interests, 20, 60),
    budget: clamp(input.budget, 100),
    notes: clamp(input.notes, 4000),
  };

  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;

  // ——— 1) Supabase insert (best-effort) ———
  let dbOk = false;
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (hasSupabase) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('itinerary_requests').insert({
        email: normalized.email,
        full_name: normalized.fullName ?? null,
        phone: normalized.phone ?? null,
        party_size: normalized.partySize ?? null,
        start_date: normalized.startDate ?? null,
        end_date: normalized.endDate ?? null,
        lodging: normalized.lodging ?? null,
        interests: normalized.interests ?? null,
        budget: normalized.budget ?? null,
        notes: normalized.notes ?? null,
        source: 'itinerary_form',
        user_agent: userAgent,
      });
      if (error) {
        console.error('[itinerary] supabase insert error:', error);
      } else {
        dbOk = true;
      }
    } catch (err) {
      console.error('[itinerary] supabase unexpected error:', err);
    }
  }

  // ——— 2) Email notification (best-effort) ———
  const emailResult = await sendItineraryNotification({
    ...normalized,
    userAgent,
    source: 'itinerary_form',
  });

  const emailOk = emailResult.ok === true;
  const emailSkipped =
    emailResult.ok === false && 'skipped' in emailResult && emailResult.skipped;

  // ——— 3) Decide the response ———
  // Succeed as long as at least one backend captured the request. This means
  // the lead isn't lost just because one of Supabase/Resend isn't configured.
  if (dbOk || emailOk) {
    return NextResponse.json({ ok: true });
  }

  // Both failed — tell the user, log why.
  if (!hasSupabase && emailSkipped) {
    console.error(
      '[itinerary] neither Supabase nor Resend are configured. Request was not stored.',
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        'Could not save your request. Please email hello@hiltonahead.com directly.',
    },
    { status: 500 },
  );
}
