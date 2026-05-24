/**
 * GET /api/cron/attribution-proof
 *
 * Sends a monthly attribution report to every active B2B directory subscriber
 * (Listed $600/yr, Featured $1,800/yr, Signature $4,800/yr) showing phone
 * clicks, website visits, and inquiry submissions their listing generated in
 * the last 30 days.
 *
 * This is the retention mechanism for Workstream B — subscribers have no
 * reason to renew without proof the listing is driving real interactions.
 *
 * Schedule (vercel.json):
 *   { "path": "/api/cron/attribution-proof", "schedule": "0 9 1 * *" }
 *   = 9:00 UTC on the 1st of every month (5:00 AM ET)
 *
 * Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
 * Missing CRON_SECRET → 503 (deploy misconfiguration, not 401, so it's loud).
 *
 * Manual triggers (admin only, still require Bearer token):
 *   ?preview=true          — routes all emails to RESEND_TO_EMAIL (safe preview)
 *   ?slug=<business-slug>  — send for one specific business only
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { sendAttributionProofEmail } from '@/app/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

const WINDOW_DAYS = 30;

const B2B_TIER_SLUGS = ['listed', 'featured', 'signature'] as const;
type B2BTier = (typeof B2B_TIER_SLUGS)[number];

/** Higher rank = higher tier. Used to pick the best tier when an owner has multiple purchases. */
const TIER_RANK: Record<B2BTier, number> = { signature: 0, featured: 1, listed: 2 };

function isAuthorized(req: NextRequest, secret: string): boolean {
  const auth = req.headers.get('authorization') || '';
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'CRON_SECRET is not configured. Set CRON_SECRET in the deploy env before scheduling this route.',
      },
      { status: 503 },
    );
  }

  if (!isAuthorized(req, secret)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const url = new URL(req.url);
  const preview = url.searchParams.get('preview') === 'true';
  const slugFilter = url.searchParams.get('slug') ?? null;

  const supabase = createServiceClient();
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // ── 1. Fetch all active B2B paid subscribers ───────────────────────────────
  const { data: rawPurchases, error: purchaseErr } = await supabase
    .from('purchases')
    .select(
      'customer_email, customer_name, tier_slug, tier_audience, business_id, current_period_end',
    )
    .in('tier_slug', [...B2B_TIER_SLUGS])
    .eq('tier_audience', 'b2b')
    .eq('status', 'paid');

  if (purchaseErr) {
    console.error('[attribution-proof] purchases query error:', purchaseErr.message);
    return NextResponse.json({ ok: false, error: purchaseErr.message }, { status: 500 });
  }

  // ── 2. Deduplicate by email — keep highest tier per subscriber ─────────────
  const byEmail = new Map<
    string,
    {
      email: string;
      name: string | null;
      tier: B2BTier;
      businessId: string | null;
      renewalDate: string | null;
    }
  >();

  for (const p of rawPurchases ?? []) {
    if (!(B2B_TIER_SLUGS as readonly string[]).includes(p.tier_slug)) continue;
    const key = p.customer_email.toLowerCase();
    const existing = byEmail.get(key);
    const rank = TIER_RANK[p.tier_slug as B2BTier];
    if (!existing || rank < TIER_RANK[existing.tier]) {
      byEmail.set(key, {
        email: p.customer_email,
        name: p.customer_name ?? null,
        tier: p.tier_slug as B2BTier,
        businessId: p.business_id ?? null,
        renewalDate: p.current_period_end ?? null,
      });
    }
  }

  const subscribers = Array.from(byEmail.values());

  // ── 3. Send attribution report to each subscriber ─────────────────────────
  const results = { sent: 0, skipped: 0, errors: [] as string[] };

  for (const sub of subscribers) {
    try {
      // 3a. Resolve businesses.slug — the key for directory_events lookups.
      let businessSlug: string | null = null;
      let businessName: string | null = null;

      if (sub.businessId) {
        const { data: biz } = await supabase
          .from('businesses')
          .select('slug, name')
          .eq('id', sub.businessId)
          .maybeSingle();
        if (biz) {
          businessSlug = biz.slug;
          businessName = biz.name;
        }
      }

      if (!businessSlug) {
        // Fallback: match business by owner_email (most purchases won't have
        // business_id set until the owner has gone through the claim flow).
        const { data: biz } = await supabase
          .from('businesses')
          .select('slug, name')
          .ilike('owner_email', sub.email)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (biz) {
          businessSlug = biz.slug;
          businessName = biz.name;
        }
      }

      if (!businessSlug) {
        console.warn(
          `[attribution-proof] no business found for subscriber ${sub.email} — skipping`,
        );
        results.skipped++;
        continue;
      }

      // 3b. Slug filter — manual single-business trigger.
      if (slugFilter && businessSlug !== slugFilter) continue;

      // 3c. Aggregate directory_events for the last WINDOW_DAYS days.
      const { data: events } = await supabase
        .from('directory_events')
        .select('event_type')
        .eq('business_id', businessSlug)
        .gte('created_at', since);

      const evts = events ?? [];
      const phoneClicks = evts.filter((e) => e.event_type === 'phone_click').length;
      const websiteClicks = evts.filter((e) => e.event_type === 'website_click').length;
      const inquirySubmits = evts.filter((e) => e.event_type === 'inquiry_submit').length;

      // 3d. Send — preview mode redirects all sends to the ops inbox.
      const sendTo = preview
        ? (process.env.RESEND_TO_EMAIL ?? 'hiltonahead@gmail.com')
        : sub.email;

      const result = await sendAttributionProofEmail({
        to: sendTo,
        contactName: sub.name ?? undefined,
        businessName: businessName ?? businessSlug,
        businessSlug,
        tierSlug: sub.tier,
        phoneClicks,
        websiteClicks,
        inquirySubmits,
        renewalDate: sub.renewalDate,
        windowDays: WINDOW_DAYS,
      });

      if (result.ok) {
        results.sent++;
      } else if ('skipped' in result && result.skipped) {
        // RESEND_API_KEY not configured — dev environment.
        results.skipped++;
      } else {
        const errMsg = 'error' in result ? result.error : 'unknown error';
        console.error(`[attribution-proof] send failed for ${sub.email}:`, errMsg);
        results.errors.push(`${sub.email}: ${errMsg}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[attribution-proof] unexpected error for ${sub.email}:`, msg);
      results.errors.push(`${sub.email}: ${msg}`);
    }
  }

  console.log(
    `[attribution-proof] complete — sent:${results.sent} skipped:${results.skipped} errors:${results.errors.length}`,
  );

  return NextResponse.json({
    ok: true,
    preview,
    windowDays: WINDOW_DAYS,
    subscribersProcessed: subscribers.length,
    ...results,
  });
}
