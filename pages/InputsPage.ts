import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { URLS } from './urls.js';

export class InputsPage extends BasePage {
  readonly numberInput: Locator;

  constructor(page: Page) {
    super(page);
    this.numberInput = page.locator('input[type="number"]');
  }

  async goto() {
    await this.page.goto(URLS.INPUTS);
  }

  async fillNumber(value: number) {
    await this.fill(this.numberInput, value.toString());
  }
}
