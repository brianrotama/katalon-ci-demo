import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SecurePage } from '../pages/SecurePage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';
import { reportToGSheet } from '../utils/reportToGSheet.js';

interface TestData {
  module: string;
  tc_name: string;
  username: string;
  password: string;
}

/* =====================
   ENV
===================== */
const SHEET_URL = process.env.GSHEET_URL;
if (!SHEET_URL) {
  throw new Error('GSHEET_URL is not defined');
}

/* =====================
   LOAD DATA (DEFINE PHASE)
===================== */
const rawData = await readCsvFromUrl(SHEET_URL);

/* =====================
   NORMALIZE + FILTER
===================== */
const testData: TestData[] = rawData
  .map(row => ({
    module: String(row.module ?? '').trim().toLowerCase(),
    tc_name: String(row.tc_name ?? '').trim() || 'no test case name',
    username: String(row.username ?? '').trim(),
    password: String(row.password ?? '').trim(),
  }))
  .filter(row => row.module === 'login');

if (!testData.length) {
  throw new Error('No login test data found in Google Sheet');
}

/* =====================
   TESTS
===================== */
test.describe('login module', () => {

  testData.forEach(({ tc_name, username, password }) => {

    test(`login: ${tc_name} @login`, async ({ page }) => {

      const loginPage = new LoginPage(page);
      const securePage = new SecurePage(page);

      let status: 'PASSED' | 'FAILED' = 'PASSED';

      try {
        /* 🔹 LOGIN */
        await loginPage.goto();
        await loginPage.login(username, password);

        /* 🔴 EMPTY USERNAME / PASSWORD */
        if (!username || !password) {
          await loginPage.assertLoginFailed();
          return;
        }

        /* 🟡 INVALID LOGIN (by tc_name) */
        if (tc_name.toLowerCase().includes('invalid')) {
          await loginPage.assertLoginFailed();
          return;
        }

        /* 🟢 VALID LOGIN */
        await securePage.assertLoginSuccess();

      } catch (err) {
        status = 'FAILED';
        throw err; // ⬅️ tetap fail di Playwright
      } finally {
        /* 📤 REPORT KE GOOGLE SHEET */
        await reportToGSheet(tc_name, status);
      }

    });

  });

});
