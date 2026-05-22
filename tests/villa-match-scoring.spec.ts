/**
 * Scoring integration tests — drive the quiz with specific inputs and assert
 * the top match headline. Verifies scoring weights + hard-floor logic
 * produce the expected archetype rankings end-to-end in the browser.
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helper: drive the 5-step quiz without a server running (uses baseURL)
// ---------------------------------------------------------------------------

async function driveQuiz(
  page: import('@playwright/test').Page,
  opts: {
    tripType: string | RegExp;
    view: string | RegExp;
    walk: string | RegExp;
    budget: string | RegExp;
  },
) {
  await page.goto('/villa-match');

  // Q1 — trip type
  await page.getByRole('radio', { name: opts.tripType }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Q2 — party size stepper: accept default (4 guests), advance
  await page.getByRole('button', { name: /^Next/ }).click();

  // Q3 — view
  await page.getByRole('radio', { name: opts.view }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Q4 — walk to beach
  await page.getByRole('radio', { name: opts.walk }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Q5 — budget
  await page.getByRole('radio', { name: opts.budget }).click();
  await page.getByRole('button', { name: /See my matches/ }).click();
}

// ---------------------------------------------------------------------------
// Scoring tests
// ---------------------------------------------------------------------------

test('couples + ocean + must + mid → Sea Pines 1BR headline wins', async ({ page }) => {
  await driveQuiz(page, {
    tripType: 'A trip for two',
    view: /^Ocean/,
    walk: /^Must/,
    budget: /^Mid/,
  });

  // Top match card shows "Your best match" + Sea Pines headline
  await expect(page.getByText('Your best match')).toBeVisible();
  await expect(page.getByText(/Sea Pines/i).first()).toBeVisible();
});

test('hard budget floor: value budget excludes luxury archetypes', async ({ page }) => {
  await driveQuiz(page, {
    tripType: 'A trip for two',
    view: /^Ocean/,
    walk: /^Must/,
    budget: /^Value/,
  });

  // Results still render — some matches survive
  await expect(page.getByText('Your best match')).toBeVisible();

  // No luxury headline should appear (luxury is 3 bands away from value → score = 0)
  await expect(page.locator('main')).not.toContainText(/\$30k and up/i);
});

test('family trip → family-tagged archetype wins over 1BR couples archetype', async ({ page }) => {
  await driveQuiz(page, {
    tripType: 'Family vacation',
    view: /^Ocean/,
    walk: /^Must/,
    budget: /^Mid/,
  });

  await expect(page.getByText('Your best match')).toBeVisible();

  // A couples-only 1BR should NOT be the top pick for a family trip
  const topSection = page.locator('text=Your best match').locator('..');
  await expect(topSection).not.toContainText(/1BR oceanfront in Sea Pines/i);
});

test('golf trip + golf view + fine-to-drive + premium → golf archetype surfaces', async ({ page }) => {
  await driveQuiz(page, {
    tripType: 'Golf trip',
    view: /^Golf course/,
    walk: /^We'll drive/,
    budget: /^Premium/,
  });

  await expect(page.getByText('Your best match')).toBeVisible();
  // A golf-relevant archetype should appear somewhere in results
  await expect(page.locator('main')).toContainText(/golf/i);
});

test('no-preference view still produces ≥1 match', async ({ page }) => {
  await driveQuiz(page, {
    tripType: 'Family vacation',
    view: /No strong preference/,
    walk: /^Nice to have/,
    budget: /^Mid/,
  });

  await expect(page.getByText('Your best match')).toBeVisible();
  // Alt matches panel should also appear (≥ 2 total results)
  await expect(page.getByText(/Or, depending on the week/i)).toBeVisible();
});

test('luxury budget + premium archetype shows in results', async ({ page }) => {
  await driveQuiz(page, {
    tripType: 'Friends getaway',
    view: /^Ocean/,
    walk: /^Must/,
    budget: /^Luxury/,
  });

  await expect(page.getByText('Your best match')).toBeVisible();
  // At least 1 result shown — luxury answers qualify luxury + premium archetypes (≤1 band)
  await expect(page.locator('main')).toContainText(/Hilton Head|Sea Pines|Palmetto Dunes|Forest Beach/i);
});
