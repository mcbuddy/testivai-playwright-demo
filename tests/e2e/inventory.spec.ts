import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Inventory Functionality', () => {
  // Before each test, login with standard user
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should display all inventory items', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    
    // Act
    // Already on inventory page after login
    
    // Assert
    const itemCount = await inventoryPage.getItemCount();
    expect(itemCount).toBeGreaterThan(0);
    
    const itemNames = await inventoryPage.getItemNames();
    expect(itemNames.length).toBe(itemCount);
    
    await inventoryPage.takeInventoryScreenshot('inventory-all-items');
  });

  test('should sort items by name (A to Z)', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    
    // Act
    await inventoryPage.sortItems('az');
    
    // Assert
    const itemNames = await inventoryPage.getItemNames();
    const sortedNames = [...itemNames].sort();
    expect(itemNames).toEqual(sortedNames);
    
    await inventoryPage.takeInventoryScreenshot('inventory-sorted-az');
  });

  test('should sort items by name (Z to A)', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    
    // Act
    await inventoryPage.sortItems('za');
    
    // Assert
    const itemNames = await inventoryPage.getItemNames();
    const sortedNames = [...itemNames].sort().reverse();
    expect(itemNames).toEqual(sortedNames);
    
    await inventoryPage.takeInventoryScreenshot('inventory-sorted-za');
  });

  test('should sort items by price (low to high)', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    
    // Act
    await inventoryPage.sortItems('lohi');
    
    // Assert
    const itemPrices = await inventoryPage.getItemPrices();
    const numericPrices = itemPrices.map(price => parseFloat(price.replace('$', '')));
    
    // Check if prices are in ascending order
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
    }
    
    await inventoryPage.takeInventoryScreenshot('inventory-sorted-lohi');
  });

  test('should sort items by price (high to low)', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    
    // Act
    await inventoryPage.sortItems('hilo');
    
    // Assert
    const itemPrices = await inventoryPage.getItemPrices();
    const numericPrices = itemPrices.map(price => parseFloat(price.replace('$', '')));
    
    // Check if prices are in descending order
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i + 1]);
    }
    
    await inventoryPage.takeInventoryScreenshot('inventory-sorted-hilo');
  });

  test('should add item to cart', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    const itemName = 'Sauce Labs Backpack';
    
    // Act
    await inventoryPage.addItemToCart(itemName);
    
    // Assert
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(1);
    
    await inventoryPage.takeInventoryScreenshot('inventory-item-added');
  });

  test('should remove item from cart', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    const itemName = 'Sauce Labs Backpack';
    
    // Add item first
    await inventoryPage.addItemToCart(itemName);
    let cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(1);
    
    // Act
    await inventoryPage.removeItemFromCart(itemName);
    
    // Assert
    cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(0);
    
    await inventoryPage.takeInventoryScreenshot('inventory-item-removed');
  });

  test('should logout successfully', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    const loginPage = new LoginPage(page);
    
    // Act
    await inventoryPage.logout();
    
    // Assert
    expect(await loginPage.isVisible('#login-button')).toBeTruthy();
    
    await loginPage.takeLoginScreenshot('login-after-logout');
  });
});
