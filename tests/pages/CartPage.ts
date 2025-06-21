import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the cart page
 */
export class CartPage extends BasePage {
  // Selectors
  private readonly cartList = '.cart_list';
  private readonly cartItems = '.cart_item';
  private readonly itemNames = '.inventory_item_name';
  private readonly itemPrices = '.inventory_item_price';
  private readonly removeButtons = 'button[id^="remove"]';
  private readonly continueShoppingButton = '#continue-shopping';
  private readonly checkoutButton = '#checkout';

  /**
   * Constructor for the CartPage
   * @param page The Playwright page object
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the cart page
   */
  async navigate(): Promise<void> {
    await super.navigate('cart.html');
  }

  /**
   * Check if the cart page is loaded
   * @returns True if the cart page is loaded, false otherwise
   */
  async isLoaded(): Promise<boolean> {
    return await this.isVisible(this.cartList);
  }

  /**
   * Get the number of items in the cart
   * @returns The number of items in the cart
   */
  async getItemCount(): Promise<number> {
    return await this.page.locator(this.cartItems).count();
  }

  /**
   * Get the names of all items in the cart
   * @returns Array of item names
   */
  async getItemNames(): Promise<string[]> {
    return await this.page.locator(this.itemNames).allInnerTexts();
  }

  /**
   * Get the prices of all items in the cart
   * @returns Array of item prices
   */
  async getItemPrices(): Promise<string[]> {
    return await this.page.locator(this.itemPrices).allInnerTexts();
  }

  /**
   * Remove an item from the cart by its name
   * @param itemName The name of the item to remove
   */
  async removeItem(itemName: string): Promise<void> {
    const itemLocator = this.page.locator(this.itemNames, { hasText: itemName });
    const item = await itemLocator.first();
    const itemContainer = await item.locator('..').locator('..').locator('..');
    await itemContainer.locator('button[id^="remove"]').click();
  }

  /**
   * Continue shopping (go back to inventory)
   */
  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
    await this.waitForNavigation();
  }

  /**
   * Proceed to checkout
   */
  async checkout(): Promise<void> {
    await this.click(this.checkoutButton);
    await this.waitForNavigation();
  }

  /**
   * Calculate the total price of all items in the cart
   * @returns The total price
   */
  async calculateTotal(): Promise<number> {
    const prices = await this.getItemPrices();
    return prices.reduce((total, price) => {
      // Remove $ and convert to number
      const numPrice = parseFloat(price.replace('$', ''));
      return total + numPrice;
    }, 0);
  }

  /**
   * Take a screenshot of the cart page
   * @param name The name of the screenshot
   */
  async takeCartScreenshot(name: string = 'cart-page'): Promise<void> {
    await this.takeScreenshot(name);
  }
}
