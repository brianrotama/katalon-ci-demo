import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SecurePage } from '../pages/SecurePage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';

interface TestData {
  module: string;
  tc_name: string;
  username: string;
  password: string;
}

/* 🔑 ENV */
const SHEET_URL = process.env.GSHEET_URL;
if (!SHEET_URL) {
  throw new Error('GSHEET_URL is not defined');
}

/* 🔥 LOAD DATA (DEFINE PHASE) */
const rawData = await readCsvFromUrl(SHEET_URL);

/* 🧹 NORMALIZE + FILTER LOGIN ONLY */
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

/* 🧪 GENERATE TESTS */
test.describe('login module', () => {

  testData.forEach(({ tc_name, username, password }) => {

    test(`login: ${tc_name} @login`, async ({ page }) => {

      const loginPage = new LoginPage(page);
      const securePage = new SecurePage(page);

      /* 🔹 1. LOGIN */
      await loginPage.goto();
      await loginPage.login(username, password);

      /* 🔴 EMPTY USERNAME / PASSWORD → MUST FAIL */
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

    });

  });

});