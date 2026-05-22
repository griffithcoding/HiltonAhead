import { test, expect } from '@playwright/test';

test('villa-match page loads', async ({ page }) => {
  await page.goto('/villa-match');
  await expect(page.getByRole('heading', { name: /Find your.*Hilton Head stay/i })).toBeVisible();
});
