import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from './urls';

export class SecurePage extends BasePage {
  readonly flashMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.flashMessage = page.locator('#flash');
    this.logoutButton = page.locator('a[href="/logout"]');
  }

  async isAt() {
    await this.expectUrlContains(URLS.SECURE);
  }

  async logout() {
    await this.click(this.logoutButton);
  }
}
