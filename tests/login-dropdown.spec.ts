import { test, expect } from '@playwright/test';
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

/* 🔥 LOAD DATA */
const rawData = await readCsvFromUrl(SHEET_URL);

/* 🧹 NORMALIZE + FILTER LOGIN ONLY */
const testData: TestData[] = rawData
  .map(row => ({
    module: String(row.module ?? '').trim().toLowerCase(),
    tc_name: String(row.tc_name ?? '').trim() || 'no test case name',
    username: String(row.username ?? '').trim(),
    password: String(row.password ?? '').trim(),
    success: Boolean(row.success),
  }))
  .filter(row => row.module === 'dropdown'); // ⭐⭐⭐ PENTING

/* 🧠 GROUP BY MODULE */
const dataByModule = testData.reduce<Record<string, TestData[]>>(
  (acc, row) => {
    acc[row.module] ??= [];
    acc[row.module].push(row);
    return acc;
  },
  {}
);

/* 🧪 GENERATE TEST PER MODULE */
Object.entries(dataByModule).forEach(([moduleName, cases]) => {
  test.describe(`${moduleName} module`, () => {

    cases.forEach(({ tc_name, username, password, success }) => {
      test(
        `${moduleName}: ${tc_name} @${moduleName}`,
        async ({ page }) => {

          /* 🔹 1. LOGIN */
          await page.goto('https://the-internet.herokuapp.com/login');

          await page.fill('#username', username);
          await page.fill('#password', password);
          await page.click('button[type="submit"]');

          await expect(page.locator('#flash'))
            .toContainText('You logged into a secure area!');

          /* 🔹 2. NAVIGATE KE DROPDOWN */
          await page.goto('https://the-internet.herokuapp.com/dropdown');

          await expect(page.locator('h3'))
            .toHaveText('Dropdown List');

          const dropdown = page.locator('#dropdown');

          /* 🔹 3. ACTION BASED ON TC NAME */
          if (tc_name.toLowerCase().includes('select 1')) {
            await dropdown.selectOption('1');
            await expect(dropdown).toHaveValue('1');
          }

          if (tc_name.toLowerCase().includes('select 2')) {
            await dropdown.selectOption('2');
            await expect(dropdown).toHaveValue('2');
          }

          /* 🔹 4. ASSERT FINAL RESULT */
          expect(success).toBe(true);
        }
      );
    });

  });
});
