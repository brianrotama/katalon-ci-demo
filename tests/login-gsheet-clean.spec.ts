import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SecurePage } from '../pages/SecurePage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';

interface LoginData {
  title: string;
  username: string;
  password: string;
  success: boolean;
}

const SHEET_URL = process.env.GSHEET_LOGIN_URL!;

if (!SHEET_URL) {
  throw new Error('GSHEET_LOGIN_URL is not defined');
}

/* 🔥 TAMBAHKAN DI SINI */
const rawData = await readCsvFromUrl(SHEET_URL);
console.log('RAW DATA:', rawData);

const loginData = rawData
  .filter(row => row.username && row.password) as LoginData[];

/* 🔥 GUARD (WAJIB) */
if (!loginData.length) {
  throw new Error('loginData kosong — test tidak bisa dibuat');
}

/* 🧪 TEST BARU DIBUAT DI SINI */
loginData.forEach(
  ({ title, username, password, success }: LoginData, index: number) => {
    test(`login (gsheet) #${index + 1}: ${title || username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const securePage = new SecurePage(page);

      await loginPage.goto();
      await loginPage.login(username, password);

      if (success) {
        await securePage.isAt();
        await expect(securePage.flashMessage)
          .toContainText('You logged into a secure area!');
        await page.goto('/logout');
      } else {
        await expect(page).toHaveURL(/login/);
        await expect(page.locator('#flash'))
          .toContainText('Your username is invalid!');
      }
    });
  }
);
