const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');

test.describe('Sorting', () => {
    let loginPage;
    let inventoryPage;
    let page;

    // Log in and land on the inventory page before all tests
    test.beforeAll(async ({browser }) => {
        page = await browser.newPage();
        await page.goto('https://www.saucedemo.com/');
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
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

    test.afterEach(async () => {
        // Reset sorting to default after each test
        await inventoryPage.sortProducts('az');
    });

    test.afterAll(async () => {
        await page.close();
    });
});