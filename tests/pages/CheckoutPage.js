// Page Object for the SauceDemo checkout pages (step-one, step-two, complete)
// Locators and reusable actions for checkout form, overview, and confirmation

class CheckoutPage {
    constructor(page) {
        this.page = page;

        // Checkout information form (step one)
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.errorMessage = page.locator('[data-test="error"]');

        // Checkout overview and confirmation (step two and complete)
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('[data-test="complete-header"]');
    }

    // Fill out the checkout information form
    async fillCheckoutInformation(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    // Click continue to go to the checkout overview page
    async continueToOverview() {
        await this.continueButton.click();
    }
}

module.exports = { CheckoutPage };
