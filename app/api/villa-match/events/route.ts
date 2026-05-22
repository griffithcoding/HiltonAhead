// app/api/villa-match/events/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { createServiceClient } from '@/utils/supabase/service';

export const runtime = 'nodejs';

const VALID_EVENT_TYPES = new Set(['start', 'step_complete', 'complete', 'pdf_requested']);
const SESSION_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

function ok204() {
  return new NextResponse(null, { status: 204 });
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'villa-match';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function POST(req: NextRequest) {
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return ok204();
  }
  if (!raw || raw.length > 4_000) return ok204();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return ok204();
  }
  if (!body || typeof body !== 'object') return ok204();

  const { sessionId, eventType, step, answers } = body as {
    sessionId?: unknown;
    eventType?: unknown;
    step?: unknown;
    answers?: unknown;
  };

  if (typeof sessionId !== 'string' || !SESSION_ID_PATTERN.test(sessionId)) return ok204();
  if (typeof eventType !== 'string' || !VALID_EVENT_TYPES.has(eventType)) return ok204();

  const stepNum =
    typeof step === 'number' && Number.isFinite(step) && step >= 0 && step <= 10 ? step : null;
  const answersClean =
    answers && typeof answers === 'object' && !Array.isArray(answers) ? answers : null;

  const ipRaw =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;
  const ip_hash = hashIp(ipRaw);
  const user_agent = (req.headers.get('user-agent') ?? '').slice(0, 500) || null;
  const referrer = (req.headers.get('referer') ?? '').slice(0, 1_000) || null;

  try {
    const supabase = createServiceClient();
    await supabase.from('villa_match_events').insert({
      session_id: sessionId,
      event_type: eventType,
      step: stepNum,
      answers: answersClean,
      ip_hash,
      user_agent,
      referrer,
    });
  } catch {
    // Best-effort. Never surface DB errors.
  }

  return ok204();
}
