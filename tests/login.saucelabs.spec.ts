import { test, expect } from '@playwright/test';

test('login with invalid credentials should fail', async ({ page }) => {
  await page.goto('https://saucelabs.com/login');

  // Tunggu input benar-benar siap (enabled + visible)
  const username = page.locator('input[type="text"]').first();
  const password = page.locator('input[type="password"]').first();

  await expect(username).toBeVisible();
  await expect(username).toBeEnabled();

await page.locator('input[aria-label="Username"]').fill('invalid_user');
await page.locator('input[aria-label="Password"]').fill('invalid_password');


  await page.getByRole('button', { name: /sign in/i }).click();

  // Assert gagal login (behavior-based)
  await expect(page).toHaveURL(/login/);
});
