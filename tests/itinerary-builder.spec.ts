import { test, expect } from '@playwright/test';

/**
 * Smoke test for /hilton-head-itinerary-builder.
 *
 * playwright.config.ts has no webServer / baseURL configured, so this expects
 * a server already running on localhost:3000 (`npm run dev` or `npm run start`).
 * Run with: npx playwright test tests/itinerary-builder.spec.ts
 */

const URL = 'http://localhost:3000/hilton-head-itinerary-builder';

test('renders the page with an itinerary-builder title', async ({ page }) => {
  const res = await page.goto(URL);
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Itinerary Builder/i);
});

test('renders Day 1 and the trip-type controls', async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByText('Day 1', { exact: false }).first()).toBeVisible();
  // Trip-type buttons come from TRIP_TYPES (Family / Couples / Golf / Beach & Chill).
  await expect(
    page.getByRole('button', { name: /Family trip/i }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /Golf trip/i })).toBeVisible();
});

test('?days=7&type=golf renders 7 day cards', async ({ page }) => {
  await page.goto(`${URL}?days=7&type=golf`);
  // Each day card header renders "Day N".
  const dayHeaders = page.locator('text=/^Day \\d+$/');
  await expect(dayHeaders).toHaveCount(7);
});

test('renders at least one FTC-compliant affiliate link', async ({ page }) => {
  // Default is family → the dolphin/nature cruise (Viator) appears in the
  // afternoon pool, so there is always >= 1 sponsored affiliate link.
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
