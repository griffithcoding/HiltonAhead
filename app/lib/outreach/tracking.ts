/**
 * Open / click tracking URL signing for outreach emails.
 *
 * Every outbound outreach email is assigned a `tracking_id` (UUID, generated
 * at send time) which gets embedded in:
 *
 *   - the open pixel src        /api/outreach/track/open?m=<id>&t=<token>
 *   - each link href            /api/outreach/track/click?m=<id>&u=<url>&t=<token>
 *
 * `t` is an HMAC over the action+id (and url, for clicks) so the endpoints
 * can verify the URL wasn't tampered with — keeps random scanners from
 * polluting our open-rate stats.
 *
 * Required env (production):
 *   OUTREACH_TRACKING_SECRET   — HMAC secret. Falls back to the
 *                                 unsubscribe secret, then a dev fallback.
 *   NEXT_PUBLIC_SITE_URL       — origin for the tracking links.
 */

import crypto from 'node:crypto';
import { brand } from '@/data/brand';

const SECRET =
  process.env.OUTREACH_TRACKING_SECRET ||
  process.env.OUTREACH_UNSUBSCRIBE_SECRET ||
  'dev-only-tracking-secret-replace-me';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

if (
  !process.env.OUTREACH_TRACKING_SECRET &&
  !process.env.OUTREACH_UNSUBSCRIBE_SECRET
) {
  console.warn(
    '[outreach/tracking] OUTREACH_TRACKING_SECRET is not set; using a dev fallback. Set this env var in production.',
  );
}

function hmac(payload: string): string {
  return crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('base64url')
    .slice(0, 22); // Truncate — collision math is fine for 22 chars (~131 bits).
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/** A url-safe tracking id. UUID v4 -> 32 hex chars, no dashes. */
export function newTrackingId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

// ============================================================================
// Open tracking
// ============================================================================

export function trackOpenUrl(trackingId: string): string {
  const t = hmac(`open:${trackingId}`);
  return `${SITE_URL}/api/outreach/track/open?m=${encodeURIComponent(trackingId)}&t=${t}`;
}

export function verifyOpenToken(trackingId: string, token: string): boolean {
  return constantTimeEqual(hmac(`open:${trackingId}`), token);
}

// ============================================================================
// Click tracking
// ============================================================================

/**
 * Wrap an outbound URL so the click lands in our redirector first.
 * The original URL is included in the query string so the redirect can
 * still send the recipient to the correct destination if our DB is
 * temporarily unreachable.
 */
export function trackClickUrl(trackingId: string, originalUrl: string): string {
  const t = hmac(`click:${trackingId}:${originalUrl}`);
  return (
    `${SITE_URL}/api/outreach/track/click` +
    `?m=${encodeURIComponent(trackingId)}` +
    `&u=${encodeURIComponent(originalUrl)}` +
    `&t=${t}`
  );
}

export function verifyClickToken(
  trackingId: string,
  originalUrl: string,
  token: string,
): boolean {
  return constantTimeEqual(hmac(`click:${trackingId}:${originalUrl}`), token);
}
