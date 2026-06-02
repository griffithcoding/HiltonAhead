import { test, expect } from '@playwright/test';
import {
  NEIGHBORHOOD_REDFIN_REGIONS,
  PRICE_TIERS,
  priceTierFor,
} from '../data/realEstateTrends';
import { RENTAL_NEIGHBORHOODS } from '../data/rentalsCatalog';

test.describe('realEstateTrends mapping', () => {
  test('every neighborhood has a region mapping with at least one zip', () => {
    for (const slug of RENTAL_NEIGHBORHOODS) {
      const m = NEIGHBORHOOD_REDFIN_REGIONS[slug];
      expect(m, `missing region mapping for ${slug}`).toBeTruthy();
      expect(m.zipCodes.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('priceTierFor buckets values into known tiers', () => {
    expect(priceTierFor(500_000).key).toBe(PRICE_TIERS[0].key);
    expect(priceTierFor(5_000_000).key).toBe(PRICE_TIERS[PRICE_TIERS.length - 1].key);
  });
});
