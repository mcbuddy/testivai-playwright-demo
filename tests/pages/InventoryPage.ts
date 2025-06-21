import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the inventory page
 */
export class InventoryPage extends BasePage {
  // Selectors
  private readonly inventoryContainer = '#inventory_container';
  private readonly inventoryItems = '.inventory_item';
  private readonly itemNames = '.inventory_item_name';
  private readonly itemPrices = '.inventory_item_price';
  private readonly addToCartButtons = 'button[id^="add-to-cart"]';
  private readonly removeButtons = 'button[id^="remove"]';
  private readonly shoppingCartBadge = '.shopping_cart_badge';
  private readonly shoppingCartLink = '.shopping_cart_link';
  private readonly sortDropdown = '.product_sort_container';
  private readonly burgerMenu = '#react-burger-menu-btn';
  private readonly logoutLink = '#logout_sidebar_link';

  /**
   * Constructor for the InventoryPage
   * @param page The Playwright page object
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the inventory page
   */
  async navigate(): Promise<void> {
    await super.navigate('inventory.html');
  }

  /**
   * Check if the inventory page is loaded
   * @returns True if the inventory page is loaded, false otherwise
   */
  async isLoaded(): Promise<boolean> {
    return await this.isVisible(this.inventoryContainer);
  }

  /**
   * Get the number of inventory items
   * @returns The number of inventory items
   */
  async getItemCount(): Promise<number> {
    return await this.page.locator(this.inventoryItems).count();
  }

  /**
   * Get the names of all inventory items
   * @returns Array of item names
   */
  async getItemNames(): Promise<string[]> {
    return await this.page.locator(this.itemNames).allInnerTexts();
  }

  /**
   * Get the prices of all inventory items
   * @returns Array of item prices
   */
  async getItemPrices(): Promise<string[]> {
    return await this.page.locator(this.itemPrices).allInnerTexts();
  }

  /**
   * Add an item to the cart by its name
   * @param itemName The name of the item to add
   */
  async addItemToCart(itemName: string): Promise<void> {
    const itemLocator = this.page.locator(this.itemNames, { hasText: itemName });
    const item = await itemLocator.first();
    const itemContainer = await item.locator('..').locator('..').locator('..');
    await itemContainer.locator('button[id^="add-to-cart"]').click();
  }

  /**
   * Remove an item from the cart by its name
   * @param itemName The name of the item to remove
   */
  async removeItemFromCart(itemName: string): Promise<void> {
    const itemLocator = this.page.locator(this.itemNames, { hasText: itemName });
    const item = await itemLocator.first();
    const itemContainer = await item.locator('..').locator('..').locator('..');
    await itemContainer.locator('button[id^="remove"]').click();
  }

  /**
   * Get the number of items in the cart
   * @returns The number of items in the cart
   */
  async getCartCount(): Promise<number> {
    if (await this.isVisible(this.shoppingCartBadge)) {
      const badgeText = await this.getText(this.shoppingCartBadge);
      return parseInt(badgeText, 10);
    }
    return 0;
  }

  /**
   * Go to the shopping cart
   */
  async goToCart(): Promise<void> {
    await this.click(this.shoppingCartLink);
    await this.waitForNavigation();
  }

  /**
   * Sort the inventory items
   * @param sortOption The sort option (e.g., 'az', 'za', 'lohi', 'hilo')
   */
  async sortItems(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.page.selectOption(this.sortDropdown, sortOption);
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.click(this.burgerMenu);
    await this.page.waitForSelector(this.logoutLink, { state: 'visible' });
    await this.click(this.logoutLink);
    await this.waitForNavigation();
  }

  /**
   * Take a screenshot of the inventory page
   * @param name The name of the screenshot
   */
  async takeInventoryScreenshot(name: string = 'inventory-page'): Promise<void> {
    await this.takeScreenshot(name);
  }
}
