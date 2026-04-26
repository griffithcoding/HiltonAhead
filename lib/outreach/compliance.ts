/**
 * CAN-SPAM compliance helpers for outbound outreach.
 *
 * Every outreach email gets:
 *   1. A physical mailing address (CAN-SPAM § 5(a)(5))
 *   2. A clear opt-out mechanism (one-click unsubscribe link)
 *   3. Honored within 10 business days (we honor immediately)
 *
 * The unsubscribe link uses an HMAC token over the contact_id so the URL
 * isn't guessable. Sets opted_out = true on the contacts row, which the
 * send action checks before every send.
 *
 * Env vars (with sensible defaults for local dev):
 *   OUTREACH_FROM_NAME           — display name for "From"  default "Hilton Ahead"
 *   OUTREACH_FROM_ADDRESS        — physical mailing address (REQUIRED for prod)
 *   OUTREACH_UNSUBSCRIBE_SECRET  — HMAC secret for unsub tokens (REQUIRED for prod)
 *   NEXT_PUBLIC_SITE_URL         — base URL for unsub link
 */

import crypto from 'node:crypto';

export const FROM_NAME = process.env.OUTREACH_FROM_NAME || 'Hilton Ahead';

// Plausible default while the user supplies their real business address.
// CAN-SPAM requires a *physical* postal address — a PO box is OK.
export const FROM_ADDRESS =
  process.env.OUTREACH_FROM_ADDRESS ||
  'Hilton Ahead, Hilton Head Island, SC 29928';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://hiltonahead.com';

const UNSUB_SECRET =
  process.env.OUTREACH_UNSUBSCRIBE_SECRET ||
  // Fallback: deterministic-but-warning-emitting development secret. In
  // production this MUST be set or unsubscribe links from older sends
  // become invalid when the secret rotates.
  'dev-only-unsub-secret-replace-me';

if (!process.env.OUTREACH_UNSUBSCRIBE_SECRET) {
  // Emitted once per process — fine.
  console.warn(
    '[outreach] OUTREACH_UNSUBSCRIBE_SECRET is not set; using a dev fallback. Set this env var in production.',
  );
}

/**
 * Generate an HMAC token for a contact's unsubscribe link.
 * Token is base64url-encoded HMAC-SHA256 over the contact UUID.
 */
export function unsubscribeToken(contactId: string): string {
  return crypto
    .createHmac('sha256', UNSUB_SECRET)
    .update(contactId)
    .digest('base64url');
}

/** Constant-time validate a token returned by clicking the unsub link. */
export function verifyUnsubscribeToken(
  contactId: string,
  presented: string,
): boolean {
  const expected = unsubscribeToken(contactId);
  if (presented.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(presented),
    Buffer.from(expected),
  );
}

/** Build the public one-click unsubscribe URL for a contact. */
export function unsubscribeUrl(contactId: string): string {
  const token = unsubscribeToken(contactId);
  return `${SITE_URL}/api/outreach/unsubscribe?c=${contactId}&t=${token}`;
}

/**
 * Append the CAN-SPAM footer to a plain-text outreach body.
 *
 * Returns body + two-newline separator + footer block. Idempotent — does
 * not double-append if the footer marker is already present.
 */
const FOOTER_MARKER = '-- Hilton Ahead outreach --';

export function appendCanSpamFooter(body: string, contactId: string): string {
  if (body.includes(FOOTER_MARKER)) return body;
  const url = unsubscribeUrl(contactId);
  const footer =
    `\n\n${FOOTER_MARKER}\n` +
    `${FROM_ADDRESS}\n` +
    `Don't want these? One-click unsubscribe: ${url}`;
  return body + footer;
}
