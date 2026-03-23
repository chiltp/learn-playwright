const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');

test.describe('Login', () => {
    let loginPage;

    // Navigate to the login page before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should load the login page', async ({ page }) => {
        await expect(page).toHaveTitle('Swag Labs');
    });

    // Happy path: valid credentials redirect to inventory
    test('should log in with valid credentials', async ({ page }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory/);
    });

    // Edge case: locked out user sees error
    test('should show error for locked out user', async ({ page }) => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Sorry, this user has been locked out.'
        );
    });

    // Edge case: empty username
    test('should show error when username is empty', async ({ page }) => {
        await loginPage.loginButton.click();
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username is required'
        );
    });

    // Edge case: empty password
    test('should show error when password is empty', async ({ page }) => {
        await loginPage.login('standard_user', '');
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Password is required'
        );
    });
});
