import { test } from '@playwright/test';
import { SecurePage } from '../pages/SecurePage.js';
import { DropdownPage } from '../pages/DropdownPage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';
import { reportToGSheet } from '../utils/reportToGSheet.js';

/* =====================
   ENV
===================== */
const SHEET_URL = process.env.GSHEET_URL;
if (!SHEET_URL) {
  throw new Error('GSHEET_URL is not defined');
}

/* =====================
   LOAD DATA (DEFINE PHASE)
   ⚠️ HARUS DI SINI (BUKAN beforeAll)
===================== */
const rawData = await readCsvFromUrl(SHEET_URL);

/* =====================
   NORMALIZE + FILTER
===================== */
const testData = rawData
  .map(row => ({
    module: String(row.module ?? '').trim().toLowerCase(),
    tc_name: String(row.tc_name ?? '').trim() || 'no test case name',
    username: String(row.username ?? '').trim(),
    password: String(row.password ?? '').trim(),
  }))
  .filter(row => row.module === 'dropdown');

if (!testData.length) {
  throw new Error('No dropdown test data found in Google Sheet');
}

console.log(`[GSHEET] Loaded ${testData.length} dropdown rows`);

/* =====================
   TESTS
===================== */
test.describe.serial('dropdown module', () => {

  testData.forEach((data, index) => {

    test(
      `@dropdown dropdown case #${index + 1}: ${data.tc_name}`,
      async ({ page }, testInfo) => {

        const { tc_name, username, password } = data;
        const securePage = new SecurePage(page);
        const dropdownPage = new DropdownPage(page);

        let status = 'PASSED';

        try {
          /* 🔹 1. LOGIN */
          await securePage.loginAndAssert(username, password, true);

          /* 🔹 2. DROPDOWN PAGE */
          await dropdownPage.goto();

          if (tc_name.toLowerCase().includes('select 1')) {
            await dropdownPage.selectOption('1');
          } else if (tc_name.toLowerCase().includes('select 2')) {
            await dropdownPage.selectOption('2');
          } else {
            throw new Error(`Unknown dropdown action: ${tc_name}`);
          }

        } catch (err) {
          status = 'FAILED';
          throw err;
        } finally {
          /* 🔥 AUTO REPORT KE GOOGLE SHEET */
          await reportToGSheet(tc_name, status);
        }
      }
    );

  });

});