import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the checkout process
 */
export class CheckoutPage extends BasePage {
  // Selectors for checkout information page
  private readonly checkoutForm = '.checkout_info';
  private readonly firstNameInput = '#first-name';
  private readonly lastNameInput = '#last-name';
  private readonly postalCodeInput = '#postal-code';
  private readonly continueButton = '#continue';
  private readonly cancelButton = '#cancel';
  private readonly errorMessage = '.error-message-container';

  // Selectors for checkout overview page
  private readonly checkoutSummary = '.checkout_summary_container';
  private readonly cartItems = '.cart_item';
  private readonly itemNames = '.inventory_item_name';
  private readonly itemPrices = '.inventory_item_price';
  private readonly subtotalLabel = '.summary_subtotal_label';
  private readonly taxLabel = '.summary_tax_label';
  private readonly totalLabel = '.summary_total_label';
  private readonly finishButton = '#finish';

  // Selectors for checkout complete page
  private readonly checkoutComplete = '.checkout_complete_container';
  private readonly completeHeader = '.complete-header';
  private readonly backHomeButton = '#back-to-products';

  /**
   * Constructor for the CheckoutPage
   * @param page The Playwright page object
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the checkout information page
   */
  async navigate(): Promise<void> {
    await super.navigate('checkout-step-one.html');
  }

  /**
   * Check if the checkout information page is loaded
   * @returns True if the checkout information page is loaded, false otherwise
   */
  async isCheckoutInfoLoaded(): Promise<boolean> {
    return await this.isVisible(this.checkoutForm);
  }

  /**
   * Check if the checkout overview page is loaded
   * @returns True if the checkout overview page is loaded, false otherwise
   */
  async isCheckoutOverviewLoaded(): Promise<boolean> {
    return await this.isVisible(this.checkoutSummary);
  }

  /**
   * Check if the checkout complete page is loaded
   * @returns True if the checkout complete page is loaded, false otherwise
   */
  async isCheckoutCompleteLoaded(): Promise<boolean> {
    return await this.isVisible(this.checkoutComplete);
  }

  /**
   * Fill the checkout information form
   * @param firstName The first name
   * @param lastName The last name
   * @param postalCode The postal code
   */
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  /**
   * Continue to the checkout overview page
   */
  async continueToOverview(): Promise<void> {
    await this.click(this.continueButton);
    await this.waitForNavigation();
  }

  /**
   * Cancel the checkout process and return to the cart
   */
  async cancelCheckout(): Promise<void> {
    await this.click(this.cancelButton);
    await this.waitForNavigation();
  }

  /**
   * Get the error message if checkout info validation fails
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
   * Get the names of all items in the checkout overview
   * @returns Array of item names
   */
  async getItemNames(): Promise<string[]> {
    return await this.page.locator(this.itemNames).allInnerTexts();
  }

  /**
   * Get the prices of all items in the checkout overview
   * @returns Array of item prices
   */
  async getItemPrices(): Promise<string[]> {
    return await this.page.locator(this.itemPrices).allInnerTexts();
  }

  /**
   * Get the subtotal from the checkout overview
   * @returns The subtotal amount
   */
  async getSubtotal(): Promise<number> {
    const subtotalText = await this.getText(this.subtotalLabel);
    const subtotalMatch = subtotalText.match(/\$([0-9.]+)/);
    return subtotalMatch ? parseFloat(subtotalMatch[1]) : 0;
  }

  /**
   * Get the tax amount from the checkout overview
   * @returns The tax amount
   */
  async getTax(): Promise<number> {
    const taxText = await this.getText(this.taxLabel);
    const taxMatch = taxText.match(/\$([0-9.]+)/);
    return taxMatch ? parseFloat(taxMatch[1]) : 0;
  }

  /**
   * Get the total amount from the checkout overview
   * @returns The total amount
   */
  async getTotal(): Promise<number> {
    const totalText = await this.getText(this.totalLabel);
    const totalMatch = totalText.match(/\$([0-9.]+)/);
    return totalMatch ? parseFloat(totalMatch[1]) : 0;
  }

  /**
   * Complete the checkout process
   */
  async finishCheckout(): Promise<void> {
    await this.click(this.finishButton);
    await this.waitForNavigation();
  }

  /**
   * Get the completion message
   * @returns The completion message text
   */
  async getCompletionMessage(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  /**
   * Return to the products page after checkout completion
   */
  async backToProducts(): Promise<void> {
    await this.click(this.backHomeButton);
    await this.waitForNavigation();
  }

  /**
   * Take a screenshot of the checkout information page
   * @param name The name of the screenshot
   */
  async takeCheckoutInfoScreenshot(name: string = 'checkout-info-page'): Promise<void> {
    await this.takeScreenshot(name);
  }

  /**
   * Take a screenshot of the checkout overview page
   * @param name The name of the screenshot
   */
  async takeCheckoutOverviewScreenshot(name: string = 'checkout-overview-page'): Promise<void> {
    await this.takeScreenshot(name);
  }

  /**
   * Take a screenshot of the checkout complete page
   * @param name The name of the screenshot
   */
  async takeCheckoutCompleteScreenshot(name: string = 'checkout-complete-page'): Promise<void> {
    await this.takeScreenshot(name);
  }
}
