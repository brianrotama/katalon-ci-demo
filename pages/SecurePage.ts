import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { LoginPage } from './LoginPage.js';
import { URLS } from './urls.js';

export class SecurePage extends BasePage {
  readonly flashMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.flashMessage = page.locator('#flash');
  }

  async loginAndAssert(
    username: string,
    password: string,
    shouldSucceed: boolean
  ) {
    const loginPage = new LoginPage(this.page);

    await loginPage.goto();
    await loginPage.login(username, password);

    if (shouldSucceed) {
      await this.assertLoginSuccess();
    } else {
      await loginPage.assertLoginFailed();
    }
  }

  async assertLoginSuccess() {
    await this.expectUrlContains(URLS.SECURE);

    await expect(
      this.flashMessage,
      'Expected successful login message'
    ).toContainText('You logged into a secure area!');
  }
}
