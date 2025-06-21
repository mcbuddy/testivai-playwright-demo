import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Shopping Cart and Checkout Process', () => {
  // Before each test, login with standard user and add items to cart
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Login
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add items to cart
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
  });

  test('should display correct items in cart', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    // Act
    await inventoryPage.goToCart();
    
    // Assert
    expect(await cartPage.isLoaded()).toBeTruthy();
    
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(2);
    
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
    
    await cartPage.takeCartScreenshot('cart-with-items');
  });

  test('should remove item from cart', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    // Act
    await inventoryPage.goToCart();
    await cartPage.removeItem('Sauce Labs Backpack');
    
    // Assert
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);
    
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).not.toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
    
    await cartPage.takeCartScreenshot('cart-after-remove');
  });

  test('should continue shopping from cart', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    // Act
    await inventoryPage.goToCart();
    await cartPage.continueShopping();
    
    // Assert
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    
    await inventoryPage.takeInventoryScreenshot('inventory-after-continue-shopping');
  });

  test('should complete checkout process successfully', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Act - Go to cart
    await inventoryPage.goToCart();
    
    // Take screenshot of cart
    await cartPage.takeCartScreenshot('cart-before-checkout');
    
    // Proceed to checkout
    await cartPage.checkout();
    
    // Fill checkout information
    expect(await checkoutPage.isCheckoutInfoLoaded()).toBeTruthy();
    await checkoutPage.takeCheckoutInfoScreenshot('checkout-info-page');
    
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continueToOverview();
    
    // Verify checkout overview
    expect(await checkoutPage.isCheckoutOverviewLoaded()).toBeTruthy();
    
    const itemNames = await checkoutPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
    
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    
    // Verify that total = subtotal + tax
    expect(total).toBeCloseTo(subtotal + tax, 2);
    
    await checkoutPage.takeCheckoutOverviewScreenshot('checkout-overview-page');
    
    // Complete checkout
    await checkoutPage.finishCheckout();
    
    // Verify checkout complete
    expect(await checkoutPage.isCheckoutCompleteLoaded()).toBeTruthy();
    
    const completionMessage = await checkoutPage.getCompletionMessage();
    expect(completionMessage).toContain('THANK YOU');
    
    await checkoutPage.takeCheckoutCompleteScreenshot('checkout-complete-page');
    
    // Return to products
    await checkoutPage.backToProducts();
    
    // Verify back on inventory page
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    
    // Verify cart is empty
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(0);
  });

  test('should show error with empty checkout information', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Act
    await inventoryPage.goToCart();
    await cartPage.checkout();
    
    // Try to continue without filling information
    await checkoutPage.continueToOverview();
    
    // Assert
    expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
    
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toContain('First Name is required');
    
    await checkoutPage.takeCheckoutInfoScreenshot('checkout-info-error');
  });

  test('should calculate correct total with tax', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Act
    await inventoryPage.goToCart();
    await cartPage.checkout();
    
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continueToOverview();
    
    // Assert
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    
    // Tax should be 8% of subtotal
    expect(tax).toBeCloseTo(subtotal * 0.08, 2);
    
    // Total should be subtotal + tax
    expect(total).toBeCloseTo(subtotal + tax, 2);
    
    await checkoutPage.takeCheckoutOverviewScreenshot('checkout-overview-calculations');
  });
});
