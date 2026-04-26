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
