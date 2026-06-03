/**
 * Monthly refresh of neighborhood real estate trends from Redfin Data Center.
 *
 * Schedule: 1st of month, 06:00 UTC (vercel.json). Vercel Cron sends a GET with
 * Authorization: Bearer <CRON_SECRET>.
 *
 * Flow: download the zip-level Redfin market-tracker TSV, parse rows for the
 * Beaufort County zips we care about, map zip → neighborhood(s), compute the
 * latest month's metrics, upsert into market_trends.
 *
 * Redfin publishes tab-separated .tsv (often gzipped). This handler fetches the
 * configured CSV/TSV URL as text. If the file is gzipped, point
 * REDFIN_DATA_BASE_URL at the uncompressed mirror or extend with a gunzip step.
 */

import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { createServiceClient } from '@/utils/supabase/service';
import {
  NEIGHBORHOOD_REDFIN_REGIONS,
  type RedfinRegionMapping,
} from '@/data/realEstateTrends';
import type { RentalNeighborhoodSlug } from '@/data/rentalsCatalog';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

function isCronAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return (req.headers.get('authorization') || '') === `Bearer ${expected}`;
}

type RedfinRow = Record<string, string>;

export async function GET(req: NextRequest) {
  return handle(req);
}
export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const base = process.env.REDFIN_DATA_BASE_URL;
  if (!base) {
    return NextResponse.json({ ok: false, error: 'REDFIN_DATA_BASE_URL not set' }, { status: 500 });
  }

  // Zip-level tracker file. Confirm exact filename at the source during exec.
  const url = `${base}/zip_code_market_tracker.tsv000`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'HiltonAhead/1.0' } });
    if (!res.ok) throw new Error(`Redfin fetch ${res.status}`);
    const text = await res.text();

    const parsed = Papa.parse<RedfinRow>(text, {
      header: true,
      delimiter: '\t',
      skipEmptyLines: true,
    });

    // Collect all zips we care about.
    const wantedZips = new Set<string>();
    const slugsByZip = new Map<string, RentalNeighborhoodSlug[]>();
    for (const [slug, m] of Object.entries(NEIGHBORHOOD_REDFIN_REGIONS) as [
      RentalNeighborhoodSlug,
      RedfinRegionMapping,
    ][]) {
      for (const zip of m.zipCodes) {
        wantedZips.add(zip);
        slugsByZip.set(zip, [...(slugsByZip.get(zip) ?? []), slug]);
      }
    }

    // Redfin column names (zip tracker): region (e.g. "Zip Code: 29928"),
    // period_end, median_sale_price, median_ppsf, median_dom,
    // homes_sold, median_sale_price_yoy. Defend against schema drift.
    type Agg = {
      slug: RentalNeighborhoodSlug;
      month: string;
      median_sale_price: number | null;
      median_ppsf: number | null;
      median_dom: number | null;
      homes_sold: number | null;
      yoy_pct: number | null;
    };
    const latestBySlug = new Map<RentalNeighborhoodSlug, Agg>();

    for (const row of parsed.data) {
      const region = row['region'] || '';
      const zip = region.replace(/[^0-9]/g, '').slice(-5);
      if (!wantedZips.has(zip)) continue;
      const period = row['period_end'];
      if (!period) continue;

      for (const slug of slugsByZip.get(zip) ?? []) {
        const prev = latestBySlug.get(slug);
        if (prev && prev.month >= period) continue; // keep latest period only
        latestBySlug.set(slug, {
          slug,
          month: period,
          median_sale_price: num(row['median_sale_price']),
          median_ppsf: num(row['median_ppsf']),
          median_dom: int(row['median_dom']),
          homes_sold: int(row['homes_sold']),
          yoy_pct: pct(row['median_sale_price_yoy']),
        });
      }
    }

    if (latestBySlug.size === 0) {
      return NextResponse.json(
        { ok: true, skipped: 'no_matching_rows', wanted: [...wantedZips] },
        { status: 200 },
      );
    }

    const supabase = createServiceClient();
    const rows = [...latestBySlug.values()].map((a) => ({
      neighborhood_slug: a.slug,
      month: a.month,
      median_sale_price: a.median_sale_price,
      median_ppsf: a.median_ppsf,
      median_dom: a.median_dom,
      homes_sold: a.homes_sold,
      yoy_pct: a.yoy_pct,
      source: 'redfin-data-center',
      source_url: url,
    }));

    const { error } = await supabase
      .from('market_trends')
      .upsert(rows, { onConflict: 'neighborhood_slug,month' });
    if (error) throw new Error(`upsert failed: ${error.message}`);

    return NextResponse.json({ ok: true, upserted: rows.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[refresh-market-data] error:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

function num(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(v.replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
}
function int(v: string | undefined): number | null {
  const n = num(v);
  return n === null ? null : Math.round(n);
}
function pct(v: string | undefined): number | null {
  // Redfin yoy is a fraction (0.123 = 12.3%). Store as percent.
  const n = num(v);
  return n === null ? null : Math.round(n * 1000) / 10;
}
