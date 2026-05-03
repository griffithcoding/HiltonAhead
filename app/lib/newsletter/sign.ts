/**
 * HMAC-signed approval tokens for the newsletter approval flow.
 *
 * Owner gets an email with two magic-link buttons (Approve / Reject).
 * Each link carries `?id=<issue_id>&t=<token>&action=<approve|reject>`.
 *
 * The token is `<issue_id>|<action>|<exp>|<sig>` where sig is
 * HMAC-SHA256 of the first three pieces, keyed by NEWSLETTER_SIGNING_SECRET.
 *
 * Tokens expire after 14 days — generous because an owner may not check
 * email until Tuesday — but the issue's status check prevents replay
 * (an issue in any state other than 'pending_approval' rejects the action).
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export type ApprovalAction = 'approve' | 'reject';

export interface ApprovalPayload {
  issueId: string;
  action: ApprovalAction;
  /** Unix seconds. */
  exp: number;
}

const DEFAULT_TTL_SECONDS = 14 * 24 * 60 * 60; // 14 days

function getSecret(): string {
  const s = process.env.NEWSLETTER_SIGNING_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      'NEWSLETTER_SIGNING_SECRET must be set to a 32+ character secret.',
    );
  }
  return s;
}

export function signApprovalToken(
  issueId: string,
  action: ApprovalAction,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const data = `${issueId}|${action}|${exp}`;
  const sig = createHmac('sha256', getSecret()).update(data).digest('hex');
  return `${data}|${sig}`;
}

export function verifyApprovalToken(token: string): ApprovalPayload | null {
  const parts = token.split('|');
  if (parts.length !== 4) return null;

  const [issueId, action, expStr, sig] = parts;
  if (action !== 'approve' && action !== 'reject') return null;

  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return null;
  if (exp < Math.floor(Date.now() / 1000)) return null;

  const data = `${issueId}|${action}|${expStr}`;
  const expected = createHmac('sha256', getSecret()).update(data).digest('hex');

  // Timing-safe compare. Buffers must be the same length.
  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length === 0 || sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  return { issueId, action, exp };
}

// ---------------------------------------------------------------------------
// Sponsor-click signed redirects.
//
// Newsletter sponsor links route through /api/newsletter/sponsor-click rather
// than directly to the sponsor's domain. That gives us:
//   - Server-side click logging (sponsor_events table).
//   - Tamper-resistance: an attacker cannot rewrite the destination URL
//     without forging an HMAC, so we cannot be turned into an open redirect.
//
// Token shape: <issueId>|<sponsorId>|<base64url(url)>|<exp>|<sig>
// Same secret, same TTL story as the approval token.
// ---------------------------------------------------------------------------

export interface SponsorClickPayload {
  issueId: string;
  sponsorId: string;
  url: string;
  exp: number;
}

const SPONSOR_TTL_SECONDS = 60 * 24 * 60 * 60; // 60 days — a re-shared issue may be clicked late.

function b64UrlEncode(s: string): string {
  return Buffer.from(s, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function b64UrlDecode(s: string): string | null {
  try {
    const pad = s.length % 4;
    const padded = s + (pad ? '='.repeat(4 - pad) : '');
    return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  } catch {
    return null;
  }
}

export function signSponsorRedirect(
  issueId: string,
  sponsorId: string,
  url: string,
  ttlSeconds: number = SPONSOR_TTL_SECONDS,
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const encUrl = b64UrlEncode(url);
  const data = `${issueId}|${sponsorId}|${encUrl}|${exp}`;
  const sig = createHmac('sha256', getSecret()).update(data).digest('hex');
  return `${data}|${sig}`;
}

export function verifySponsorRedirect(token: string): SponsorClickPayload | null {
  const parts = token.split('|');
  if (parts.length !== 5) return null;

  const [issueId, sponsorId, encUrl, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return null;
  if (exp < Math.floor(Date.now() / 1000)) return null;

  const data = `${issueId}|${sponsorId}|${encUrl}|${expStr}`;
  const expected = createHmac('sha256', getSecret()).update(data).digest('hex');
  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length === 0 || sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  const url = b64UrlDecode(encUrl);
  if (!url) return null;

  // Belt-and-suspenders: only allow http(s) destinations even if HMAC verifies.
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  } catch {
    return null;
  }

  return { issueId, sponsorId, url, exp };
}
