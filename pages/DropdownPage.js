import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { URLS } from './urls.js';

export class DropdownPage extends BasePage {
  constructor(page) {
    super(page);
    this.dropdown = page.locator('#dropdown');
  }

  async goto() {
    await this.page.goto(URLS.DROPDOWN);
    await expect(this.page.locator('h3')).toHaveText('Dropdown List');
  }

  /* ✅ GENERIC SELECT */
  async selectOption(value) {
    await this.dropdown.selectOption(value);
    await expect(this.dropdown).toHaveValue(value);
  }
}
