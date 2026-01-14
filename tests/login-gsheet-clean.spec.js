import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SecurePage } from '../pages/SecurePage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';
import { reportToGSheet } from '../utils/reportToGSheet.js';

const SHEET_URL = process.env.GSHEET_URL;
if (!SHEET_URL) {
  throw new Error('GSHEET_URL is not defined');
}

/**
 * ✅ FETCH DATA DI LOAD TIME
 * BUKAN di beforeAll
 */
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

console.log(`[GSHEET] Loaded ${testData.length} login rows`);

test.describe.serial('login module', () => {

  testData.forEach((data, index) => {
    test(`@login login case #${index + 1}: ${data.tc_name}`, async ({ page }) => {

      const { tc_name, username, password } = data;
      const loginPage = new LoginPage(page);
      const securePage = new SecurePage(page);

      let status = 'PASSED';

      try {
        await loginPage.goto();
        await loginPage.login(username, password);

        // ✅ EMPTY INPUT SUPPORT
        if (!username || !password) {
          await loginPage.assertLoginFailed();
          return;
        }

        // ✅ NEGATIVE CASE
        if (tc_name.toLowerCase().includes('invalid')) {
          await loginPage.assertLoginFailed();
          return;
        }

        // ✅ POSITIVE CASE
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