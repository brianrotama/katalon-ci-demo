import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SecurePage } from '../pages/SecurePage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';
import { reportToGSheet } from '../utils/reportToGSheet.js';

const SHEET_URL = process.env.GSHEET_URL;
if (!SHEET_URL) {
  throw new Error('GSHEET_URL is not defined');
}

const rawData = await readCsvFromUrl(SHEET_URL);

const testData = rawData
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

test.describe('login module', () => {

  testData.forEach(({ tc_name, username, password }) => {

    test(`login: ${tc_name} @login`, async ({ page }) => {

      const loginPage = new LoginPage(page);
      const securePage = new SecurePage(page);

      let status = 'PASSED';

      try {
        await loginPage.goto();
        await loginPage.login(username, password);

        if (!username || !password) {
          await loginPage.assertLoginFailed();
          return;
        }

        if (tc_name.toLowerCase().includes('invalid')) {
          await loginPage.assertLoginFailed();
          return;
        }

        await securePage.assertLoginSuccess();

      } catch (err) {
        status = 'FAILED';
        throw err;
      } finally {
        await reportToGSheet(tc_name, status);
      }
    });

  });

});