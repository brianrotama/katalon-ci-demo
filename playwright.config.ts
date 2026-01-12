import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, devices } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [['html', { open: 'never' }]],

  use: {
    headless: process.env.HEADLESS !== 'false',
    launchOptions: {
      slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 0,
    },
  },

   projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://the-internet.herokuapp.com',
      },
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     baseURL: 'https://the-internet.herokuapp.com',
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     baseURL: 'https://the-internet.herokuapp.com',
    //   },
    // },
  ],

  outputDir: 'test-results',
});