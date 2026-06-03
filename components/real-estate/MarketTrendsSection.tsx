import { getRentalArea, allRentalAreas } from '@/data/vacationRentals';
import { NEIGHBORHOOD_REDFIN_REGIONS } from '@/data/realEstateTrends';
import type { RentalNeighborhoodSlug } from '@/data/rentalsCatalog';
import { getMarketTrends, getLatestMarketTrendsForSlugs } from '@/app/lib/marketTrends';
import MarketStatsCard from '@/components/real-estate/MarketStatsCard';
import MarketPriceMap, { type PricePoint } from '@/components/real-estate/MarketPriceMap';
import TrendChart from '@/components/real-estate/TrendChart';
import RealtorBio from '@/components/real-estate/RealtorBio';
import RealtorReferralForm from '@/components/real-estate/RealtorReferralForm';

export default async function MarketTrendsSection({ slug }: { slug: string }) {
  const area = getRentalArea(slug);
  if (!area) return null;

  const region = NEIGHBORHOOD_REDFIN_REGIONS[slug as RentalNeighborhoodSlug];

  // 24-month history for this neighborhood + latest row
  const rows = await getMarketTrends(slug, 24);
  const latest = rows[0];

  // Batched ONE-query fetch for all neighborhoods (island price map)
  const areas = allRentalAreas();
  const latestBySlug = await getLatestMarketTrendsForSlugs(areas.map((a) => a.slug));

  const points: PricePoint[] = areas.map((a) => ({
    slug: a.slug,
    name: a.name,
    lat: a.geofence.center.lat,
    lng: a.geofence.center.lng,
    medianSalePrice: latestBySlug.get(a.slug)?.median_sale_price ?? null,
  }));

  return (
    <section className="mx-auto mb-16 max-w-4xl space-y-8">
      <div>
        <h2 className="display mb-2 text-2xl font-medium text-ink md:text-3xl">
          {area.name} real estate market trends
        </h2>
        {region && (
          <p className="text-sm leading-relaxed text-ink-soft">{region.blurb}</p>
        )}
      </div>

      <MarketStatsCard latest={latest} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MarketPriceMap
          points={points}
          center={area.geofence.center}
          zoom={11}
          focusSlug={slug}
        />
        <TrendChart rows={rows} />
      </div>

      <p className="text-xs text-ink-soft">
        Source: Redfin Data Center ({region?.redfinRegion ?? 'Hilton Head Island'}).
        {latest?.month ? ` Data through ${latest.month.slice(0, 7)}.` : ''}
        {' '}Historical sales data is provided for informational purposes only and is not investment advice.
      </p>

      {/* Realtor referral block */}
      <div className="space-y-4 rounded-2xl border border-rule-soft bg-sand-soft/50 p-6">
        <h3 className="display text-xl font-medium text-ink">
          Considering buying or selling in {area.name}?
        </h3>
        <RealtorBio />
        <RealtorReferralForm neighborhoodSlug={slug} />
      </div>
    </section>
  );
}
