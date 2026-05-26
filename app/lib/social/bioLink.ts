/**
 * Bio-link resolver for /go/ig.
 *
 * Picks the "current featured" post in priority order:
 *   1. Most recent status='published' today
 *   2. status='approved' whose scheduled_at <= now()
 *   3. fallback to brand homepage
 *
 * Returns a destination URL + UTM campaign + post id (for logging).
 */

import { createServiceClient } from '@/utils/supabase/service';
import { brand } from '@/data/brand';

export type FeaturedResolution = {
  postId: string | null;
  destinationPath: string; // path only; absolute URL constructed by caller
  utmCampaign: string | null;
};

const HOMEPAGE_FALLBACK: FeaturedResolution = {
  postId: null,
  destinationPath: '/',
  utmCampaign: null,
};

export async function resolveCurrentFeatured(): Promise<FeaturedResolution> {
  const supabase = createServiceClient();
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  // 1. Most recent published today
  const { data: pubRows } = await supabase
    .from('social_posts')
    .select('id, business_slug, industry_slug, utm_campaign, published_at')
    .eq('status', 'published')
    .gte('published_at', todayStart.toISOString())
    .order('published_at', { ascending: false })
    .limit(1);

  if (pubRows && pubRows[0]) {
    const r = pubRows[0];
    return {
      postId: r.id,
      destinationPath: `/local/${r.industry_slug}/${r.business_slug}`,
      utmCampaign: r.utm_campaign,
    };
  }

  // 2. Approved whose scheduled_at <= now
  const { data: appRows } = await supabase
    .from('social_posts')
    .select('id, business_slug, industry_slug, utm_campaign, scheduled_at')
    .eq('status', 'approved')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: false })
    .limit(1);

  if (appRows && appRows[0]) {
    const r = appRows[0];
    return {
      postId: r.id,
      destinationPath: `/local/${r.industry_slug}/${r.business_slug}`,
      utmCampaign: r.utm_campaign,
    };
  }

  // 3. Fallback — brand homepage (or whatever brand.ctaTarget says if defined)
  const fallbackPath = (brand as { ctaTarget?: string }).ctaTarget ?? '/';
  return { ...HOMEPAGE_FALLBACK, destinationPath: fallbackPath };
}

export function stampUtm(destPath: string, utmCampaign: string | null): string {
  if (!utmCampaign) return destPath;
  // Build relative URL — works because Next redirect() accepts relative paths
  const [pathOnly, query = ''] = destPath.split('?');
  const params = new URLSearchParams(query);
  params.set('utm_source', 'instagram');
  params.set('utm_medium', 'social');
  params.set('utm_campaign', utmCampaign);
  return `${pathOnly}?${params.toString()}`;
}
