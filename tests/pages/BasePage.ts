import { Page } from '@playwright/test';
import { testivAI } from 'testivai-visual-regression';

// Create a simple plugin for Playwright
const playwrightPlugin = () => ({
  name: 'playwright-plugin',
  init() {},
  async capture(name: string, page: any, options?: any) {
    // This is a simplified version of the plugin
    // The actual implementation would handle more options and edge cases
    const screenshotOptions = {
      fullPage: options?.fullPage || false,
      path: `.testivai/visual-regression/baseline/${name}.png`
    };
    
    if (options?.selector) {
      const locator = page.locator(options.selector);
      await locator.screenshot(screenshotOptions);
    } else {
      await page.screenshot(screenshotOptions);
    }
    
    return screenshotOptions.path;
  }
});

// Initialize testivAI with the playwright plugin
const testivai = testivAI.init({
  framework: 'playwright',
  baselineDir: '.testivai/visual-regression/baseline'
}).use(playwrightPlugin());

/**
 * Base class for all page objects
 * Provides common functionality for all pages
 */
export class BasePage {
  /**
   * The Playwright page object
   */
  protected readonly page: Page;
  
  /**
   * The base URL for the application
   */
  protected readonly baseURL: string = 'https://www.saucedemo.com';
  
  /**
   * Constructor for the BasePage
   * @param page The Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }
  
  /**
   * Navigate to a specific path
   * @param path The path to navigate to
   */
  async navigate(path: string = ''): Promise<void> {
    try {
      await this.page.goto(`${this.baseURL}/${path}`, {
        timeout: 30000,
        waitUntil: 'domcontentloaded' // Use 'domcontentloaded' instead of 'load' for better compatibility
      });
    } catch (error) {
      // If WebKit has an internal error, retry with a different waitUntil strategy
      if (error.message.includes('WebKit encountered an internal error')) {
        await this.page.goto(`${this.baseURL}/${path}`, {
          timeout: 30000,
          waitUntil: 'networkidle' // Try with 'networkidle' as a fallback
        });
      } else {
        throw error; // Re-throw other errors
      }
    }
  }
  
  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Take a screenshot of the current page
   * @param name The name of the screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await testivai.capture(name, this.page);
  }
  
  /**
   * Take a screenshot of a specific element
   * @param selector The selector for the element
   * @param name The name of the screenshot
   */
  async takeElementScreenshot(selector: string, name: string): Promise<void> {
    await testivai.capture(name, this.page, { 
      selector: selector 
    });
  }
  
  /**
   * Check if an element is visible
   * @param selector The selector for the element
   * @returns True if the element is visible, false otherwise
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }
  
  /**
   * Get the text of an element
   * @param selector The selector for the element
   * @returns The text of the element
   */
  async getText(selector: string): Promise<string> {
    return await this.page.innerText(selector);
  }
  
  /**
   * Click on an element
   * @param selector The selector for the element
   */
  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }
  
  /**
   * Fill a form field
   * @param selector The selector for the field
   * @param value The value to fill
   */
  async fill(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }
}
