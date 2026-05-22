// app/api/villa-match/pdf/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServiceClient } from '@/utils/supabase/service';
import { VillaMatchPdfDocument } from '@/app/lib/villa-match/pdf-template';
import { matchArchetypes } from '@/data/matchArchetypes';
import { isLikelyEmail } from '@/app/lib/villa-match/disposable-domains';
import { checkRateLimit } from '@/app/lib/villa-match/rate-limit';
import type { QuizAnswers } from '@/components/villa-match/types';
import { brand } from '@/data/brand';

export const runtime = 'nodejs';

const SESSION_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'villa-match';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const { sessionId, email, answers, topMatchIds, hp_url } = body as {
    sessionId?: unknown;
    email?: unknown;
    answers?: unknown;
    topMatchIds?: unknown;
    hp_url?: unknown;
  };

  // 1. Honeypot — silent 200, do nothing.
  if (typeof hp_url === 'string' && hp_url.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 2. Validate
  if (typeof sessionId !== 'string' || !SESSION_ID_PATTERN.test(sessionId)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }
  if (typeof email !== 'string' || !isLikelyEmail(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  if (!Array.isArray(topMatchIds) || topMatchIds.length === 0 || topMatchIds.length > 3) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }
  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  // 3. Rate limit
  const ipRaw =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const ip_hash = hashIp(ipRaw);
  const rate = checkRateLimit(`pdf:${ip_hash ?? ipRaw}`, 3);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSec: rate.retryAfterSec },
      { status: 429 },
    );
  }

  // 4. Resolve archetypes
  const topMatch = matchArchetypes.find((a) => a.id === topMatchIds[0]);
  if (!topMatch) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }
  const alts = topMatchIds
    .slice(1)
    .map((id) => matchArchetypes.find((a) => a.id === id))
    .filter(Boolean) as typeof matchArchetypes;

  // 5. Render PDF + send via Resend
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }

  try {
    const pdfBuffer = await renderToBuffer(
      <VillaMatchPdfDocument
        answers={answers as QuizAnswers}
        topMatch={topMatch}
        alts={alts}
      />,
    );

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `${brand.name} · Your Villa Match`,
      text: `Your Villa Match picks are attached. Reply to this email anytime if you want to start checking dates. — ${brand.name}`,
      attachments: [
        { filename: 'villa-match.pdf', content: Buffer.from(pdfBuffer).toString('base64') },
      ],
    });
  } catch {
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }

  // 6. Insert lead row (best-effort)
  try {
    const supabase = createServiceClient();
    await supabase.from('villa_match_leads').insert({
      session_id: sessionId,
      email,
      answers,
      top_match_ids: topMatchIds,
      pdf_sent_at: new Date().toISOString(),
      ip_hash,
      user_agent: (req.headers.get('user-agent') ?? '').slice(0, 500) || null,
      referrer: (req.headers.get('referer') ?? '').slice(0, 1_000) || null,
    });
  } catch {
    // Email already sent — don't fail the user.
  }

  return NextResponse.json({ ok: true });
}
