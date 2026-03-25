# Page Object Model (POM)

**Problem:** Selectors like `[data-test="username"]` are repeated everywhere. If one changes, you'd have to update every test.

**Solution:** Put all selectors and actions in a class:

```js
class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        // ... all selectors in ONE place
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        // ... reusable action
    }
}
```

**Benefits:**
- Selectors defined once — change in one place if the HTML changes
- Tests become readable: `loginPage.login('user', 'pass')` instead of 3 lines of locator code
- Reusable actions across multiple test files

**Usage in tests:**
```js
let loginPage;
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
});
```
