/**
 * POST /api/affiliate/track — log an affiliate-link click.
 *
 * Public, fire-and-forget. No auth. Validates payload shape, hashes the IP
 * server-side, drops malformed events on the floor instead of returning
 * errors. Always returns 204 (analytics never blocks UX, never leaks shape).
 *
 * Writers: components/affiliate/AffiliateLink, AffiliateCard.
 * Reader: future /admin/affiliates dashboard via service-role.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { createServiceClient } from '@/utils/supabase/service';
import { AFFILIATE_PROGRAMS } from '@/data/affiliateLinks';

export const runtime = 'nodejs';

const VALID_PROGRAM_IDS = new Set(Object.keys(AFFILIATE_PROGRAMS));
const PLACEMENT_PATTERN = /^[a-z0-9/_-]{1,120}$/;

function ok204() {
  return new NextResponse(null, { status: 204 });
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'affiliate-track';
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

  const { programId, placement, destination } = body as {
    programId?: unknown;
    placement?: unknown;
    destination?: unknown;
  };

  if (typeof programId !== 'string' || !VALID_PROGRAM_IDS.has(programId)) return ok204();

  let placementClean: string | null = null;
  if (typeof placement === 'string' && PLACEMENT_PATTERN.test(placement)) {
    placementClean = placement;
  }

  let destinationClean: string | null = null;
  if (typeof destination === 'string' && destination.length <= 1_000) {
    destinationClean = destination;
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
    await supabase.from('affiliate_events').insert({
      program_id: programId,
      placement: placementClean,
      destination: destinationClean,
      event_type: 'affiliate_click',
      ip_hash,
      user_agent,
      referrer,
    });
  } catch {
    // best-effort
  }

  return ok204();
}
