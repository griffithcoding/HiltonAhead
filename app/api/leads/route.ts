/**
 * POST /api/leads — generic lead-capture endpoint.
 *
 * Body shape:
 *   {
 *     type: 'relocation' | 'owner' | 'wedding',
 *     email: string,                   // required
 *     fullName?: string,
 *     phone?: string,
 *     notes?: string,
 *     details?: Record<string, unknown> // type-specific fields, sanitized + truncated
 *   }
 *
 * Same dual-write strategy as /api/itinerary: best-effort Supabase insert
 * (table: lead_inquiries), best-effort Resend notification, succeed if
 * either lands.
 *
 * Forms:
 *   - /move-to-hilton-head        → type=relocation
 *   - /sell-or-rent-your-villa    → type=owner
 *   - /hilton-head-wedding-inquiry → type=wedding
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendLeadNotification, type LeadType } from '@/app/lib/email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = new Set<LeadType>(['relocation', 'owner', 'wedding']);

function clamp(s: unknown, max: number): string | undefined {
  if (typeof s !== 'string') return undefined;
  const trimmed = s.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

/**
 * Sanitize a flat object of type-specific fields. Keeps strings (truncated),
 * numbers, booleans, and arrays-of-strings. Drops everything else. Caps total
 * payload size to keep the DB row sane.
 */
function sanitizeDetails(input: unknown): Record<string, unknown> | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const out: Record<string, unknown> = {};
  let count = 0;
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (count >= 30) break;
    if (typeof k !== 'string' || k.length > 60) continue;
    if (typeof v === 'string') {
      out[k] = v.slice(0, 500);
    } else if (typeof v === 'number' && Number.isFinite(v)) {
      out[k] = v;
    } else if (typeof v === 'boolean') {
      out[k] = v;
    } else if (Array.isArray(v)) {
      const arr = v
        .filter((x): x is string => typeof x === 'string')
        .map((s) => s.slice(0, 100))
        .slice(0, 20);
      if (arr.length) out[k] = arr;
    } else {
      continue;
    }
    count++;
  }
  return Object.keys(out).length > 0 ? out : undefined;
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

  const type = clamp(input.type, 30) as LeadType | undefined;
  if (!type || !VALID_TYPES.has(type)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid lead type.' },
      { status: 400 },
    );
  }

  const email = clamp(input.email, 320);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'A valid email is required.' },
      { status: 400 },
    );
  }

  const normalized = {
    type,
    email,
    fullName: clamp(input.fullName, 200),
    phone: clamp(input.phone, 50),
    notes: clamp(input.notes, 4000),
    details: sanitizeDetails(input.details),
  };

  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;
  const source = `${type}_form`;

  // ——— 1) Supabase insert (best-effort) ———
  let dbOk = false;
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (hasSupabase) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('lead_inquiries').insert({
        lead_type: normalized.type,
        email: normalized.email,
        full_name: normalized.fullName ?? null,
        phone: normalized.phone ?? null,
        notes: normalized.notes ?? null,
        details: normalized.details ?? null,
        source,
        user_agent: userAgent,
      });
      if (error) {
        console.error('[leads] supabase insert error:', error);
      } else {
        dbOk = true;
      }
    } catch (err) {
      console.error('[leads] supabase unexpected error:', err);
    }
  }

  // ——— 2) Email notification (best-effort) ———
  const emailResult = await sendLeadNotification({ ...normalized, userAgent, source });
  const emailOk = emailResult.ok === true;
  const emailSkipped =
    emailResult.ok === false && 'skipped' in emailResult && emailResult.skipped;

  if (dbOk || emailOk) {
    return NextResponse.json({ ok: true });
  }

  if (!hasSupabase && emailSkipped) {
    console.error(
      '[leads] neither Supabase nor Resend are configured. Lead was not stored.',
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        'Could not save your inquiry. Please email hello@hiltonahead.com directly.',
    },
    { status: 500 },
  );
}
