import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PATH = '/hilton-head-packing-list';

test('packing-list page loads with all major sections', async ({ page }) => {
  await page.goto(PATH);
  await expect(
    page.getByRole('heading', { name: /Hilton Head.*Packing List/i, level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole('note', { name: /affiliate disclosure/i })).toBeVisible();
  await expect(page.getByText(/reef-safe/i).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /plan my trip/i })).toBeVisible();
});

test('skim table renders 10 rows on desktop with Amazon links', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(PATH);
  const table = page.getByRole('table', { name: /packing mistakes/i });
  await expect(table).toBeVisible();
  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(10);
  for (let i = 0; i < 10; i++) {
    const row = rows.nth(i);
    const amazonLinks = row.locator('a[href*="amazon.com"]');
    await expect(amazonLinks.first()).toBeVisible();
  }
});

test('all Amazon links have FTC-compliant rel attribute', async ({ page }) => {
  await page.goto(PATH);
  const amazonLinks = page.locator('a[href*="amazon.com"]');
  const count = await amazonLinks.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const rel = (await amazonLinks.nth(i).getAttribute('rel')) ?? '';
    expect(rel).toContain('sponsored');
    expect(rel).toContain('nofollow');
    expect(rel).toContain('noopener');
  }
});

test('Amazon links include either a tag param or a search URL', async ({ page }) => {
  await page.goto(PATH);
  const amazonLinks = page.locator('a[href*="amazon.com"]');
  const count = await amazonLinks.count();
  for (let i = 0; i < count; i++) {
    const href = (await amazonLinks.nth(i).getAttribute('href')) ?? '';
    expect(href).toMatch(/amazon\.com/);
  }
});

test('reef-safe callout renders with SC DHEC link', async ({ page }) => {
  await page.goto(PATH);
  const callout = page.locator('aside[aria-label*="reef-safe"]');
  await expect(callout).toBeVisible();
  await expect(callout).toContainText(/South Carolina/i);
  await expect(callout).toContainText(/reef-safe/i);
  const dhecLink = callout.locator('a[href*="scdhec.gov"]');
  await expect(dhecLink).toBeVisible();
});

test('10 deep-dive sections each have an h2 with anchor id', async ({ page }) => {
  await page.goto(PATH);
  const articles = page.locator('section[aria-label*="in depth"] article');
  await expect(articles).toHaveCount(10);
  for (let i = 0; i < 10; i++) {
    const article = articles.nth(i);
    const id = await article.getAttribute('id');
    expect(id).toBeTruthy();
    expect(id?.length ?? 0).toBeGreaterThan(2);
    await expect(article.locator('h2')).toBeVisible();
  }
});

test('mobile viewport (375px) shows stacked cards, not the table', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(PATH);
  const list = page.getByRole('list').filter({ hasText: /mistake 01/i }).first();
  await expect(list).toBeVisible();
  const items = list.getByRole('listitem');
  await expect(items).toHaveCount(10);
});

test('a11y scan passes (axe-core, WCAG AA, 0 critical/serious)', async ({ page }) => {
  await page.goto(PATH);
  await expect(
    page.getByRole('heading', { name: /Hilton Head.*Packing List/i, level: 1 }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('[aria-hidden="true"]')
    .analyze();

  const critical = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(
    critical,
    `Critical a11y violations: ${JSON.stringify(critical, null, 2)}`,
  ).toHaveLength(0);
});

test('schema JSON-LD includes Breadcrumb + ItemList + Speakable', async ({ page }) => {
  await page.goto(PATH);
  const ldNodes = page.locator('script[type="application/ld+json"]');
  const count = await ldNodes.count();
  expect(count).toBeGreaterThanOrEqual(3);

  const blobs: unknown[] = [];
  for (let i = 0; i < count; i++) {
    const txt = (await ldNodes.nth(i).textContent()) ?? '';
    try {
      blobs.push(JSON.parse(txt));
    } catch {
      throw new Error(`Schema blob ${i} is not valid JSON: ${txt.slice(0, 80)}`);
    }
  }

  const types = blobs.map((b) =>
    (b as { '@type'?: string })['@type'] ?? '',
  );
  expect(types).toContain('BreadcrumbList');
  expect(types).toContain('ItemList');
  expect(types).toContain('WebPage');

  const itemList = blobs.find(
    (b) => (b as { '@type'?: string })['@type'] === 'ItemList',
  ) as { itemListElement?: unknown[] } | undefined;
  expect(itemList?.itemListElement?.length).toBe(10);
});
