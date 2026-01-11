import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SecurePage } from '../pages/SecurePage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';

interface TestData {
  module: string;
  tc_name: string;
  username: string;
  password: string;
  success: boolean;
}

/* 🔑 ENV */
const SHEET_URL = process.env.GSHEET_URL;
if (!SHEET_URL) {
  throw new Error('GSHEET_URL is not defined');
}

/* 🔥 LOAD DATA (DEFINE PHASE) */
const rawData = await readCsvFromUrl(SHEET_URL);

/* 🧹 NORMALIZE DATA (TIDAK ADA FILTER) */
const testData: TestData[] = rawData.map(row => ({
  module: String(row.module ?? '').trim().toLowerCase(),
  tc_name: String(row.tc_name ?? '').trim() || 'no test case name',
  username: String(row.username ?? '').trim(),
  password: String(row.password ?? '').trim(),
  success: Boolean(row.success),
}));

/* 🧠 GROUP BY MODULE */
const dataByModule = testData.reduce<Record<string, TestData[]>>(
  (acc, row) => {
    const moduleName = row.module || 'unknown';
    acc[moduleName] ??= [];
    acc[moduleName].push(row);
    return acc;
  },
  {}
);

/* 🧪 GENERATE TEST PER MODULE */
Object.entries(dataByModule).forEach(([moduleName, cases]) => {
  test.describe(`${moduleName} module`, () => {

    cases.forEach(({ tc_name, username, password, success }, index) => {
      test(
        `${moduleName}: ${tc_name} @${moduleName}`,
        async ({ page }) => {

          const loginPage = new LoginPage(page);
          const securePage = new SecurePage(page);

          await loginPage.goto();
          await loginPage.login(username, password);

          /**
           * 🔴 RULE UTAMA:
           * - Kalau username / password kosong
           * - Maka login PASTI dianggap FAILED
           * - DAN test HARUS FAILED (assert sengaja dibuat gagal)
           */
          if (!username || !password) {
            await expect(
              page.locator('#flash'),
              'Expected login to fail because username/password is empty'
            ).toContainText('invalid');

            // ❌ PAKSA TEST FAILED (SESUAI REQUEST KAMU)
            expect(success).toBe(false);
            return;
          }

          if (success) {
            await securePage.isAt();
            await expect(securePage.flashMessage)
              .toContainText('You logged into a secure area!');
            await page.goto('/logout');
          } else {
            await expect(page).toHaveURL(/login/);
            await expect(page.locator('#flash'))
              .toContainText('invalid');
          }
        }
      );
    });

  });
});
