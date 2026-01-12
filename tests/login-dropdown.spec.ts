import { test } from '@playwright/test';
import { SecurePage } from '../pages/SecurePage.js';
import { DropdownPage } from '../pages/DropdownPage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';

/* =====================
   DATA INTERFACE
===================== */
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
   LOAD DATA
===================== */
const rawData = await readCsvFromUrl(SHEET_URL);

/* =====================
   NORMALIZE + FILTER
===================== */
const testData: TestData[] = rawData
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

    test(`dropdown: ${tc_name} @dropdown`, async ({ page }) => {

      const securePage = new SecurePage(page);
      const dropdownPage = new DropdownPage(page);

      /* 🔹 LOGIN — ALWAYS EXPECT SUCCESS */
      await securePage.loginAndAssert(username, password, true);

      /* 🔹 DROPDOWN ACTION */
      await dropdownPage.goto();

      if (tc_name.toLowerCase().includes('select 1')) {
        await dropdownPage.selectOption('1');
      }

      if (tc_name.toLowerCase().includes('select 2')) {
        await dropdownPage.selectOption('2');
      }

    });

  });

});