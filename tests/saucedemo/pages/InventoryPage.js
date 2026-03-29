// Page Object for the SauceDemo inventory page (/inventory.html)
// Locators and reusable actions for product browsing, sorting, and adding to cart

class InventoryPage {
    constructor(page) {
        this.page = page;

        // Product listing
        this.productSortContainer = page.locator('[data-test="product-sort-container"]');
        this.productPrice = page.locator('[data-test="inventory-item-price"]');
        this.productName = page.locator('[data-test="inventory-item-name"]');
        this.productImage = page.locator('[data-test$="-img"]'); // Partial match: each image has a unique data-test ending in "-img"

        // Cart actions
        this.cartButton = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.addToCartButton = page.locator('[data-test^="add-to-cart"]'); // Partial match: each button starts with "add-to-cart"
        this.removeButton = page.locator('[data-test^="remove-"]'); // Partial match: each button starts with "remove-"
    }

    // Select a sorting option from the dropdown (e.g., 'lohi', 'az')
    async sortProducts(option) {
        await this.productSortContainer.selectOption(option);
    }
}

module.exports = { InventoryPage };
