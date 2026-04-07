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
        await page.route('**/inventory.json', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
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

        await loginPage.login('standard_user', 'secret_sauce');

        // Verify that the mocked product is displayed on the inventory page
        await expect(inventoryPage.productName).toHaveText('Mocked Product');
        await expect(inventoryPage.productPrice).toHaveText('$9.99');
    });

    // Intercept the inventory API request and simulate a network error
    test('should handle network errors gracefully', async ({ page }) => {
        await page.route('**/inventory.json', route => {
            route.abort('failed'); // Simulate a network failure
        });

        await loginPage.login('standard_user', 'secret_sauce');

        // Verify that an error message is displayed to the user
        const errorMessage = page.locator('.error-message'); // Assuming there's an element for errors
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Failed to load inventory. Please try again later.');
    });
});