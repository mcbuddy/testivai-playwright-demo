import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the login page
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameInput = '#user-name';
  private readonly passwordInput = '#password';
  private readonly loginButton = '#login-button';
  private readonly errorMessage = '.error-message-container';

  /**
   * Constructor for the LoginPage
   * @param page The Playwright page object
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the login page
   */
  async navigate(): Promise<void> {
    await super.navigate();
  }

  /**
   * Login with the provided credentials
   * @param username The username
   * @param password The password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForNavigation();
  }

  /**
   * Get the error message if login fails
   * @returns The error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if the error message is displayed
   * @returns True if the error message is displayed, false otherwise
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Take a screenshot of the login page
   * @param name The name of the screenshot
   */
  async takeLoginScreenshot(name: string = 'login-page'): Promise<void> {
    await this.takeScreenshot(name);
  }
}
