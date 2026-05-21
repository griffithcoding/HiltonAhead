/**
 * HMAC-signed one-click unsubscribe tokens for the sales pipeline.
 *
 * Email footers (see components/sales/SalesFooter.tsx) link to
 * /api/sales-unsubscribe?token=<token>. The route handler verifies the
 * signature with the same secret and inserts into sales_unsubscribes.
 *
 * Token shape: base64url(`<emailLower>|<exp>|<sig>`)
 *   - `sig` = HMAC-SHA256(`<emailLower>|<exp>`) keyed by UNSUBSCRIBE_HMAC_SECRET
 *   - `exp` = unix seconds, default 180-day window (an old email may be
 *             dug up months after the original send)
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_TTL_SECONDS = 180 * 24 * 60 * 60;

function getSecret(): string {
  const s = process.env.UNSUBSCRIBE_HMAC_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      'UNSUBSCRIBE_HMAC_SECRET must be set to a 32+ character secret.',
    );
  }
  return s;
}

export interface UnsubscribePayload {
  emailLower: string;
  exp: number;
}

/**
 * Build a one-click unsubscribe token. Pass the email-as-typed and we
 * lowercase it before signing so verification is case-insensitive.
 */
export function signSalesUnsubscribeToken(
  email: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): string {
  const emailLower = email.trim().toLowerCase();
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const data = `${emailLower}|${exp}`;
  const sig = createHmac('sha256', getSecret()).update(data).digest('hex');
  return Buffer.from(`${data}|${sig}`, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

/**
 * Verify a token and return the inner payload, or null on any failure.
 * Constant-time comparison — never branch on signature equality.
 */
export function verifySalesUnsubscribeToken(
  token: string,
): UnsubscribePayload | null {
  if (!token || token.length > 1_000) return null;

  let decoded: string;
  try {
    const pad = token.length % 4;
    const padded = token + (pad ? '='.repeat(4 - pad) : '');
    decoded = Buffer.from(
      padded.replace(/-/g, '+').replace(/_/g, '/'),
      'base64',
    ).toString('utf8');
  } catch {
    return null;
  }

  const parts = decoded.split('|');
  if (parts.length !== 3) return null;

  const [emailLower, expStr, sig] = parts;
  if (!emailLower || !emailLower.includes('@')) return null;

  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return null;
  if (exp < Math.floor(Date.now() / 1000)) return null;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return null;
  }

  const expected = createHmac('sha256', secret)
    .update(`${emailLower}|${expStr}`)
    .digest('hex');

  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length === 0 || sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  return { emailLower, exp };
}
