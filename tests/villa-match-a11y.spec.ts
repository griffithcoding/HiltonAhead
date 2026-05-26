/**
 * Accessibility tests for the Villa Match quiz.
 * Uses @axe-core/playwright to run WCAG 2.1 AA checks on key states.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function driveToResults(page: import('@playwright/test').Page) {
  await page.goto('/villa-match');
  await page.getByRole('radio', { name: 'Family vacation' }).click();
  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('radio', { name: /^Ocean/ }).click();
  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('radio', { name: /^Must/ }).click();
  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('radio', { name: /^Mid/ }).click();
  await page.getByRole('button', { name: /See my matches/ }).click();
  await expect(page.getByText('Your best match')).toBeVisible();
}

// ---------------------------------------------------------------------------
// a11y tests
// ---------------------------------------------------------------------------

test('quiz step 1 has no critical a11y violations', async ({ page }) => {
  await page.goto('/villa-match');
  await expect(page.getByRole('heading', { name: 'What kind of trip is this?' })).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('[aria-hidden="true"]') // exclude decorative images
    .analyze();

  const critical = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(critical, `Critical a11y violations: ${JSON.stringify(critical, null, 2)}`).toHaveLength(0);
});

test('quiz results page has no critical a11y violations', async ({ page }) => {
  await driveToResults(page);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('[aria-hidden="true"]')
    .analyze();

  const critical = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(critical, `Critical a11y violations: ${JSON.stringify(critical, null, 2)}`).toHaveLength(0);
});

test('PDF dialog has no critical a11y violations', async ({ page }) => {
  await driveToResults(page);
  await page.getByRole('button', { name: /Email me a one-page PDF/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('[aria-hidden="true"]')
    .analyze();

  const critical = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(critical, `Critical a11y violations: ${JSON.stringify(critical, null, 2)}`).toHaveLength(0);
});

test('radio buttons have accessible names', async ({ page }) => {
  await page.goto('/villa-match');

  // All radiogroup buttons should have accessible names
  const radios = page.getByRole('radio');
  const count = await radios.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const name = await radios.nth(i).getAttribute('aria-label') ??
      await radios.nth(i).textContent();
    expect(name?.trim().length ?? 0).toBeGreaterThan(0);
  }
});

test('stepper controls have aria-label', async ({ page }) => {
  await page.goto('/villa-match');
  await page.getByRole('radio', { name: 'Family vacation' }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  await expect(page.getByRole('button', { name: 'Decrease' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Increase' })).toBeVisible();
  // Live region announces the value
  await expect(page.locator('[aria-live="polite"]')).toBeVisible();
});

test('dialog is modal and has aria-modal', async ({ page }) => {
  await driveToResults(page);
  await page.getByRole('button', { name: /Email me a one-page PDF/i }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog).toHaveAttribute('aria-label', /villa match/i);
});

test('quiz page has exactly one h1', async ({ page }) => {
  await page.goto('/villa-match');

  const h1s = page.getByRole('heading', { level: 1 });
  await expect(h1s).toHaveCount(1);
});
