import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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

  const row = {
    email,
    full_name: clamp(input.fullName, 200) ?? null,
    phone: clamp(input.phone, 50) ?? null,
    party_size: clampInt(input.partySize, 1, 500) ?? null,
    start_date: clampDate(input.startDate) ?? null,
    end_date: clampDate(input.endDate) ?? null,
    lodging: clamp(input.lodging, 100) ?? null,
    interests: clampStringArray(input.interests, 20, 60) ?? null,
    budget: clamp(input.budget, 100) ?? null,
    notes: clamp(input.notes, 4000) ?? null,
    source: 'itinerary_form',
    user_agent: req.headers.get('user-agent')?.slice(0, 500) ?? null,
  };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('itinerary_requests').insert(row);
    if (error) {
      console.error('[itinerary] supabase insert error:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to submit request. Please try again.' },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error('[itinerary] unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to submit request. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
