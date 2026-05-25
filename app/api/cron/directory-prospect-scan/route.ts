/**
 * Weekly cron: scan directory_events for free-tier businesses with organic
 * traction, then enroll their owners in the B2B directory upgrade pitch
 * sequence.
 *
 * Schedule: 0 10 * * 1 (10:00 UTC every Monday)
 *
 * A "qualifying" business is one that:
 *   1. Has ≥ MIN_INTERACTIONS events in the last 30 days
 *   2. Appears in the static allBusinesses catalog with an ownerEmail
 *   3. Does NOT already have a paid B2B purchase (listed / featured / signature)
 *   4. Does NOT already have a row in sales_prospects (any status)
 *
 * Upsert uses ignoreDuplicates so re-runs are safe if the prospect was added
 * via another channel between the two checks.
 *
 * Auth: Bearer CRON_SECRET
 * Query params:
 *   ?preview=true    — dry-run; no writes, shows what would be enrolled
 *   ?slug=<slug>     — restrict to one business slug for testing
 *   ?min=<n>         — interaction threshold override (default 5)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { allBusinesses } from '@/data/localBusinesses';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

const SEQUENCE_ID = 'b2b-directory-upgrade-v1';
const DEFAULT_MIN_INTERACTIONS = 5;
const WINDOW_DAYS = 30;

// Paid B2B tier slugs — skip businesses already on these
const PAID_B2B_TIERS = ['listed', 'featured', 'signature'];

type DetailRow = { slug: string; outcome: string; reason?: string };

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
  const minInteractions = Math.max(
    1,
    parseInt(searchParams.get('min') ?? String(DEFAULT_MIN_INTERACTIONS), 10),
  );

  const supabase = createServiceClient();

  // ---------------------------------------------------------------------------
  // 1. Aggregate directory_events over the last WINDOW_DAYS days
  // ---------------------------------------------------------------------------
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  let eventsQuery = supabase
    .from('directory_events')
    .select('business_id')
    .gte('created_at', since);

  if (filterSlug) eventsQuery = eventsQuery.eq('business_id', filterSlug);

  const { data: events, error: eventsError } = await eventsQuery;
  if (eventsError) {
    return NextResponse.json({ ok: false, error: eventsError.message }, { status: 500 });
  }

  // Count interactions per slug
  const countsBySlug = new Map<string, number>();
  for (const ev of events ?? []) {
    const slug = ev.business_id as string;
    countsBySlug.set(slug, (countsBySlug.get(slug) ?? 0) + 1);
  }

  const qualifyingSlugs = [...countsBySlug.entries()]
    .filter(([, count]) => count >= minInteractions)
    .map(([slug]) => slug);

  if (qualifyingSlugs.length === 0) {
    return NextResponse.json({
      ok: true,
      preview,
      windowDays: WINDOW_DAYS,
      minInteractions,
      qualifyingSlugs: 0,
      candidates: 0,
      enrolled: 0,
      skipped: 0,
      details: [],
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Build slug → static-catalog lookup
  // ---------------------------------------------------------------------------
  const businessBySlug = new Map(allBusinesses.map((b) => [b.id, b]));

  // ---------------------------------------------------------------------------
  // 3. Find slugs with a paid B2B purchase (via business_id UUID FK → businesses)
  // ---------------------------------------------------------------------------
  const { data: paidRows } = await supabase
    .from('purchases')
    .select('businesses!inner(slug)')
    .in('tier_slug', PAID_B2B_TIERS)
    .eq('tier_audience', 'b2b')
    .eq('status', 'paid');

  const paidSlugs = new Set<string>();
  for (const row of paidRows ?? []) {
    const r = row as unknown as { businesses: { slug: string } | { slug: string }[] };
    const biz = Array.isArray(r.businesses) ? r.businesses[0] : r.businesses;
    if (biz?.slug) paidSlugs.add(biz.slug);
  }

  // ---------------------------------------------------------------------------
  // 4. Identify candidates: qualifying slug + ownerEmail + not already paid
  // ---------------------------------------------------------------------------
  type Candidate = { slug: string; ownerEmail: string; businessName: string; count: number; industrySlug: string };
  const candidates: Candidate[] = [];

  for (const slug of qualifyingSlugs) {
    const biz = businessBySlug.get(slug);
    if (!biz?.ownerEmail) continue;          // no contact — can't pitch
    if (paidSlugs.has(slug)) continue;       // already a paid subscriber
    candidates.push({
      slug,
      ownerEmail: biz.ownerEmail.toLowerCase(),
      businessName: biz.name,
      count: countsBySlug.get(slug) ?? 0,
      industrySlug: biz.industrySlug,
    });
  }

  if (candidates.length === 0) {
    return NextResponse.json({
      ok: true,
      preview,
      windowDays: WINDOW_DAYS,
      minInteractions,
      qualifyingSlugs: qualifyingSlugs.length,
      candidates: 0,
      enrolled: 0,
      skipped: 0,
      details: [],
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Check which owner emails already exist in sales_prospects (any status)
  // ---------------------------------------------------------------------------
  const candidateEmails = candidates.map((c) => c.ownerEmail);

  const { data: existingProspects } = await supabase
    .from('sales_prospects')
    .select('email')
    .in('email', candidateEmails);

  const existingEmails = new Set(
    (existingProspects ?? []).map((p) => (p.email as string).toLowerCase()),
  );

  // ---------------------------------------------------------------------------
  // 6. Enroll
  // ---------------------------------------------------------------------------
  let enrolled = 0;
  let skipped = 0;
  const details: DetailRow[] = [];

  for (const c of candidates) {
    if (existingEmails.has(c.ownerEmail)) {
      skipped++;
      details.push({ slug: c.slug, outcome: 'skipped', reason: 'already_prospect' });
      continue;
    }

    if (preview) {
      enrolled++;
      details.push({ slug: c.slug, outcome: 'preview_would_enroll' });
      continue;
    }

    const listingUrl = `https://www.hiltonahead.com/local/${c.industrySlug}#${c.slug}`;
    const now = new Date().toISOString();

    const { error: upsertError } = await supabase.from('sales_prospects').upsert(
      {
        email: c.ownerEmail,
        first_name: null,
        full_name: c.businessName,
        source_campaign: null,
        status: 'queued',
        current_sequence: SEQUENCE_ID,
        sequence_step: 0,
        next_touch_at: now,
        sequence_started_at: now,
        do_not_contact: false,
        enrichment_data: {
          business_name: c.businessName,
          total_interactions: c.count,
          listing_url: listingUrl,
          business_slug: c.slug,
          industry_slug: c.industrySlug,
        },
      },
      { onConflict: 'email', ignoreDuplicates: true },
    );

    if (upsertError) {
      details.push({ slug: c.slug, outcome: 'error', reason: upsertError.message });
    } else {
      enrolled++;
      details.push({ slug: c.slug, outcome: 'enrolled' });
    }
  }

  return NextResponse.json({
    ok: true,
    preview,
    windowDays: WINDOW_DAYS,
    minInteractions,
    qualifyingSlugs: qualifyingSlugs.length,
    candidates: candidates.length,
    enrolled,
    skipped,
    details,
  });
}
