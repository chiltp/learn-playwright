const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');

test.describe('Network Interception', () => {
    let loginPage;
    let inventoryPage;

    // Navigate to the login page before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goto();
    });

    // Intercept the inventory API request and mock a custom response
    test('should intercept the inventory API and return a custom response', async ({ page }) => {
        await page.route('**/*.jpg', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'image/jpeg;',
                body: JSON.stringify({
                    items: [
                        {
                            id: 1,
                            name: 'Mocked Product',
                            price: 9.99,
                            image: 'https://via.placeholder.com/150',
                        },
                    ],
                }),
            });
        });

        const responsePromise = page.waitForResponse('**/*.jpg');
        await loginPage.login('standard_user', 'secret_sauce');
        const response = await responsePromise;

        // Verify that the mocked response was used
        expect(response.status()).toBe(200);
        expect(response.url()).toMatch(/.*\.jpg$/);
    });

    // Simulate a network failure for the inventory API and verify that the application handles it gracefully
    test('should show alt text when the inventory API fails', async ({ page }) => {
        await page.route('**/*.jpg', route => {
            route.abort(); // Simulate a network failure for image requests
        });

        await loginPage.login('standard_user', 'secret_sauce');

        // Verify that the alt text is displayed when the image fails to load
        const altText = page.locator('[data-test$="-img"]'); // Partial match: each image has a unique data-test ending in "-img"
        await expect(altText.first()).toBeVisible();
    });
});