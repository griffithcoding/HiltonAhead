import { test, expect } from '@playwright/test';
import { rentalAreas, getRentalArea } from '../data/vacationRentals';
import { RENTAL_NEIGHBORHOODS } from '../data/rentalsCatalog';

test.describe('vacationRentals editorial module', () => {
  test('has an entry for every neighborhood slug', () => {
    for (const slug of RENTAL_NEIGHBORHOODS) {
      const area = getRentalArea(slug);
      expect(area, `missing area for ${slug}`).toBeTruthy();
      expect(area!.geofence.center.lat).toBeGreaterThan(31);
      expect(area!.geofence.center.lat).toBeLessThan(33);
      expect(area!.tldr.length).toBeLessThanOrEqual(280);
      expect(area!.faq.length).toBeGreaterThanOrEqual(2);
      expect(area!.bestForLinks.length).toBeGreaterThanOrEqual(3);
    }
  });

  test('rentalAreas keys match RENTAL_NEIGHBORHOODS', () => {
    expect(Object.keys(rentalAreas).sort()).toEqual(
      [...RENTAL_NEIGHBORHOODS].sort(),
    );
  });
});
