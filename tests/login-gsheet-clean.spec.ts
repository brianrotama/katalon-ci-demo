import { test } from '@playwright/test';
import { SecurePage } from '../pages/SecurePage.js';
import { readCsvFromUrl } from '../utils/csvFromUrl.js';

interface TestData {
  module: string;
  tc_name: string;
  username: string;
  password: string;
  success: boolean;
}

const SHEET_URL = process.env.GSHEET_URL!;
const rawData = await readCsvFromUrl(SHEET_URL);

const testData = rawData
  .map(row => ({
    module: String(row.module ?? '').trim().toLowerCase(),
    tc_name: String(row.tc_name ?? '').trim(),
    username: String(row.username ?? ''),
    password: String(row.password ?? ''),
    success: Boolean(row.success),
  }))
  .filter(row => row.module === 'login');

test.describe('login module', () => {

  testData.forEach(({ tc_name, username, password, success }) => {

    test(`login: ${tc_name} @login`, async ({ page }) => {

      const securePage = new SecurePage(page);

      await securePage.loginAndAssert(username, password, success);

    });

  });

});