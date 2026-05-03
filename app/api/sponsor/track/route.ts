/**
 * POST /api/sponsor/track — log a sponsor impression or click.
 *
 * Public, fire-and-forget. Validates slot/sponsor IDs, hashes the IP
 * server-side, drops malformed events. Always returns 204.
 *
 * Writers: components/sponsorship/SponsorSlot.
 * Reader: future /admin/sponsorships dashboard via service role.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { createServiceClient } from '@/utils/supabase/service';

export const runtime = 'nodejs';

const VALID_EVENT_TYPES = new Set(['sponsor_impression', 'sponsor_click']);
const ID_PATTERN = /^[a-z0-9_-]{1,80}$/;

function ok204() {
  return new NextResponse(null, { status: 204 });
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'sponsor-track';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function POST(req: NextRequest) {
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return ok204();
  }
  if (!raw || raw.length > 2_000) return ok204();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return ok204();
  }
  if (!body || typeof body !== 'object') return ok204();

  const { slotId, sponsorId, eventType } = body as {
    slotId?: unknown;
    sponsorId?: unknown;
    eventType?: unknown;
  };

  if (typeof slotId !== 'string' || !ID_PATTERN.test(slotId)) return ok204();
  if (typeof eventType !== 'string' || !VALID_EVENT_TYPES.has(eventType)) return ok204();

  let sponsorIdClean: string | null = null;
  if (typeof sponsorId === 'string' && ID_PATTERN.test(sponsorId)) {
    sponsorIdClean = sponsorId;
  }

  const ipRaw =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;
  const ip_hash = hashIp(ipRaw);
  const user_agent = (req.headers.get('user-agent') ?? '').slice(0, 500) || null;
  const referrer = (req.headers.get('referer') ?? '').slice(0, 1_000) || null;

  try {
    const supabase = createServiceClient();
    await supabase.from('sponsor_events').insert({
      slot_id: slotId,
      sponsor_id: sponsorIdClean,
      event_type: eventType,
      ip_hash,
      user_agent,
      referrer,
    });
  } catch {
    // best-effort
  }

  return ok204();
}
