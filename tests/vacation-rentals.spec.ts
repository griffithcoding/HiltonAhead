import { test, expect } from '@playwright/test';

test.describe('Vacation Rentals surface', () => {
  test('hub page renders hero, neighborhood cards, and live map', async ({ page }) => {
    await page.goto('/vacation-rentals');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vacation Rentals');
    // 6 neighborhood links
    await expect(page.getByRole('link', { name: /Sea Pines/i }).first()).toBeVisible();
    // Stay22 map iframe
    await expect(page.locator('iframe[src*="stay22.com"]')).toBeVisible();
  });

  test('neighborhood page renders a card with a sponsored affiliate link', async ({ page }) => {
    await page.goto('/vacation-rentals/sea-pines');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sea Pines');
    // TL;DR speakable block present
    await expect(page.locator('.tldr-block')).toBeVisible();
    // At least one outbound booking link, correctly marked sponsored + new tab
    const cta = page.getByRole('link', { name: /View on/i }).first();
    await expect(cta).toHaveAttribute('rel', /sponsored/);
    await expect(cta).toHaveAttribute('target', '_blank');
    // FAQ answers use the speakable selector
    await expect(page.locator('.faq-answer').first()).toBeVisible();
  });

  test('nav contains the Vacation Rentals item', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Vacation Rentals' }).first()).toBeVisible();
  });
});
