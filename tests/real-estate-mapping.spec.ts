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

  test('priceTierFor boundary cases', () => {
    // just below 2nd tier min → 1st tier ('under-750k')
    expect(priceTierFor(749_999).key).toBe('under-750k');
    // exactly 2nd tier min → 2nd tier ('750k-1.25m')
    expect(priceTierFor(750_000).key).toBe('750k-1.25m');
    // exactly 3rd tier min → 3rd tier ('1.25m-2m')
    expect(priceTierFor(1_250_000).key).toBe('1.25m-2m');
    // exactly 4th tier min → 4th tier ('2m-plus')
    expect(priceTierFor(2_000_000).key).toBe('2m-plus');
  });
});
