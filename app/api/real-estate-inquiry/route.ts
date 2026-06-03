import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendRealEstateInquiryNotification } from '@/app/lib/email';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTENTS = new Set(['buying', 'selling', 'both', 'browsing']);

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim().slice(0, max);
  return s || undefined;
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

  const email = str(input.email, 320);
  const name = str(input.name, 100);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ ok: false, error: 'A name is required.' }, { status: 400 });
  }

  const intentRaw = str(input.intent, 20);
  const normalized = {
    name,
    email,
    phone: str(input.phone, 20),
    neighborhoodSlug: str(input.neighborhoodSlug, 40),
    intent: intentRaw && INTENTS.has(intentRaw) ? intentRaw : undefined,
    message: str(input.message, 4000),
    sourceUrl: str(input.sourceUrl, 300),
  };

  // SHA-256 hash the client IP (mirrors directory_events).
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  let ipHash: string | null = null;
  try {
    ipHash = createHash('sha256').update(ip).digest('hex');
  } catch {
    ipHash = null;
  }

  // 1) Best-effort insert.
  let dbOk = false;
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (hasSupabase) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('real_estate_inquiries').insert({
        name: normalized.name,
        email: normalized.email,
        phone: normalized.phone ?? null,
        neighborhood_slug: normalized.neighborhoodSlug ?? null,
        intent: normalized.intent ?? null,
        message: normalized.message ?? null,
        source_url: normalized.sourceUrl ?? null,
        ip_hash: ipHash,
      });
      if (error) console.error('[real-estate-inquiry] insert error:', error);
      else dbOk = true;
    } catch (err) {
      console.error('[real-estate-inquiry] unexpected error:', err);
    }
  }

  // 2) Best-effort email.
  const emailResult = await sendRealEstateInquiryNotification(normalized);
  const emailOk = emailResult.ok === true;

  if (dbOk || emailOk) return NextResponse.json({ ok: true });

  return NextResponse.json(
    { ok: false, error: 'Could not submit your inquiry. Please email hello@hiltonahead.com.' },
    { status: 500 },
  );
}
