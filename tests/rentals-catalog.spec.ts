import { test, expect } from '@playwright/test';
import {
  rentalsCatalog,
  rentalsByNeighborhood,
  allRentals,
  RENTAL_NEIGHBORHOODS,
} from '../data/rentalsCatalog';

test.describe('rentalsCatalog data module', () => {
  test('exposes the 6 neighborhood slugs', () => {
    expect(RENTAL_NEIGHBORHOODS).toEqual([
      'sea-pines',
      'palmetto-dunes',
      'forest-beach',
      'shelter-cove',
      'port-royal',
      'mid-island',
    ]);
  });

  test('every catalog entry has required fields and a valid neighborhood', () => {
    expect(rentalsCatalog.length).toBeGreaterThan(0);
    for (const r of rentalsCatalog) {
      expect(r.id, `id missing on ${JSON.stringify(r)}`).toBeTruthy();
      expect(RENTAL_NEIGHBORHOODS).toContain(r.neighborhood);
      expect(r.photoUrls.length).toBeGreaterThanOrEqual(1);
      expect(r.beds).toBeGreaterThanOrEqual(0);
      expect(r.baths).toBeGreaterThanOrEqual(0);
      expect(r.bookingDeeplink).toMatch(/^https?:\/\//);
      expect(r.pricePerNightBand).toBeTruthy();
    }
  });

  test('ids are unique', () => {
    const ids = rentalsCatalog.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('rentalsByNeighborhood filters correctly', () => {
    const sp = rentalsByNeighborhood('sea-pines');
    expect(sp.every((r) => r.neighborhood === 'sea-pines')).toBe(true);
  });

  test('allRentals returns the full set', () => {
    expect(allRentals().length).toBe(rentalsCatalog.length);
  });
});
