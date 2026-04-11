const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');

test.describe('Inventory', () => {
    let loginPage;
    let inventoryPage;

    // Log in and land on the inventory page before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test('should load the inventory page', async ({ page }) => {
        await expect(page).toHaveTitle('Swag Labs');
    });

    // Verify every product has a name, price, and image (no empty display slots)
    test('should every product have a name, price, and image', async ({ page }) => {
        const productCount = await inventoryPage.productName.count();
        for (let i = 0; i < productCount; i++) {
            const name = await inventoryPage.productName.nth(i).textContent();
            const price = await inventoryPage.productPrice.nth(i).textContent();
            const imageSrc = await inventoryPage.productImage.nth(i).getAttribute('src');
            expect(name).toBeTruthy();
            expect(price).toBeTruthy();
            expect(imageSrc).toBeTruthy();
        }
    });
});
