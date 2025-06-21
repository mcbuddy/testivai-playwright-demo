declare module 'testivai-visual-regression' {
  import { Page } from '@playwright/test';

  /**
   * Options for testivAI initialization
   */
  export interface testivAIOptions {
    framework: 'playwright' | 'cypress' | 'puppeteer' | 'selenium';
    baselineDir: string;
    compareDir?: string;
    reportDir?: string;
    diffThreshold?: number;
    updateBaselines?: boolean;
  }

  /**
   * Screenshot options
   */
  export interface ScreenshotOptions {
    fullPage?: boolean;
    selector?: string;
    [key: string]: any;
  }

  /**
   * Main class for testivAI Visual Regression
   */
  export class testivAI {
    /**
     * Initialize a new testivAI instance
     * @param options testivAI options
     * @returns testivAI instance
     */
    static init(options: testivAIOptions): testivAI;

    /**
     * Register a plugin
     * @param plugin Plugin to register
     * @returns testivAI instance for chaining
     */
    use(plugin: any): testivAI;

    /**
     * Capture a screenshot
     * @param name Name of the screenshot
     * @param target Framework-specific target (page, browser, etc.)
     * @param options Screenshot options
     * @returns Path to the captured screenshot
     */
    capture(name: string, target: any, options?: ScreenshotOptions): Promise<string>;
  }
}
