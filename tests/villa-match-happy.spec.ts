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
