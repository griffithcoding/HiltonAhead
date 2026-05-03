/**
 * GET /api/newsletter/sponsor-click?t=<token>
 *
 * Verifies an HMAC-signed sponsor token (from app/lib/newsletter/sign.ts),
 * logs the click into sponsor_events, and 302s to the sponsor's destination.
 *
 * Tamper-resistance is critical here: the destination URL is part of the
 * signed payload, so an attacker can't rewrite us into an open redirect.
 * Belt-and-suspenders: verifySponsorRedirect rejects any non-http(s) scheme.
 *
 * Click logging is best-effort. The redirect happens regardless — a logging
 * failure must never break the sponsor's link.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { verifySponsorRedirect } from '@/app/lib/newsletter/sign';
import { createServiceClient } from '@/utils/supabase/service';

export const runtime = 'nodejs';

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'sponsor-click';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('t');
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url), 302);
  }

  const payload = verifySponsorRedirect(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/', req.url), 302);
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
      slot_id: `newsletter-${payload.issueId}`,
      sponsor_id: payload.sponsorId,
      event_type: 'sponsor_click',
      ip_hash,
      user_agent,
      referrer,
    });
  } catch {
    // best-effort
  }

  return NextResponse.redirect(payload.url, 302);
}
