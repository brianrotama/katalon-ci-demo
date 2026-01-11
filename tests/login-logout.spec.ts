import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SecurePage } from '../pages/SecurePage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';

test('Login → Logout flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const securePage = new SecurePage(page);

  // 🔹 Ambil data dari Google Sheet (SELALU FRESH)
  const users = await readCsvFromUrl(process.env.GSHEET_URL!);
  const { username, password } = users[0];

  // 1️⃣ Login
  await loginPage.goto();
  await loginPage.login(username, password);

  // 2️⃣ Assert berhasil login
  await securePage.isAt();
  await expect(securePage.flashMessage)
    .toContainText('You logged into a secure area!');

  // 3️⃣ Logout
  await securePage.logout();

  // 4️⃣ Assert kembali ke login page
  await expect(page).toHaveURL(/\/login$/);
});
