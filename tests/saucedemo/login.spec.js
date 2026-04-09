const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');

test.describe('Login', () => {
    let loginPage;

    // Navigate to the login page before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should load the login page', async ({ page }) => {
        await expect(page, 'should load the login page').toHaveTitle('Swag Labs');
    });

    // Happy path: valid credentials redirect to inventory
    test('should log in with valid credentials', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page, 'should navigate to inventory page after successful login').toHaveURL(/inventory/);
        await expect(inventoryPage.productSortContainer, 'should display product sort dropdown on inventory page').toBeVisible();
    });

    // Edge case: locked out user sees error
    test('should show error for locked out user', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        await expect(loginPage.errorMessage, 'should display correct error message for locked out user').toHaveText(
            'Epic sadface: Sorry, this user has been locked out.'
        );
    });

    // Edge case: empty username
    test('should show error when username is empty', async () => {
        await loginPage.loginButton.click();
        await expect(loginPage.errorMessage, 'should display correct error message when username is empty').toHaveText(
            'Epic sadface: Username is required'
        );
    });

    // Edge case: empty password
    test('should show error when password is empty', async () => {
        await loginPage.login('standard_user', '');
        await expect(loginPage.errorMessage, 'should display correct error message when password is empty').toHaveText(
            'Epic sadface: Password is required'
        );
    });
});
