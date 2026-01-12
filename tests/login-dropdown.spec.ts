import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SecurePage } from '../pages/SecurePage.js';
import { DropdownPage } from '../pages/DropdownPage.js';
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

/* 🧹 NORMALIZE + FILTER DROPDOWN ONLY */
const testData: TestData[] = rawData
  .map(row => ({
    module: String(row.module ?? '').trim().toLowerCase(),
    tc_name: String(row.tc_name ?? '').trim() || 'no test case name',
    username: String(row.username ?? '').trim(),
    password: String(row.password ?? '').trim(),
    success: Boolean(row.success),
  }))
  .filter(row => row.module === 'dropdown');

/* 🧪 GENERATE TESTS */
test.describe('dropdown module', () => {

  testData.forEach(({ tc_name, username, password, success }) => {

    test(`dropdown: ${tc_name} @dropdown`, async ({ page }) => {

      const loginPage = new LoginPage(page);
      const securePage = new SecurePage(page);
      const dropdownPage = new DropdownPage(page);

      /* 🔹 1. LOGIN */
      await securePage.loginAndAssert(username, password, success);

      if (!success) return;

      /* 🔹 2. DROPDOWN ACTION */
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