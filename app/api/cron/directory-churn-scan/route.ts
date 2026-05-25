/**
 * Monthly cron: detect paid B2B directory subscribers with declining
 * engagement and email the admin a churn-risk summary.
 *
 * Schedule: 0 10 7 * * (10:00 UTC on the 7th of each month — runs after
 * attribution proof emails land on the 1st, giving owners a week to
 * respond before we flag them).
 *
 * A business is "at risk" when its directory event count (phone clicks +
 * website clicks + inquiry submits) in the current 30-day window is at
 * least 30% lower than the prior 30-day window, OR when it had at least
 * 3 events previously and now has zero.
 *
 * Only paid B2B subscribers (listed / featured / signature) are flagged —
 * free-tier businesses are excluded because they generate no at-risk revenue.
 *
 * Auth: Bearer CRON_SECRET
 * Query params:
 *   ?preview=true   — dry-run; computes flags but does not send email
 *   ?slug=<slug>    — restrict analysis to one business slug for testing
 *   ?threshold=<n>  — decline threshold override 0–100 (default 30)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { allBusinesses } from '@/data/localBusinesses';
import {
  sendChurnRiskReport,
  type ChurnRiskBusiness,
} from '@/app/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

const PAID_B2B_TIERS = ['listed', 'featured', 'signature'];
const DEFAULT_THRESHOLD = 30; // % decline to flag

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function monthLabel(): string {
  const now = new Date();
  return `${MONTH_LABELS[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
}

export async function GET(req: NextRequest) {
  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 });
  }
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const preview = searchParams.get('preview') === 'true';
  const filterSlug = searchParams.get('slug') ?? null;
  const threshold = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('threshold') ?? String(DEFAULT_THRESHOLD), 10)),
  );

  const supabase = createServiceClient();
  const now = new Date();

  const currentStart = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const priorStart = new Date(now.getTime() - 60 * 86_400_000).toISOString();

  // ---------------------------------------------------------------------------
  // 1. Find paid B2B subscribers → build slug set
  // ---------------------------------------------------------------------------
  const { data: paidRows } = await supabase
    .from('purchases')
    .select('businesses!inner(slug, industry_slug), tier_slug')
    .in('tier_slug', PAID_B2B_TIERS)
    .eq('tier_audience', 'b2b')
    .eq('status', 'paid');

  type PaidRow = { slug: string; industrySlug: string; tier: string };
  const paidBySlug = new Map<string, PaidRow>();

  for (const row of paidRows ?? []) {
    const r = row as unknown as {
      businesses: { slug: string; industry_slug: string } | { slug: string; industry_slug: string }[];
      tier_slug: string;
    };
    const biz = Array.isArray(r.businesses) ? r.businesses[0] : r.businesses;
    if (!biz?.slug) continue;
    if (filterSlug && biz.slug !== filterSlug) continue;
    // Keep highest tier if duplicated
    if (!paidBySlug.has(biz.slug)) {
      paidBySlug.set(biz.slug, {
        slug: biz.slug,
        industrySlug: biz.industry_slug ?? '',
        tier: r.tier_slug,
      });
    }
  }

  if (paidBySlug.size === 0) {
    return NextResponse.json({
      ok: true,
      preview,
      totalPaidSubscribers: 0,
      atRisk: [],
      emailSent: false,
    });
  }

  const slugList = [...paidBySlug.keys()];

  // ---------------------------------------------------------------------------
  // 2. Fetch events for both windows in one query each
  // ---------------------------------------------------------------------------
  const [currentRes, priorRes] = await Promise.all([
    supabase
      .from('directory_events')
      .select('business_id')
      .in('business_id', slugList)
      .gte('created_at', currentStart),
    supabase
      .from('directory_events')
      .select('business_id')
      .in('business_id', slugList)
      .gte('created_at', priorStart)
      .lt('created_at', currentStart),
  ]);

  function countBySlug(rows: Array<{ business_id: string }> | null): Map<string, number> {
    const m = new Map<string, number>();
    for (const r of rows ?? []) {
      m.set(r.business_id, (m.get(r.business_id) ?? 0) + 1);
    }
    return m;
  }

  const currentCounts = countBySlug(currentRes.data as Array<{ business_id: string }> | null);
  const priorCounts = countBySlug(priorRes.data as Array<{ business_id: string }> | null);

  // ---------------------------------------------------------------------------
  // 3. Build name lookup from static catalog
  // ---------------------------------------------------------------------------
  const nameBySlug = new Map(allBusinesses.map((b) => [b.id, b.name]));

  // ---------------------------------------------------------------------------
  // 4. Flag at-risk businesses
  // ---------------------------------------------------------------------------
  const atRisk: ChurnRiskBusiness[] = [];

  for (const [slug, meta] of paidBySlug) {
    const current = currentCounts.get(slug) ?? 0;
    const prior = priorCounts.get(slug) ?? 0;

    // Skip if no prior activity at all — can't calculate decline
    if (prior === 0) continue;

    const changePct = Math.round(((current - prior) / prior) * 100);

    const isAtRisk =
      changePct <= -threshold ||
      (prior >= 3 && current === 0);

    if (isAtRisk) {
      atRisk.push({
        name: nameBySlug.get(slug) ?? slug,
        slug,
        industrySlug: meta.industrySlug,
        tier: meta.tier,
        priorCount: prior,
        currentCount: current,
        changePct,
      });
    }
  }

  // Sort worst decline first
  atRisk.sort((a, z) => a.changePct - z.changePct);

  // ---------------------------------------------------------------------------
  // 5. Send report (or skip in preview mode)
  // ---------------------------------------------------------------------------
  let emailSent = false;

  if (!preview) {
    const result = await sendChurnRiskReport({
      monthLabel: monthLabel(),
      atRisk,
      totalPaidSubscribers: paidBySlug.size,
    });
    emailSent = result.ok === true || ('skipped' in result && result.skipped === true);
  }

  return NextResponse.json({
    ok: true,
    preview,
    threshold,
    totalPaidSubscribers: paidBySlug.size,
    atRiskCount: atRisk.length,
    emailSent,
    atRisk: atRisk.map((b) => ({
      slug: b.slug,
      name: b.name,
      tier: b.tier,
      priorCount: b.priorCount,
      currentCount: b.currentCount,
      changePct: b.changePct,
    })),
  });
}
