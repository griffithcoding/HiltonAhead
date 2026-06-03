import { createClient } from '@/utils/supabase/server';

export type MarketTrendRow = {
  neighborhood_slug: string;
  month: string;
  median_sale_price: number | null;
  median_ppsf: number | null;
  median_dom: number | null;
  homes_sold: number | null;
  yoy_pct: number | null;
};

/** Read up to `limit` most-recent months for a neighborhood (public RLS read). */
export async function getMarketTrends(
  slug: string,
  limit = 24,
): Promise<MarketTrendRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('market_trends')
      .select('neighborhood_slug, month, median_sale_price, median_ppsf, median_dom, homes_sold, yoy_pct')
      .eq('neighborhood_slug', slug)
      .order('month', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('[marketTrends] read error:', error);
      return [];
    }
    return (data ?? []) as MarketTrendRow[];
  } catch (err) {
    console.error('[marketTrends] unexpected:', err);
    return [];
  }
}
