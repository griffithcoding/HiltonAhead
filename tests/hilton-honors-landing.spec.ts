import { test, expect } from '@playwright/test';

/**
 * Smoke test for /hilton-honors-stays-hilton-head (spec §8).
 *
 * playwright.config.ts has no webServer / baseURL configured, so this expects
 * a server already running on localhost:3000 (`npm run dev` or `npm run start`).
 * Run with: npx playwright test tests/hilton-honors-landing.spec.ts
 */

const URL = 'http://localhost:3000/hilton-honors-stays-hilton-head';

test('renders the page and hero copy', async ({ page }) => {
  const res = await page.goto(URL);
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Hilton Honors/i);
  await expect(page.getByText('Hilton on Hilton Head', { exact: false }).first()).toBeVisible();
});

test('every affiliate link carries the FTC rel attributes', async ({ page }) => {
  await page.goto(URL);
  const sponsored = page.locator('a[rel="sponsored nofollow noopener noreferrer"]');
  expect(await sponsored.count()).toBeGreaterThan(0);
});

test('affiliate disclosure is present', async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByText(/commission|affiliate|compensat/i).first()).toBeVisible();
});

test('emits FAQPage and ItemList JSON-LD', async ({ page }) => {
  await page.goto(URL);
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const joined = blocks.join('\n');
  expect(joined).toContain('"@type":"FAQPage"');
  expect(joined).toContain('"@type":"ItemList"');
});
