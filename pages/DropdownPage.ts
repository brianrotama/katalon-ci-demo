import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { URLS } from './urls.js';

export class DropdownPage extends BasePage {
  readonly dropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.dropdown = page.locator('#dropdown');
  }

  async goto() {
    await this.page.goto(URLS.DROPDOWN);
    await expect(this.page.locator('h3')).toHaveText('Dropdown List');
  }

  /* ✅ GENERIC SELECT */
  async selectOption(value: string) {
    await this.dropdown.selectOption(value);
    await expect(this.dropdown).toHaveValue(value);
  }
}