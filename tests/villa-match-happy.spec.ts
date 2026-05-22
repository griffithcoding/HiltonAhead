import { test, expect } from '@playwright/test';

test('villa-match page loads', async ({ page }) => {
  await page.goto('/villa-match');
  await expect(page.getByRole('heading', { name: /Find your.*Hilton Head stay/i })).toBeVisible();
});

test('first step renders with disabled Next', async ({ page }) => {
  await page.goto('/villa-match');
  await expect(page.getByRole('heading', { name: 'What kind of trip is this?' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Next/ })).toBeDisabled();
});

test('selecting an option enables Next and advances', async ({ page }) => {
  await page.goto('/villa-match');
  await page.getByRole('radio', { name: 'Family vacation' }).click();
  await expect(page.getByRole('button', { name: /^Next/ })).toBeEnabled();
  await page.getByRole('button', { name: /^Next/ }).click();
  await expect(page.getByRole('heading', { name: 'How many of you?' })).toBeVisible();
});

test('completing the quiz shows a top match + 2 alts + CTAs', async ({ page }) => {
  await page.goto('/villa-match');

  // Q1
  await page.getByRole('radio', { name: 'Family vacation' }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Q2 — accept default party size 4
  await page.getByRole('button', { name: /^Next/ }).click();

  // Q3
  await page.getByRole('radio', { name: /^Ocean/ }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Q4
  await page.getByRole('radio', { name: /^Must/ }).click();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Q5
  await page.getByRole('radio', { name: /^Mid/ }).click();
  await page.getByRole('button', { name: /See my matches/ }).click();

  // Results
  await expect(page.getByText(/Your best match/i)).toBeVisible();
  await expect(page.getByText(/Or, depending on the week/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Start checking dates/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Email me a one-page PDF/i })).toBeVisible();
});

test('Start checking dates carries prefill into the itinerary form', async ({ page }) => {
  await driveQuiz(page);
  await page.getByRole('link', { name: /Start checking dates/i }).click();
  await expect(page).toHaveURL(/\/itinerary\?prefill=/);
});

async function driveQuiz(page: import('@playwright/test').Page) {
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
}

test('PDF dialog: email input is present and required', async ({ page }) => {
  await driveQuiz(page);
  await page.getByRole('button', { name: /Email me a one-page PDF/i }).click();
  const emailInput = page.getByLabel('Your email');
  await expect(emailInput).toBeVisible();
  await expect(emailInput).toHaveAttribute('type', 'email');
  await expect(emailInput).toHaveAttribute('required');
});
