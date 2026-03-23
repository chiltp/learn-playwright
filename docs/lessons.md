# Playwright Lessons

## Phase 0 — async/await

- **async** marks a function that contains slow operations (network requests, browser actions)
- **await** means "wait for this to finish before moving on"
- Without `await`, you get `Promise { <pending> }` instead of the actual result
- Rule 1: `await` means "wait for this to finish"
- Rule 2: You can only use `await` inside an `async` function

## Phase 1 — Login Tests

### Test 1: Basic test structure

```js
const { test, expect } = require('@playwright/test');
```
- **`test`** — defines a test case
- **`expect`** — makes assertions (checks if something is true)

```js
test('description', async ({ page }) => { ... });
```
- Each test gets its own fresh browser tab (`page`)
- `{ page }` is destructuring — pulling `page` out of Playwright's toolbox
- `async` is required because browser actions take time

```js
await page.goto('/');
```
- Navigates to a URL. `'/'` means the base URL from `playwright.config.js`

```js
await expect(page).toHaveTitle('Swag Labs');
```
- Asserts the page title matches exactly

### Test 2: Interacting with elements

```js
page.locator('[data-test="username"]')
```
- Finds an element on the page using a CSS selector
- `data-test` attributes are added by developers specifically for testing — they won't change when the UI is restyled

```js
.fill('standard_user')
```
- Types text into an input field

```js
.click()
```
- Clicks an element (button, link, etc.)

```js
await expect(page).toHaveURL(/inventory/);
```
- Asserts the URL contains "inventory" (the `/.../` is a regex for partial match)

### Test 3: Grouping tests and setup

```js
test.describe('Login', () => { ... });
```
- Groups related tests together, like a folder

```js
test.beforeEach(async ({ page }) => {
    await page.goto('/');
});
```
- Runs before EVERY test in the group — avoids repeating setup code

```js
await expect(locator).toHaveText('...');
```
- Asserts an element contains specific text

### Test 4: Testing validation errors

- You can test what happens when users skip fields or enter wrong data
- Same tools: `locator`, `click`, `toHaveText` — just different scenarios

### Test 5: Page Object Model (POM)

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

### Why `await` everywhere in Playwright?

Every browser action is slow compared to normal code:
- Loading a page → network request
- Typing → simulating keystrokes
- Clicking → waiting for browser response
- Assertions → waiting for elements to appear

Rule of thumb: if a line talks to the browser, it needs `await`.
