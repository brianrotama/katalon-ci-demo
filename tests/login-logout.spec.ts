import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SecurePage } from '../pages/SecurePage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';

test('Login → Logout flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const securePage = new SecurePage(page);

  const users = await readCsvFromUrl(process.env.GSHEET_URL!);
  const { username, password, expected } = users[0]; // expected = boolean

  await loginPage.goto();
  await loginPage.login(username, password);

  const flashText = await securePage.flashMessage.textContent();
  const isLoginSuccess = flashText?.includes('secure area') ?? false;

  // 🔑 LOGIC UTAMA (BOOLEAN VS BOOLEAN)
  expect(isLoginSuccess).toBe(expected);

  // 🔍 ASSERT UI
  if (expected) {
    await expect(securePage.flashMessage)
      .toContainText('You logged into a secure area!');
    await securePage.logout();
    await expect(page).toHaveURL(/\/login$/);
  } else {
    await expect(securePage.flashMessage)
      .toContainText('invalid');
  }
});
