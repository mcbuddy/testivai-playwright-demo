import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Login Functionality', () => {
  test('should login with valid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Act
    await loginPage.navigate();
    await loginPage.takeLoginScreenshot('login-page-before');
    
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Assert
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.takeInventoryScreenshot('inventory-page-after-login');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await loginPage.navigate();
    await loginPage.login('invalid_user', 'invalid_password');
    
    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
    await loginPage.takeLoginScreenshot('login-page-error');
  });

  test('should show error for locked out user', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await loginPage.navigate();
    await loginPage.login('locked_out_user', 'secret_sauce');
    
    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
    await loginPage.takeLoginScreenshot('login-page-locked-out');
  });

  test('should login with performance glitch user', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Act
    await loginPage.navigate();
    
    // This user has intentional performance issues
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    
    // Assert
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.takeInventoryScreenshot('inventory-page-after-glitch-login');
  });
});
