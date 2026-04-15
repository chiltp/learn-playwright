const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');

test.describe('Sorting', () => {
    let loginPage;
    let inventoryPage;

    // Log in and land on the inventory page before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    // Verify default sorting is "Name (A to Z)"
    test('should have default sorting as "Name (A to Z)"', async () => {
        const nameTexts = await inventoryPage.productName.allTextContents();
        const sortedNames = [...nameTexts].sort();
        expect(nameTexts).toEqual(sortedNames);
    });

    // Verify sorting by "Name (Z to A)"
    test('should sort products by "Name (Z to A)"', async () => {
        await inventoryPage.sortProducts('za');
        const nameTexts = await inventoryPage.productName.allTextContents();
        const sortedNames = [...nameTexts].sort().reverse();
        expect(nameTexts).toEqual(sortedNames);
    });

    test('should sort products by price low to high', async () => {
        await inventoryPage.sortProducts('lohi');
        const priceTexts = await inventoryPage.productPrice.allTextContents();
        const prices = priceTexts.map(text => parseFloat(text.replace('$', '')));
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    });

    test('should sort products by price high to low', async () => {
        await inventoryPage.sortProducts('hilo');
        const priceTexts = await inventoryPage.productPrice.allTextContents();
        const prices = priceTexts.map(text => parseFloat(text.replace('$', '')));
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);
    });

});