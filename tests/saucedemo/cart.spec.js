const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');
const { CartPage } = require('./pages/CartPage');

test.describe('Cart', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;

    // Log in and land on the inventory page before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    // Add one product and verify badge shows "1"
    test('should add a product to the cart', async () => {
        await inventoryPage.addToCartButton.first().click();
        await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    // Add then remove a product — badge should disappear entirely
    test('should remove a product from the cart', async () => {
        await inventoryPage.addToCartButton.first().click();
        await inventoryPage.removeButton.first().click();
        await expect(inventoryPage.cartBadge).toBeHidden();
    });

    // Add a product, navigate to cart page, verify item is still there
    test('should products persist after navigation to the cart', async ({ page }) => {
        await inventoryPage.addToCartButton.first().click();
        await inventoryPage.cartBadge.click();
        await expect(page).toHaveURL(/cart/);
        await expect(cartPage.cartItems, 'should display 1 item in the cart').toHaveCount(1);
    });

    // Add 3 products, navigate to cart, verify exact names match
    // Uses .first() for add buttons (they shift as each becomes "Remove")
    // Uses .nth(i) for reading names (stable list, no shifting)
    test('should add 3 products and verify their exact names on the cart page', async ({ page }) => {
        // Capture the first 3 product names before adding
        const expectedNames = [];
        for (let i = 0; i < 3; i++) {
            const name = await inventoryPage.productName.nth(i).textContent();
            expectedNames.push(name.trim());
        }

        // Add 3 products using .first() — buttons shift after each click
        for (let i = 0; i < 3; i++) {
            await inventoryPage.addToCartButton.first().click();
        }
        // Navigate to cart and verify
        await inventoryPage.cartBadge.click();
        await expect(page).toHaveURL(/cart/);

        // Read cart names and compare
        const actualNames = [];
        for (let i = 0; i < 3; i++) {
            const name = await cartPage.cartName.nth(i).textContent();
            actualNames.push(name.trim());
        }
        expect(actualNames).toEqual(expectedNames);
    });

    test('should add 3 products and verify cart items count', async ({ page }) => {
        // Add 3 products using .first() — buttons shift after each click
        for (let i = 0; i < 3; i++) {
            await inventoryPage.addToCartButton.first().click();
        }

        // Navigate to cart and verify
        await inventoryPage.cartBadge.click();
        await expect(page).toHaveURL(/cart/);
        await expect(cartPage.cartItems, 'should display 3 items in the cart').toHaveCount(3);
    });
});
