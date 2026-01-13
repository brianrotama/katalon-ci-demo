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
===================== */
const rawData = await readCsvFromUrl(SHEET_URL);

/* =====================
   NORMALIZE + FILTER
===================== */
const testData = rawData
  .map(row => ({
    module: String(row.module ?? '').trim().toLowerCase(),
    tc_name: String(row.tc_name ?? '').trim(),
    username: String(row.username ?? '').trim(),
    password: String(row.password ?? '').trim(),
  }))
  .filter(row => row.module === 'dropdown');

/* =====================
   TESTS
===================== */
test.describe('dropdown module', () => {

  testData.forEach(({ tc_name, username, password }) => {

    test(
      `dropdown: ${tc_name} @dropdown`,
      async ({ page }, testInfo) => {

        const securePage = new SecurePage(page);
        const dropdownPage = new DropdownPage(page);

        try {
          /* 🔹 1. LOGIN (ASSERT DI POM) */
          await securePage.loginAndAssert(username, password, true);

          /* 🔹 2. DROPDOWN ACTION */
          await dropdownPage.goto();

          if (tc_name.toLowerCase().includes('select 1')) {
            await dropdownPage.selectOption('1');
          }

          if (tc_name.toLowerCase().includes('select 2')) {
            await dropdownPage.selectOption('2');
          }

        } finally {
          /* 🔥 AUTO REPORT KE GOOGLE SHEET */
          const status =
            testInfo.status === 'passed' ? 'PASSED' : 'FAILED';

          await reportToGSheet(tc_name, status);
        }
      }
    );

  });

});