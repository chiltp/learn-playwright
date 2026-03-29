const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');

test.describe('Visual Regression', () => {
    let loginPage;
    let inventoryPage;

    test.skip(!!process.env.CI, 'Visual tests are skipped in CI — baselines are OS-specific');

    // Navigate to the login page before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goto();
    });

    // Compare current login page to baseline screenshot
    test('should take a screenshot of the login page', async ({ page }) => {
        await expect(page).toHaveScreenshot('login-page.png');
    });

    // Compare login page with masked credentials to baseline screenshot
    test('should mask the login credentials in the screenshot', async ({ page }) => {
        await expect(page).toHaveScreenshot('login-page-masked.png', {
            mask: [page.locator('.login_credentials_wrap-inner')],
        });
    });

    // Compare login page with a custom threshold for differences
    test('should compare the login page with a custom threshold', async ({ page }) => {
        await expect(page).toHaveScreenshot('login-page-threshold.png', {
            maxDiffPixels: 100, // Allow up to 100 pixels to differ
        });
    });

    // Compare only the login form area to baseline screenshot
    test('should take a screenshot of the login form', async ({ page }) => {
        const loginForm = page.locator('.login_wrapper-inner');
        await expect(loginForm).toHaveScreenshot('login-form.png');
    });

    // Compare the inventory page to baseline screenshot after logging in
    test('should take a screenshot of the inventory page', async ({ page }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveScreenshot('inventory-page.png');
    });

    // Compare the cart page to baseline screenshot after adding some items to the cart
    test('should take a screenshot of the cart page', async ({ page }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
        await inventoryPage.cartButton.click();
        await expect(page).toHaveScreenshot('cart-page.png');
    });
});