const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');
const { CartPage } = require('./pages/CartPage');
const { CheckoutPage } = require('./pages/CheckoutPage');

test.describe('Checkout', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;

    // Full setup: log in, add a product, go to cart, click checkout
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.addToCartButton.first().click();
        await inventoryPage.cartBadge.click();
        await expect(page).toHaveURL(/cart/);
        await cartPage.checkoutButton.click();
        await expect(page).toHaveURL(/checkout-step-one/);
    });

    // Happy path: fill form and proceed to checkout overview
    test('should navigate to the confirmation page after filling out checkout information and clicking continue', async ({ page }) => {
        await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
        await checkoutPage.continueToOverview();
        await expect(page).toHaveURL(/checkout-step-two/);
    });

    // Edge case: submit without filling any fields
    test('should show error message when name is missing on the checkout information form', async ({ page }) => {
        await checkoutPage.continueToOverview();
        await expect(checkoutPage.errorMessage).toHaveText(
            'Error: First Name is required'
        );
    });

    // Edge case: submit with name but no postal code
    test('should show error message when postal code is missing on the checkout information form', async ({ page }) => {
        await checkoutPage.fillCheckoutInformation('John', 'Doe', '');
        await checkoutPage.continueToOverview();
        await expect(checkoutPage.errorMessage).toHaveText(
            'Error: Postal Code is required'
        );
    });

    // Full E2E: login -> add item -> cart -> checkout -> finish -> confirmation
    test('should go to the confirmation page', async ({ page }) => {
        await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
        await checkoutPage.continueToOverview();
        await expect(page).toHaveURL(/checkout-step-two/);
        await checkoutPage.finishButton.click();
        await expect(page).toHaveURL(/checkout-complete/);
        await expect(checkoutPage.completeHeader).toHaveText(
            'Thank you for your order!'
        );
    });
});
