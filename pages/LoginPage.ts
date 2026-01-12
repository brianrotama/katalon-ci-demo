import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { URLS } from './urls.js';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.flashMessage = page.locator('#flash');
  }

  async goto() {
    await this.page.goto(URLS.LOGIN);
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /* ❌ ASSERT LOGIN FAILED */
  async assertLoginFailed() {
    await expect(
      this.flashMessage,
      'Expected error message for invalid credentials'
    ).toHaveClass(/error/);

    await expect(this.flashMessage).toContainText('invalid');
  }

  /* ✅ ASSERT LOGIN SUCCESS */
  async assertLoginSuccess() {
    await expect(
      this.flashMessage,
      'Expected success message after login'
    ).toHaveClass(/success/);

    await expect(this.flashMessage).toContainText('secure area');
  }
}