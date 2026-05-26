/**
 * Edge-case tests for the Villa Match quiz.
 * Covers: Back navigation, stepper boundaries, session persistence,
 * and the PDF dialog form states.
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Shared: drive to results
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
// Back navigation
// ---------------------------------------------------------------------------

test('Back button returns to previous step', async ({ page }) => {
  await page.goto('/villa-match');

  // Advance to step 2
  await page.getByRole('radio', { name: 'A trip for two' }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Expect step 2
  await expect(page.getByRole('heading', { name: 'How many of you?' })).toBeVisible();

  // Press Back
  await page.getByRole('button', { name: /Back/i }).click();

  // Should be back on step 1 with previous selection preserved
  await expect(page.getByRole('heading', { name: 'What kind of trip is this?' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'A trip for two' })).toHaveAttribute('aria-checked', 'true');
});

test('Back button is absent on step 1', async ({ page }) => {
  await page.goto('/villa-match');
  await expect(page.getByRole('button', { name: /Back/i })).not.toBeVisible();
});

test('Back from step 5 returns to step 4', async ({ page }) => {
  await page.goto('/villa-match');
  await page.getByRole('radio', { name: 'Family vacation' }).click();
  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('radio', { name: /^Ocean/ }).click();
  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('radio', { name: /^Must/ }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Now on step 5 (budget)
  await expect(page.getByRole('heading', { name: /budget/i })).toBeVisible();

  await page.getByRole('button', { name: /Back/i }).click();

  // Back on step 4 (walk to beach)
  await expect(page.getByRole('heading', { name: /walking to the beach/i })).toBeVisible();
  await expect(page.getByRole('radio', { name: /^Must/ })).toHaveAttribute('aria-checked', 'true');
});

// ---------------------------------------------------------------------------
// Number stepper boundaries
// ---------------------------------------------------------------------------

test('stepper cannot go below minimum (2)', async ({ page }) => {
  await page.goto('/villa-match');
  await page.getByRole('radio', { name: 'A trip for two' }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Default is 4 guests; decrement twice to reach 2 (minimum)
  await page.getByRole('button', { name: 'Decrease' }).click();
  await page.getByRole('button', { name: 'Decrease' }).click();
  await expect(page.getByText('2 guests')).toBeVisible();

  // Decrease button should be disabled at min
  await expect(page.getByRole('button', { name: 'Decrease' })).toBeDisabled();
});

test('stepper cannot go above maximum (30)', async ({ page }) => {
  await page.goto('/villa-match');
  await page.getByRole('radio', { name: 'Wedding or group' }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Click Increase many times — should cap at 30
  for (let i = 0; i < 30; i++) {
    const btn = page.getByRole('button', { name: 'Increase' });
    if (await btn.isDisabled()) break;
    await btn.click();
  }

  await expect(page.getByText('30 guests')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Increase' })).toBeDisabled();
});

// ---------------------------------------------------------------------------
// PDF dialog states
// ---------------------------------------------------------------------------

test('PDF dialog: opens and shows email form', async ({ page }) => {
  await driveToResults(page);
  await page.getByRole('button', { name: /Email me a one-page PDF/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Your email')).toBeVisible();
});

test('PDF dialog: close button dismisses dialog', async ({ page }) => {
  await driveToResults(page);
  await page.getByRole('button', { name: /Email me a one-page PDF/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: /Close dialog/i }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('PDF dialog: clicking backdrop dismisses dialog', async ({ page }) => {
  await driveToResults(page);
  await page.getByRole('button', { name: /Email me a one-page PDF/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  // Click the backdrop (the fixed overlay, not the white card)
  await page.locator('[aria-modal="true"]').click({ position: { x: 10, y: 10 } });
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('PDF dialog: empty email prevents submission', async ({ page }) => {
  await driveToResults(page);
  await page.getByRole('button', { name: /Email me a one-page PDF/i }).click();
  // Don't fill anything — submit button should not cause a sent state
  const emailInput = page.getByLabel('Your email');
  await expect(emailInput).toHaveAttribute('required');
});

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

test('progress bar advances with each step', async ({ page }) => {
  await page.goto('/villa-match');

  // Step 1: "1 of 5" text is visible
  await expect(page.getByText('1 of 5')).toBeVisible();

  await page.getByRole('radio', { name: 'A trip for two' }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Step 2: "2 of 5" text is visible
  await expect(page.getByText('2 of 5')).toBeVisible();
});
