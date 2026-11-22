import { createClient } from '@/utils/supabase/server';

/**
 * Data layer for the business owner portal at /business.
 *
 * Everything here runs as the signed-in user through the SSR client, so RLS
 * on `businesses` (migration 017) and the column grants + stats function
 * (migration 026) are the security boundary. Callers must still gate with
 * requireBusinessOwner() and check the business id is one the user owns.
 */

/** Columns an owner may edit. Mirrors the grant in migration 026. */
export const LISTING_COLUMNS =
  'id, slug, industry_slug, tier, name, tagline, address, city, phone, website, hours, instagram, facebook, parking, dress_code, pet_friendly, owner_edited_at, updated_at';

export interface OwnedListing {
  id: string;
  slug: string;
  industry_slug: string;
  tier: string;
  name: string;
  tagline: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  hours: string | null;
  instagram: string | null;
  facebook: string | null;
  parking: string | null;
  dress_code: string | null;
  pet_friendly: boolean | null;
  owner_edited_at: string | null;
  updated_at: string;
}

export async function getOwnedListing(
  businessId: string,
): Promise<OwnedListing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('businesses')
    .select(LISTING_COLUMNS)
    .eq('id', businessId)
    .maybeSingle();
  if (error) {
    console.error('[businessPortal] listing fetch error:', error);
    return null;
  }
  return (data as OwnedListing | null) ?? null;
}

export type StatEvent = 'phone_click' | 'website_click' | 'inquiry_submit';

export interface MonthStats {
  /** First day of the month, YYYY-MM-DD (Eastern time). */
  month: string;
  phone: number;
  website: number;
  inquiries: number;
}

const STAT_KEY: Record<StatEvent, 'phone' | 'website' | 'inquiries'> = {
  phone_click: 'phone',
  website_click: 'website',
  inquiry_submit: 'inquiries',
};

/** Number of calendar months shown on the dashboard, current month included. */
export const STATS_MONTHS = 6;

/** YYYY-MM-01 for the Eastern-time month `offset` months before now. */
function monthKey(offset: number): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());
  const year = Number(parts.find((p) => p.type === 'year')?.value);
  const month = Number(parts.find((p) => p.type === 'month')?.value);
  const d = new Date(Date.UTC(year, month - 1 - offset, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Monthly phone-click / website-click / inquiry counts for one business,
 * newest month first, zero-filled for months with no activity.
 *
 * Returns null when stats can't be loaded (most likely migration 026 has
 * not been applied yet) so the dashboard can say so instead of showing
 * misleading zeros.
 */
export async function getListingStats(
  businessId: string,
): Promise<MonthStats[] | null> {
  const months: MonthStats[] = Array.from({ length: STATS_MONTHS }, (_, i) => ({
    month: monthKey(i),
    phone: 0,
    website: 0,
    inquiries: 0,
  }));
  const oldest = months[months.length - 1].month;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('business_portal_stats', {
    target_business_id: businessId,
    // Midnight UTC on the 1st is a few hours before midnight Eastern, so
    // this never cuts off the start of the oldest month.
    since: `${oldest}T00:00:00Z`,
  });
  if (error) {
    console.error('[businessPortal] stats error:', error);
    return null;
  }

  const byMonth = new Map(months.map((m) => [m.month, m]));
  for (const row of (data ?? []) as Array<{
    month: string;
    event_type: string;
    total: number;
  }>) {
    const bucket = byMonth.get(row.month);
    const key = STAT_KEY[row.event_type as StatEvent];
    if (bucket && key) bucket[key] = Number(row.total) || 0;
  }
  return months;
}

export function formatMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
