/**
 * Maps each rental neighborhood to its Redfin Data Center region(s) and the
 * Beaufort County zip codes it spans, plus the price-tier color scale used by
 * the market price-tier map.
 *
 * Redfin region IDs: confirm during execution by inspecting the chosen CSV at
 * REDFIN_DATA_BASE_URL (the zip-level "redfin_market_tracker" file). Hilton
 * Head Island zips: 29926 (north/mid), 29928 (south/Sea Pines/Forest Beach),
 * 29938 (PO boxes — usually excluded). If a finer region id is unavailable,
 * fall back to zip-level aggregation, which the cron already does.
 */

import type { RentalNeighborhoodSlug } from '@/data/rentalsCatalog';

export type RedfinRegionMapping = {
  /** Redfin region label as it appears in the CSV "region" column. */
  redfinRegion: string;
  zipCodes: readonly string[];
  /** 1-sentence interpretation guide shown under the chart. */
  blurb: string;
};

export const NEIGHBORHOOD_REDFIN_REGIONS: Record<
  RentalNeighborhoodSlug,
  RedfinRegionMapping
> = {
  'sea-pines': {
    redfinRegion: 'Zip Code: 29928',
    zipCodes: ['29928'],
    blurb: 'South-end gated plantation — the island\'s priciest tier.',
  },
  'palmetto-dunes': {
    redfinRegion: 'Zip Code: 29928',
    zipCodes: ['29928'],
    blurb: 'Mid-island resort core; villa-and-condo heavy.',
  },
  'forest-beach': {
    redfinRegion: 'Zip Code: 29928',
    zipCodes: ['29928'],
    blurb: 'Walkable beach condos near Coligny; entry-to-mid tier.',
  },
  'shelter-cove': {
    redfinRegion: 'Zip Code: 29928',
    zipCodes: ['29928'],
    blurb: 'Marina condos on Broad Creek; mid tier.',
  },
  'port-royal': {
    redfinRegion: 'Zip Code: 29926',
    zipCodes: ['29926'],
    blurb: 'North-end gated homes; mid-to-upper tier.',
  },
  'mid-island': {
    redfinRegion: 'Zip Code: 29926',
    zipCodes: ['29926'],
    blurb: 'Central island; the island\'s value tier.',
  },
};

export type PriceTier = {
  key: string;
  label: string;
  /** Inclusive lower bound in USD. */
  min: number;
  /** Tailwind-token-aligned hex for the map fill (no leading #). */
  colorHex: string;
};

export const PRICE_TIERS: readonly PriceTier[] = [
  { key: 'under-750k', label: 'Under $750k', min: 0, colorHex: 'F2C84B' }, // gold
  { key: '750k-1.25m', label: '$750k–$1.25M', min: 750_000, colorHex: 'E08A3C' }, // gold-deep
  { key: '1.25m-2m', label: '$1.25M–$2M', min: 1_250_000, colorHex: 'C44A2B' }, // coral
  { key: '2m-plus', label: '$2M+', min: 2_000_000, colorHex: '0A2930' }, // ink
] as const;

export function priceTierFor(medianSalePrice: number): PriceTier {
  let tier = PRICE_TIERS[0];
  for (const t of PRICE_TIERS) {
    if (medianSalePrice >= t.min) tier = t;
  }
  return tier;
}
