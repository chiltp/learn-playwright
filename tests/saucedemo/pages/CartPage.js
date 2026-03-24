// Page Object for the SauceDemo cart page (/cart.html)
// Locators for cart items, item details, and navigation to checkout

class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.cartName = page.locator('[data-test="inventory-item-name"]');
        this.removeButton = page.locator('[data-test^="remove-"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }
}

module.exports = { CartPage };
