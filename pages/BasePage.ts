import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fill(locator: Locator, value: string) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.fill('');
    await locator.fill(value);
  }

  async click(locator: Locator) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  async expectUrlContains(text: string | RegExp) {
    await expect(this.page).toHaveURL(text);
  }
}