/**
 * POST /api/directory/track — log a directory interaction.
 *
 * Public, fire-and-forget. No auth. Validates payload shape, hashes the IP
 * server-side, drops events with implausible inputs (length, enum) on the
 * floor instead of returning errors. Always returns 204 so the client never
 * gets a useful error signal back (analytics can't be allowed to leak shape
 * info or affect UX).
 *
 * Writers: components/local/TrackedPhoneLink, TrackedWebsiteLink,
 * BusinessInquiryForm (future paid-tier route).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { createServiceClient } from '@/utils/supabase/service';

export const runtime = 'nodejs';

const VALID_EVENT_TYPES = new Set([
  'phone_click',
  'website_click',
  'inquiry_submit',
]);

const VALID_INDUSTRIES = new Set([
  'restaurants',
  'golf',
  'water-activities',
  'weddings',
  'spas-wellness',
  'vacation-rentals',
  'shopping',
  'family-activities',
  'pizza',
  'transportation',
  'home-services',
  'fishing-charters',
  'dolphin-tours',
]);

const ID_PATTERN = /^[a-z0-9-]{1,80}$/;

function ok204() {
  return new NextResponse(null, { status: 204 });
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  // Salt with a server-known constant so a leaked DB still can't reverse to
  // raw IPs without the env var. SUPABASE_SERVICE_ROLE_KEY is server-only and
  // already required for this route to function — reusing it as the salt
  // adds zero new secret-management surface.
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'directory-track';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function POST(req: NextRequest) {
  // Read body. sendBeacon sends as Blob; fetch sends JSON. Both arrive as text.
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return ok204();
  }
  if (!raw || raw.length > 2_000) return ok204();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return ok204();
  }
  if (!body || typeof body !== 'object') return ok204();

  const { businessId, industrySlug, eventType } = body as {
    businessId?: unknown;
    industrySlug?: unknown;
    eventType?: unknown;
  };

  if (typeof businessId !== 'string' || !ID_PATTERN.test(businessId)) return ok204();
  if (typeof industrySlug !== 'string' || !VALID_INDUSTRIES.has(industrySlug)) return ok204();
  if (typeof eventType !== 'string' || !VALID_EVENT_TYPES.has(eventType)) return ok204();

  const ipRaw =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;
  const ip_hash = hashIp(ipRaw);
  const user_agent = (req.headers.get('user-agent') ?? '').slice(0, 500) || null;
  const referrer = (req.headers.get('referer') ?? '').slice(0, 1_000) || null;

  try {
    const supabase = createServiceClient();
    await supabase.from('directory_events').insert({
      business_id: businessId,
      industry_slug: industrySlug,
      event_type: eventType,
      ip_hash,
      user_agent,
      referrer,
    });
  } catch {
    // Never surface DB errors to the client. The event is best-effort.
  }

  return ok204();
}
