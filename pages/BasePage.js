import { expect } from '@playwright/test';

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fill(locator, value) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.fill('');
    await locator.fill(value);
  }

  async click(locator) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  async expectUrlContains(text) {
    await expect(this.page).toHaveURL(text);
  }
}