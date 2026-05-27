/**
 * Outreach open-tracking endpoint.
 *
 * Called by email clients when the 1x1 GIF in an outreach HTML email
 * loads. Always returns the same transparent 1x1 GIF (so failures don't
 * show as broken-image icons in clients), but conditionally logs an
 * outreach_email_events row when the token validates.
 *
 * Caveats — the open rate this surfaces will be inflated:
 *   - Apple Mail Privacy Protection (MPP) pre-fetches images, generating
 *     a "fake" open the moment the message arrives.
 *   - Many corporate spam filters fetch images during scanning.
 *   - Bot / spam-scanner fetches.
 * Treat opens as a *relative* signal across batches, not a literal
 * read count.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createServiceClient } from '@/utils/supabase/service';
import { verifyOpenToken } from '@/app/lib/outreach/tracking';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Transparent 1x1 GIF (43 bytes). Used as the always-200 response body.
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64',
);

function gifResponse(): NextResponse {
  return new NextResponse(new Uint8Array(TRANSPARENT_GIF), {
    status: 200,
    headers: {
      'content-type': 'image/gif',
      'content-length': String(TRANSPARENT_GIF.length),
      // Don't let mailbox providers cache the open across multiple reads.
      'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
      pragma: 'no-cache',
    },
  });
}

/** SHA-256 hex of the request IP, truncated to 32 chars for storage. */
function hashIp(req: NextRequest): string {
  // Vercel forwards client IP in x-forwarded-for; first hop is the client.
  const xff = req.headers.get('x-forwarded-for') || '';
  const ip = xff.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '';
  if (!ip) return '';
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackingId = searchParams.get('m') || '';
  const token = searchParams.get('t') || '';

  // Always return the pixel regardless of validation outcome — we don't
  // want to leak signal about which IDs are real.
  if (!trackingId || !token || !verifyOpenToken(trackingId, token)) {
    return gifResponse();
  }

  // Log in the background — never block the pixel response.
  void recordOpen(trackingId, req).catch((err) =>
    console.error('[outreach/track/open] log error:', err),
  );

  return gifResponse();
}

async function recordOpen(trackingId: string, req: NextRequest): Promise<void> {
  const supabase = createServiceClient();

  // Resolve which opportunity this tracking_id belongs to by reading the
  // matching outreach_activity row. We don't fail if missing — could be
  // an event for a tracking_id from before this migration deployed.
  const { data: activity } = await supabase
    .from('outreach_activity')
    .select('opportunity_id, contact_id')
    .eq('kind', 'email_sent')
    .filter('metadata->>tracking_id', 'eq', trackingId)
    .maybeSingle();

  if (!activity?.opportunity_id) return;

  await supabase.from('outreach_email_events').insert({
    opportunity_id: activity.opportunity_id,
    contact_id: activity.contact_id,
    tracking_id: trackingId,
    kind: 'open',
    user_agent: req.headers.get('user-agent')?.slice(0, 500) || null,
    ip_hash: hashIp(req) || null,
  });
}
