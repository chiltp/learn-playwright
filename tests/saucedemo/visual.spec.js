const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');

test.describe('Visual Regression', () => {
    let loginPage;

    // Navigate to the login page before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
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
});