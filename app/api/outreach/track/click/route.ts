/**
 * Outreach click-tracking endpoint.
 *
 * Wraps every outbound link in an HTML outreach email. When the
 * recipient clicks, we land here, log the event, then 302 to the
 * original URL. The original URL is included in the query string (and
 * HMAC-signed) so the redirect still works even if our DB is briefly
 * unreachable.
 *
 * On token-validation failure we still redirect to the URL — refusing
 * to redirect would punish real users for token bit-flips in copy/paste,
 * proxy URL rewrites, etc. We only skip *logging* on bad tokens.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createServiceClient } from '@/utils/supabase/service';
import { verifyClickToken } from '@/app/lib/outreach/tracking';
import { brand } from '@/data/brand';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FALLBACK_REDIRECT = brand.url || 'https://hiltonahead.com';

function safeRedirectUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.toString();
    return FALLBACK_REDIRECT;
  } catch {
    return FALLBACK_REDIRECT;
  }
}

function hashIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for') || '';
  const ip = xff.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '';
  if (!ip) return '';
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackingId = searchParams.get('m') || '';
  const originalUrl = searchParams.get('u') || '';
  const token = searchParams.get('t') || '';

  const dest = safeRedirectUrl(originalUrl);

  const tokenValid =
    !!trackingId &&
    !!originalUrl &&
    !!token &&
    verifyClickToken(trackingId, originalUrl, token);

  if (tokenValid) {
    void recordClick(trackingId, originalUrl, req).catch((err) =>
      console.error('[outreach/track/click] log error:', err),
    );
  }

  return NextResponse.redirect(dest, { status: 302 });
}

async function recordClick(
  trackingId: string,
  originalUrl: string,
  req: NextRequest,
): Promise<void> {
  const supabase = createServiceClient();

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
    kind: 'click',
    url: originalUrl.slice(0, 2000),
    user_agent: req.headers.get('user-agent')?.slice(0, 500) || null,
    ip_hash: hashIp(req) || null,
  });
}
