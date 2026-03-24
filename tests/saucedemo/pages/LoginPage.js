// Page Object for the SauceDemo login page (https://www.saucedemo.com)
// Locators and reusable actions for login functionality

class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    // Navigate to the login page
    async goto() {
        await this.page.goto('/');
    }

    // Fill credentials and click login
    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

module.exports = { LoginPage };
