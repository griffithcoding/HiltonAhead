/**
 * POST /api/sales-track — sales-event ingest.
 *
 * Receives fire-and-forget events from app/lib/salesTracking.ts:trackSalesEvent
 * and writes them to public.sales_touches.
 *
 * Same security posture as /api/directory/track:
 *   - Never returns useful errors to the client (analytics can't leak shape
 *     info or affect UX). Always 204.
 *   - Hashes the IP server-side using SUPABASE_SERVICE_ROLE_KEY as salt so a
 *     leaked DB can't be reversed to raw IPs without the env var.
 *   - Validates the touch_type against the SQL enum allowlist; unknown values
 *     are dropped on the floor rather than written.
 *
 * Auth: service client. sales_touches is admin-only via RLS so we must
 * bypass it for ingest, the same way directory_events does.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { createServiceClient } from '@/utils/supabase/service';
import type { SalesTouchType } from '@/app/lib/salesTracking';

export const runtime = 'nodejs';

const VALID_TOUCH_TYPES = new Set<SalesTouchType>([
  'email_sent',
  'email_open',
  'email_click',
  'email_reply',
  'email_bounce',
  'linkedin_invite',
  'linkedin_accepted',
  'linkedin_message',
  'linkedin_reply',
  'instagram_dm',
  'instagram_reply',
  'facebook_message',
  'facebook_reply',
  'reddit_comment',
  'reddit_reply',
  'sms_sent',
  'sms_reply',
  'call_logged',
  'note',
  'status_change',
]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Map a touch_type back to its canonical channel. Used when the client only
 * sends event_type (the common case) — we infer the channel rather than
 * trust the client to send it.
 */
function inferChannel(touch: SalesTouchType): string {
  if (touch.startsWith('email_')) return 'email';
  if (touch.startsWith('linkedin_')) return 'linkedin';
  if (touch.startsWith('instagram_')) return 'instagram';
  if (touch.startsWith('facebook_')) return 'facebook';
  if (touch.startsWith('reddit_')) return 'reddit';
  if (touch.startsWith('sms_')) return 'direct'; // sms_ isn't in sales_channel; map to 'direct'
  return 'direct';
}

function ok204() {
  return new NextResponse(null, { status: 204 });
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'sales-track';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function POST(req: NextRequest) {
  // sendBeacon sends as Blob; fetch sends JSON. Both arrive as text.
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return ok204();
  }
  if (!raw || raw.length > 5_000) return ok204();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return ok204();
  }
  if (!body || typeof body !== 'object') return ok204();

  const { prospectId, eventType, metadata } = body as {
    prospectId?: unknown;
    eventType?: unknown;
    metadata?: unknown;
  };

  if (typeof prospectId !== 'string' || !UUID_RE.test(prospectId)) return ok204();
  if (
    typeof eventType !== 'string' ||
    !VALID_TOUCH_TYPES.has(eventType as SalesTouchType)
  ) {
    return ok204();
  }

  const touch = eventType as SalesTouchType;
  const channel = inferChannel(touch);

  // Bounded, JSON-safe metadata. Drop if not a plain object or too large.
  let safeMeta: Record<string, unknown> | null = null;
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    try {
      const serialized = JSON.stringify(metadata);
      if (serialized.length <= 4_000) {
        safeMeta = JSON.parse(serialized);
      }
    } catch {
      safeMeta = null;
    }
  }

  const ipRaw =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;
  const ipHash = hashIp(ipRaw);
  const userAgent = (req.headers.get('user-agent') ?? '').slice(0, 500) || null;
  const referrer = (req.headers.get('referer') ?? '').slice(0, 1_000) || null;

  // Merge transport metadata into the metadata column so the row is
  // self-describing without joining anything else.
  const mergedMeta: Record<string, unknown> = {
    ...(safeMeta ?? {}),
    ip_hash: ipHash,
    user_agent: userAgent,
    referrer,
  };

  try {
    const supabase = createServiceClient();

    // Best-effort: look up the prospect's current campaign so the touch row
    // is attributable without an extra join in the dashboard.
    let campaignId: string | null = null;
    try {
      const { data: p } = await supabase
        .from('sales_prospects')
        .select('source_campaign')
        .eq('id', prospectId)
        .maybeSingle();
      if (p?.source_campaign) campaignId = p.source_campaign as string;
    } catch {
      // Non-fatal — the touch still writes.
    }

    await supabase.from('sales_touches').insert({
      prospect_id: prospectId,
      campaign_id: campaignId,
      channel,
      touch_type: touch,
      metadata: mergedMeta,
    });
  } catch {
    // Never surface DB errors to the client. The event is best-effort.
  }

  return ok204();
}
