import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { URLS } from './urls.js';
import { LoginPage } from './LoginPage.js';

export class SecurePage extends BasePage {
  constructor(page) {
    super(page);
    this.flashMessage = page.locator('#flash');
  }

  /* ✅ ASSERT LOGIN SUCCESS */
  async assertLoginSuccess() {
    await this.expectUrlContains(URLS.SECURE);

    await expect(
      this.flashMessage,
      'Expected successful login message'
    ).toContainText('You logged into a secure area!');
  }

  /* 🔁 HELPER: LOGIN + ASSERT */
  async loginAndAssert(username, password, shouldSucceed = true) {
    const loginPage = new LoginPage(this.page);

    await loginPage.goto();
    await loginPage.login(username, password);

    if (shouldSucceed) {
      await this.assertLoginSuccess();
    } else {
      await loginPage.assertLoginFailed();
    }
  }
}