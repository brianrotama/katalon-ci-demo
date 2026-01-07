import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SecurePage } from '../pages/SecurePage';

test('Login → Logout flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const securePage = new SecurePage(page);

  // 1️⃣ Login
  await loginPage.goto();
  await loginPage.login('tomsmith', 'SuperSecretPassword!');

  // Assert berhasil login
  await securePage.isAt();
  await expect(securePage.flashMessage)
    .toContainText('You logged into a secure area!');

  // 2️⃣ Logout (via UI, karena kita masih di /secure)
  await securePage.logout();

  // Assert kembali ke login page
  await expect(page).toHaveURL(/login/);
});
