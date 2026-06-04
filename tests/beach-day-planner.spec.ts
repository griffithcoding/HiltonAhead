import { test, expect } from '@playwright/test';

/**
 * Smoke test for /hilton-head-beach-day-planner.
 *
 * playwright.config.ts has no webServer / baseURL configured, so this expects
 * a server already running on localhost:3000 (`npm run dev` or `npm run start`).
 * Run with: npx playwright test tests/beach-day-planner.spec.ts
 */

const URL = 'http://localhost:3000/hilton-head-beach-day-planner';

test('renders the page with a beach-day title', async ({ page }) => {
  const res = await page.goto(URL);
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Beach Day/i);
});

test('the date input is visible', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('input[type="date"]')).toBeVisible();
});

test('renders at least one FTC-compliant affiliate link', async ({ page }) => {
  // The "Dolphin & nature cruise" activity (tide: 'any', Viator) always shows
  // regardless of the day's tides, so there is always >= 1 affiliate link.
  await page.goto(URL);
  const sponsored = page.locator(
    'a[rel="sponsored nofollow noopener noreferrer"]',
  );
  expect(await sponsored.count()).toBeGreaterThan(0);
});

test('emits WebApplication and FAQPage JSON-LD', async ({ page }) => {
  await page.goto(URL);
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const joined = blocks.join('\n');
  expect(joined).toContain('"@type":"WebApplication"');
  expect(joined).toContain('"@type":"FAQPage"');
});
