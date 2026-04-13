# Playwright Interview Prep

Your personal interview mock based on everything you've learned. Organized by topic, with difficulty levels and answer hints to study from.

> **How to use:** Cover the answers, try answering out loud, then check. Practice explaining concepts as if teaching someone — interviewers love that.

---

## Section 1: Async/Await & JavaScript Fundamentals

### Q1.1 (Beginner)
**What is a Promise in JavaScript, and why does Playwright use async/await?**

<details>
<summary>Answer Hint</summary>

A Promise represents a value that isn't available yet — like an order ticket at a cafe. You place the order (call a function), get a ticket (Promise), and wait for it to be ready.

Playwright uses `async/await` because browser interactions (clicking, navigating, waiting for elements) are inherently asynchronous — the browser needs time to respond. Without `await`, your code would move to the next line before the action completes, causing flaky or failing tests.

```js
// Without await — broken, moves on before click finishes
page.click('#submit');
page.locator('.success'); // might not exist yet!

// With await — waits for each action
await page.click('#submit');
await page.locator('.success').waitFor();
```
</details>

### Q1.2 (Intermediate)
**What happens if you forget `await` on a Playwright action? How would you debug it?**

<details>
<summary>Answer Hint</summary>

The action fires but your code doesn't wait for it to complete. This causes race conditions — your next assertion might run before the page has updated. The test may pass sometimes and fail other times (flaky).

Debugging: Look for assertions that fail intermittently. Check if any Playwright calls are missing `await`. Linters like `eslint-plugin-playwright` can catch missing awaits automatically.
</details>

---

## Section 2: Locators & Selectors

### Q2.1 (Beginner)
**What are the different ways to locate elements in Playwright? Which do you prefer and why?**

<details>
<summary>Answer Hint</summary>

Playwright offers several locator strategies:
- **`data-testid` / `data-test` attributes** — Most stable, purpose-built for testing
- **`getByRole()`** — Semantic, accessible, recommended by Playwright docs
- **`getByText()`** — Good for buttons/links with visible text
- **`getByLabel()`** — Great for form fields
- **CSS selectors** — Flexible but can be brittle if tied to styling classes
- **XPath** — Powerful but hard to read, usually unnecessary

Best practice: Prefer `data-testid` attributes or semantic `getByRole()` queries. They don't break when styling or layout changes.

From your project:
```js
// data-test attribute (SauceDemo)
this.usernameInput = page.locator('[data-test="username"]');

// getByRole (TodoMVC)
this.activeLink = page.getByRole('link', { name: 'Active' });
```
</details>

### Q2.2 (Intermediate)
**Explain partial attribute selectors. When would you use them?**

<details>
<summary>Answer Hint</summary>

Partial attribute selectors match part of an attribute value:
- `[data-test^="add-to-cart"]` — **starts with** "add-to-cart"
- `[data-test$="-img"]` — **ends with** "-img"
- `[data-test*="cart"]` — **contains** "cart"

Use them when attribute values are dynamic or follow a pattern. For example, SauceDemo's "Add to Cart" buttons include the product name: `data-test="add-to-cart-sauce-labs-backpack"`. Using `^="add-to-cart"` matches ALL add-to-cart buttons without hardcoding product names.

```js
// Matches all add-to-cart buttons regardless of product name
this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
```
</details>

### Q2.3 (Intermediate)
**How do you work with multiple matching elements in Playwright?**

<details>
<summary>Answer Hint</summary>

When a locator matches multiple elements:
- `.first()` — first match
- `.last()` — last match
- `.nth(index)` — specific index (0-based)
- `.count()` — how many matched
- `.allTextContents()` — get text from ALL matches as an array

```js
const items = page.locator('.inventory_item_name');
await expect(items).toHaveCount(6);
const allNames = await items.allTextContents();
```
</details>

---

## Section 3: Page Object Model (POM)

### Q3.1 (Beginner)
**What is the Page Object Model and why do we use it?**

<details>
<summary>Answer Hint</summary>

POM is a design pattern where each page (or component) of your app gets its own class. The class holds:
- **Locators** — selectors for elements on that page
- **Methods** — actions a user can perform (login, addToCart, etc.)

Benefits:
1. **Maintainability** — If a selector changes, update ONE file, not every test
2. **Readability** — Tests read like user stories: `loginPage.login('user', 'pass')`
3. **Reusability** — Multiple tests share the same page methods
4. **Separation of concerns** — Tests focus on WHAT to test, page objects handle HOW

Think of it like a recipe card in a bakery kitchen — if the recipe changes, you update one card, not retrain every baker.
</details>

### Q3.2 (Intermediate)
**Walk me through how you'd structure a Page Object class.**

<details>
<summary>Answer Hint</summary>

```js
class LoginPage {
  constructor(page) {
    this.page = page;
    // Locators defined in constructor
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Navigation
  async goto() {
    await this.page.goto('/');
  }

  // Actions as methods
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
```

Key patterns:
- `page` is passed via constructor (dependency injection)
- Locators initialized in constructor so they're reusable
- Methods represent user actions, not technical steps
- Export the class for use in test files
</details>

### Q3.3 (Advanced)
**How do you chain multiple page objects in an end-to-end flow?**

<details>
<summary>Answer Hint</summary>

For multi-page flows (like checkout), instantiate multiple page objects from the same `page` fixture and use them sequentially:

```js
test('complete purchase', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addToCartButtons.first().click();
  await cartPage.goto();
  await cartPage.checkoutButton.click();
  await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
  await checkoutPage.continueToOverview();
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});
```

All page objects share the same `page` instance — they're just different lenses on the same browser tab.
</details>

---

## Section 4: Assertions

### Q4.1 (Beginner)
**What's the difference between `expect(locator)` assertions and `expect(value)` assertions in Playwright?**

<details>
<summary>Answer Hint</summary>

**Web-first assertions** (`expect(locator)`) — Auto-retry until the condition is met or timeout:
```js
await expect(page.locator('.title')).toHaveText('Products'); // retries!
await expect(page).toHaveURL(/inventory/);                   // retries!
```

**Generic assertions** (`expect(value)`) — Check immediately, no retrying:
```js
expect(prices).toEqual([7.99, 9.99, 15.99]);  // instant check
expect(response.status()).toBe(200);            // instant check
```

Always prefer web-first assertions for UI elements — they handle timing automatically and reduce flakiness.
</details>

### Q4.2 (Intermediate)
**How would you verify that a list of items is sorted correctly?**

<details>
<summary>Answer Hint</summary>

1. Get all values using `.allTextContents()`
2. Create a sorted copy of the array
3. Compare the original with the sorted copy

```js
// Verify A-Z sorting
const names = await inventoryPage.productNames.allTextContents();
const sorted = [...names].sort();
expect(names).toEqual(sorted);

// Verify price low-to-high
const priceTexts = await inventoryPage.productPrices.allTextContents();
const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));
const sortedPrices = [...prices].sort((a, b) => a - b);
expect(prices).toEqual(sortedPrices);
```

Key insight: Use the spread operator `[...array]` to clone before sorting, since `.sort()` mutates the original array.
</details>

### Q4.3 (Intermediate)
**Name some common Playwright assertions and when you'd use each.**

<details>
<summary>Answer Hint</summary>

| Assertion | Use When |
|---|---|
| `toHaveText('...')` | Verify element displays specific text |
| `toHaveURL(/pattern/)` | Verify navigation happened (supports regex) |
| `toHaveTitle('...')` | Verify page title |
| `toBeVisible()` | Verify element is shown on screen |
| `toBeHidden()` | Verify element is NOT shown |
| `toHaveCount(n)` | Verify number of matching elements |
| `toBeChecked()` | Verify checkbox/radio is checked |
| `toHaveProperty()` | Verify API response object property |
| `toMatchObject()` | Verify object contains expected subset |
</details>

---

## Section 5: Test Structure & Hooks

### Q5.1 (Beginner)
**Explain `test.describe()` and `test.beforeEach()`. Why are they important?**

<details>
<summary>Answer Hint</summary>

- **`test.describe()`** — Groups related tests together. Like chapters in a book. Helps with organization and allows shared setup.

- **`test.beforeEach()`** — Runs before EVERY test in its describe block. Used for shared setup like navigating to a page or logging in.

```js
test.describe('Cart functionality', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('add item to cart', async ({ page }) => { /* ... */ });
  test('remove item from cart', async ({ page }) => { /* ... */ });
});
```

This ensures **test isolation** — each test starts from a clean, logged-in state. Like mopping the cafe floor between customers.
</details>

### Q5.2 (Intermediate)
**What is test isolation and why does it matter?**

<details>
<summary>Answer Hint</summary>

Test isolation means each test is independent — it doesn't depend on other tests running first, and it doesn't leave behind state that affects other tests.

Why it matters:
- Tests can run in **any order** and still pass
- Tests can run in **parallel** without interfering
- A failing test doesn't cascade failures to other tests
- Easier to debug — each test is self-contained

In Playwright, each test gets a fresh `page` (browser context). Use `beforeEach` to set up the state each test needs. Never rely on one test setting up data for another.

Anti-pattern:
```js
// BAD — test 2 depends on test 1
test('add item', ...);      // adds item to cart
test('verify cart', ...);   // assumes item is already there
```
</details>

---

## Section 6: API Testing

### Q6.1 (Beginner)
**How does Playwright handle API testing? How is it different from UI testing?**

<details>
<summary>Answer Hint</summary>

Playwright has a built-in `request` fixture for API testing — no extra libraries needed.

```js
test('get a post', async ({ request }) => {
  const response = await request.get('/posts/1');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('title');
});
```

Key differences from UI testing:
| | UI Testing | API Testing |
|---|---|---|
| Fixture | `{ page }` | `{ request }` |
| Target | Browser/DOM | HTTP endpoints |
| Speed | Slower (renders UI) | Much faster (no browser) |
| What it tests | User experience | Data & business logic |
| Assertions | Element visibility, text | Status codes, JSON body |

Both can use the same POM pattern — your `ApiClient.js` wraps HTTP methods just like page objects wrap UI interactions.
</details>

### Q6.2 (Intermediate)
**How would you test CRUD operations for a REST API?**

<details>
<summary>Answer Hint</summary>

```js
// CREATE
const createResponse = await request.post('/posts', {
  data: { title: 'New Post', body: 'Content', userId: 1 }
});
expect(createResponse.status()).toBe(201);

// READ
const getResponse = await request.get('/posts/1');
expect(getResponse.status()).toBe(200);
const post = await getResponse.json();
expect(post).toHaveProperty('title');

// UPDATE
const updateResponse = await request.put('/posts/1', {
  data: { title: 'Updated Title', body: 'New content', userId: 1 }
});
expect(updateResponse.status()).toBe(200);

// DELETE
const deleteResponse = await request.delete('/posts/1');
expect(deleteResponse.status()).toBe(200);
```

Also test negative cases:
```js
// 404 for non-existent resource
const response = await request.get('/posts/99999');
expect(response.status()).toBe(404);
```
</details>

### Q6.3 (Intermediate)
**What is the API Page Object pattern and why use it?**

<details>
<summary>Answer Hint</summary>

Same idea as UI page objects — wrap API calls in a reusable class:

```js
class ApiClient {
  constructor(request) {
    this.request = request;
  }

  async getPost(id) {
    return await this.request.get(`/posts/${id}`);
  }

  async createPost(data) {
    return await this.request.post('/posts', { data });
  }
}
```

Benefits: If the endpoint URL changes, update one file. Tests stay clean and readable:
```js
const api = new ApiClient(request);
const response = await api.getPost(1);
```
</details>

---

## Section 7: Configuration

### Q7.1 (Intermediate)
**Explain key options in `playwright.config.js`. How would you set up testing for multiple apps?**

<details>
<summary>Answer Hint</summary>

Key config options:
```js
module.exports = defineConfig({
  testDir: './tests',
  retries: process.env.CI ? 2 : 0,       // Retry on CI only
  workers: process.env.CI ? 1 : undefined, // Parallel locally
  reporter: 'html',
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'saucedemo',
      testDir: './tests/saucedemo',
      use: { baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://jsonplaceholder.typicode.com' },
    },
  ],
});
```

**Projects** let you test multiple apps from one config, each with its own `baseURL`, `testDir`, and settings. You can run a specific project with `npx playwright test --project=api`.
</details>

### Q7.2 (Intermediate)
**What are traces and screenshots in Playwright? When do you use them?**

<details>
<summary>Answer Hint</summary>

- **Screenshots** — Capture the page state at a point in time. Set `screenshot: 'only-on-failure'` to automatically capture when tests fail.

- **Traces** — Record a full timeline of actions, network requests, DOM snapshots, and console logs. View with `npx playwright show-trace trace.zip`. Set `trace: 'on-first-retry'` to capture only when a test is retried (saves disk space).

Both are essential for debugging CI failures where you can't watch the browser.
</details>

---

## Section 8: Testing Theory & Best Practices

### Q8.1 (Beginner)
**What is the Test Pyramid? Where do Playwright tests fit?**

<details>
<summary>Answer Hint</summary>

```
      /  E2E  \        ← Few (slow, expensive, high confidence)
     /----------\
    / Integration \     ← Some (moderate speed, test connections)
   /--------------\
  /   Unit Tests    \   ← Many (fast, cheap, test logic)
```

- **Unit tests** (bottom) — Test individual functions. Fast, many of them.
- **Integration tests** (middle) — Test how parts work together (e.g., API + database).
- **E2E tests** (top) — Test full user journeys through the real app. Slow but high confidence.

Playwright tests live at the **top** — they're E2E tests (UI) or integration tests (API). Because they're expensive to run, be selective: test critical user journeys, not every edge case.
</details>

### Q8.2 (Beginner)
**What's the difference between happy path and edge case testing?**

<details>
<summary>Answer Hint</summary>

- **Happy path** — The expected, successful flow. Customer walks in, orders a coffee, pays, gets their drink. Example: valid login with correct credentials.

- **Edge cases** — Unusual or error scenarios. Customer forgets their wallet, orders something not on the menu, tries to use an expired coupon. Examples: login with wrong password, empty fields, locked account.

Good test suites cover both. Start with happy paths (the critical flows), then add edge cases for the most likely failure points.
</details>

### Q8.3 (Intermediate)
**How do you decide what to test vs. what NOT to test?**

<details>
<summary>Answer Hint</summary>

Ask: **"If this broke, would a user notice?"**

**Test:**
- User-visible functionality (can I log in? can I checkout?)
- Critical business flows (payment, data submission)
- Things that have broken before

**Don't test:**
- Framework internals (does React render a `<div>`?)
- Pure styling (is this button blue?) — unless it's accessibility-critical
- Third-party library behavior (does `Array.sort()` work?)
- Implementation details that could change without affecting users
</details>

### Q8.4 (Advanced)
**Your Playwright tests are flaky in CI. How do you investigate and fix it?**

<details>
<summary>Answer Hint</summary>

Common causes and fixes:

1. **Timing issues** — Missing `await`, or asserting before the page updates
   - Fix: Use web-first assertions (`await expect(locator).toHaveText(...)`) instead of manual waits

2. **Test dependency** — Tests depend on execution order
   - Fix: Ensure each test is independent with proper `beforeEach` setup

3. **Hardcoded waits** — Using `page.waitForTimeout(3000)`
   - Fix: Replace with `await expect(locator).toBeVisible()` or `waitFor()`

4. **Environment differences** — Different screen sizes, slower CI machines
   - Fix: Set explicit viewport sizes, increase timeout in config for CI

5. **Shared state** — Tests modify data that other tests rely on
   - Fix: Each test should set up its own data

Debugging tools: Enable `trace: 'on-first-retry'` to get a full recording of failed runs.
</details>

---

## Section 9: Practical Coding Challenges

These are the kind of "write code on the spot" questions you might get.

### Challenge 1: Write a Login Test
**"Write a test that verifies a user can log in and sees the products page."**

<details>
<summary>What they're looking for</summary>

- Proper `async/await` usage
- Clean locator strategy (data-testid or getByRole)
- Meaningful assertion (URL or page content, not just "no error")
- Optional bonus: POM pattern

```js
test('successful login redirects to products', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('.title')).toHaveText('Products');
});
```
</details>

### Challenge 2: Verify a Sorted List
**"Given a page with a list of products, write a test that verifies sorting by price works correctly."**

<details>
<summary>What they're looking for</summary>

- Ability to extract multiple element values
- Data transformation (string prices to numbers)
- Array comparison logic

```js
test('sorts products by price low to high', async ({ page }) => {
  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
  const priceTexts = await page.locator('[data-test="inventory-item-price"]').allTextContents();
  const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});
```
</details>

### Challenge 3: API Test
**"Write a test that creates a resource via POST and verifies the response."**

<details>
<summary>What they're looking for</summary>

- Using `request` fixture (not `page`)
- Sending a body with `data`
- Checking both status code AND response body

```js
test('create a new post', async ({ request }) => {
  const response = await request.post('/posts', {
    data: {
      title: 'My Post',
      body: 'Post content',
      userId: 1,
    },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body).toMatchObject({
    title: 'My Post',
    body: 'Post content',
    userId: 1,
  });
  expect(body).toHaveProperty('id');
});
```
</details>

---

## Section 10: Behavioral / Conceptual Questions

### Q10.1
**"Tell me about a testing project you've worked on."**

<details>
<summary>Talking Points</summary>

Reference your learn-playwright project:
- Built an E2E test suite for an e-commerce app (SauceDemo) covering login, inventory, cart, and checkout flows
- Built a CRUD test suite for a TodoMVC app
- Built API tests for a REST API (JSONPlaceholder)
- Used Page Object Model for all three — UI page objects AND an API client class
- Configured multi-project setup in playwright.config.js with different baseURLs
- Covered happy paths AND edge cases (locked users, empty form validation, 404 responses)
</details>

### Q10.2
**"How do you decide between E2E testing and unit testing?"**

<details>
<summary>Talking Points</summary>

Follow the test pyramid:
- **Unit tests** for logic (calculations, data transformations, utility functions)
- **E2E tests** for critical user journeys (login → browse → checkout)
- E2E tests are slow and expensive — use them sparingly for high-value flows
- Don't E2E test everything — if a unit test can catch the bug, prefer that
- Example: Test that the price sorting algorithm works with a unit test. Test that the user CAN sort products on the page with an E2E test.
</details>

### Q10.3
**"What makes a good test?"**

<details>
<summary>Talking Points</summary>

1. **Independent** — Doesn't depend on other tests
2. **Deterministic** — Same result every time (not flaky)
3. **Readable** — Another person can understand what it tests
4. **Fast** — As fast as possible for its level in the pyramid
5. **Meaningful** — Tests something a user would care about
6. **Maintainable** — Uses patterns like POM so changes are easy
</details>

---

## Quick Reference: Your Project Examples

When answering interview questions, reference real code you've written:

| Concept | Your Example |
|---|---|
| POM | `LoginPage.js`, `InventoryPage.js`, `CartPage.js`, `CheckoutPage.js`, `TodoPage.js` |
| API POM | `ApiClient.js` |
| Locators | `data-test` attributes, `getByRole()`, partial selectors (`^=`, `$=`) |
| Sorting test | `inventory.spec.js` — price and name sorting |
| CRUD tests | `todo.spec.js` — add, edit, complete, delete, filter |
| API CRUD | `posts.spec.js` — GET, POST, PUT, DELETE |
| Multi-page flow | `checkout.spec.js` — login through confirmation |
| Edge cases | Locked user login, empty form validation, 404 API response |
| Config | Multi-project setup with 3 apps and different baseURLs |

---

## Section 11: Network Interception & Mocking

### Q11.1 (Intermediate)
**What is `page.route()` and when would you use it?**

<details>
<summary>Answer Hint</summary>

`page.route()` intercepts network requests and lets you modify or mock them. It's like a barista intercepting an order slip before it reaches the kitchen — you can change it, reject it, or replace it with something pre-made.

Use cases:
- **Mock API responses** — Test UI behavior without depending on a real backend
- **Simulate errors** — Return a 500 to test how the UI handles server failures
- **Simulate slow network** — Add delays to test loading states
- **Block resources** — Skip loading images/ads for faster tests

```js
// Mock an API response
await page.route('**/api/products', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Mocked Croissant', price: 3.99 }]),
  });
});

// Simulate a server error
await page.route('**/api/checkout', async (route) => {
  await route.fulfill({ status: 500, body: 'Internal Server Error' });
});

// Simulate slow response
await page.route('**/api/products', async (route) => {
  await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
  await route.continue();
});

// Block images for faster tests
await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort());
```
</details>

### Q11.2 (Intermediate)
**What's the difference between `route.fulfill()`, `route.continue()`, and `route.abort()`?**

<details>
<summary>Answer Hint</summary>

| Method | What It Does | Cafe Analogy |
|---|---|---|
| `route.fulfill()` | Return a custom response (never hits the server) | Barista gives you a pre-made coffee from the fridge |
| `route.continue()` | Let the request go through (optionally modify it first) | Order goes to the kitchen, maybe with a note added |
| `route.abort()` | Block the request entirely | "Sorry, we're out of that!" |

```js
// Modify request headers before sending
await page.route('**/api/**', async (route) => {
  await route.continue({
    headers: { ...route.request().headers(), 'X-Custom': 'value' },
  });
});
```
</details>

### Q11.3 (Advanced)
**How would you test that your UI correctly handles a failed API call?**

<details>
<summary>Answer Hint</summary>

Intercept the API call, return an error, then assert the UI shows the right error state:

```js
test('shows error message when API fails', async ({ page }) => {
  // Intercept and return 500
  await page.route('**/api/products', async (route) => {
    await route.fulfill({ status: 500, body: 'Server Error' });
  });

  await page.goto('/products');

  // Assert the UI handles it gracefully
  await expect(page.locator('.error-message')).toHaveText('Failed to load products');
  await expect(page.locator('.retry-button')).toBeVisible();
});
```

This tests the **UI's resilience**, not the API itself. You already test the API separately in your API tests.
</details>

---

## Section 12: Custom Fixtures

### Q12.1 (Intermediate)
**What are Playwright fixtures and why would you create custom ones?**

<details>
<summary>Answer Hint</summary>

Fixtures are Playwright's way of providing test dependencies (like `page` and `request`). Custom fixtures let you extend this to include your own setup — like pre-built page objects.

Think of it like a cafe that pre-sets each table: instead of every customer (test) asking for a menu, cutlery, and napkins, the table comes pre-set. Custom fixtures "pre-set" your tests.

```js
// fixtures.js
const { test as base } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },
});

module.exports = { test };
```

Then in tests:
```js
const { test } = require('./fixtures');

test('login works', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  // No need to manually create LoginPage anymore!
});
```
</details>

### Q12.2 (Advanced)
**How would you create a fixture that logs in before every test automatically?**

<details>
<summary>Answer Hint</summary>

```js
const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup: login before the test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    // Hand the logged-in page to the test
    await use(page);
    // Teardown runs after the test (if needed)
  },
});

// Tests get a pre-logged-in page
test('browse products', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.locator('.title')).toHaveText('Products');
});
```

For even better performance, use **`storageState`** — save cookies/auth after login once, reuse across all tests without repeating the login flow:

```js
// global-setup.js
async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.context().storageState({ path: './auth.json' });
  await browser.close();
}

// playwright.config.js
use: { storageState: './auth.json' }
```
</details>

---

## Section 13: CI/CD Integration

### Q13.1 (Intermediate)
**How would you run Playwright tests in a CI/CD pipeline?**

<details>
<summary>Answer Hint</summary>

Playwright has first-class CI support. Here's a GitHub Actions example:

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
```

Key points:
- `npx playwright install --with-deps` installs browsers AND system dependencies
- Upload the HTML report as an artifact so you can debug failures
- Use `if: ${{ !cancelled() }}` to upload report even when tests fail
</details>

### Q13.2 (Intermediate)
**What config adjustments do you make for CI vs local development?**

<details>
<summary>Answer Hint</summary>

```js
// playwright.config.js
module.exports = defineConfig({
  retries: process.env.CI ? 2 : 0,        // Retry flaky tests in CI
  workers: process.env.CI ? 1 : undefined, // Sequential in CI, parallel locally
  use: {
    trace: 'on-first-retry',               // Capture trace only on retry
    screenshot: 'only-on-failure',          // Save screenshots on failure
    video: 'retain-on-failure',             // Keep video only for failures
  },
});
```

Why:
- **Retries in CI** — Catches rare flakiness from shared infrastructure
- **Single worker in CI** — More predictable, avoids resource contention
- **Traces/screenshots** — Essential for debugging failures you can't reproduce locally
</details>

### Q13.3 (Advanced)
**How do you handle authentication in CI where there's no interactive login?**

<details>
<summary>Answer Hint</summary>

Use **`globalSetup`** with `storageState`:

1. `globalSetup` runs once before all tests — logs in and saves cookies to a file
2. All tests reuse the saved auth state — no login needed per test
3. Store credentials as CI secrets (environment variables), never hardcoded

```js
// global-setup.js
async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL);
  await page.fill('#username', process.env.TEST_USER);
  await page.fill('#password', process.env.TEST_PASS);
  await page.click('#login');
  await page.context().storageState({ path: './auth.json' });
  await browser.close();
}
```

This is faster (login once, not per test) AND more secure (credentials in env vars).
</details>

---

## Section 14: Visual Regression Testing

### Q14.1 (Intermediate)
**What is visual regression testing? How does Playwright support it?**

<details>
<summary>Answer Hint</summary>

Visual regression testing catches unexpected UI changes by comparing screenshots against a baseline — like comparing today's pastry display photo with yesterday's to spot if anything looks off.

Playwright has built-in support via `toHaveScreenshot()`:

```js
test('product page looks correct', async ({ page }) => {
  await page.goto('/inventory.html');
  await expect(page).toHaveScreenshot('inventory-page.png');
});
```

First run: saves a baseline screenshot.
Subsequent runs: compares against the baseline and fails if there's a visual difference.

Update baselines when the UI intentionally changes:
```bash
npx playwright test --update-snapshots
```
</details>

### Q14.2 (Intermediate)
**When should you use visual regression testing vs. functional assertions?**

<details>
<summary>Answer Hint</summary>

| Use Visual Testing When | Use Functional Assertions When |
|---|---|
| Layout/styling matters (pixel-level) | Testing behavior (click, submit, navigate) |
| Catching unexpected CSS regressions | Verifying text content or element state |
| Design-heavy pages (landing, marketing) | Testing logic (sorting, filtering, CRUD) |
| Cross-browser visual consistency | Verifying data correctness |

Best practice: Use visual testing as a **complement**, not a replacement. Functional tests tell you WHAT broke; visual tests tell you if something LOOKS wrong that functional tests might miss.

Pitfall: Visual tests can be flaky with dynamic content (timestamps, animations). Mask or freeze those areas:
```js
await expect(page).toHaveScreenshot({
  mask: [page.locator('.timestamp')],  // Ignore dynamic content
});
```
</details>

---

## Section 15: Advanced Patterns

### Q15.1 (Advanced)
**How would you handle testing a page with dynamic/lazy-loaded content?**

<details>
<summary>Answer Hint</summary>

Playwright's auto-waiting handles most cases, but for lazy-loaded content:

```js
// Wait for a specific element to appear
await page.locator('.product-card').first().waitFor();

// Wait for network to be idle (all API calls finished)
await page.waitForLoadState('networkidle');

// Wait for a specific API response
const responsePromise = page.waitForResponse('**/api/products');
await page.click('.load-more');
const response = await responsePromise;
```

Prefer `waitFor()` on a specific element over `networkidle` — it's more targeted and less flaky.
</details>

### Q15.2 (Advanced)
**How would you test a file upload or download with Playwright?**

<details>
<summary>Answer Hint</summary>

**File Upload:**
```js
// Simple file input
await page.locator('input[type="file"]').setInputFiles('path/to/file.pdf');

// Multiple files
await page.locator('input[type="file"]').setInputFiles(['file1.pdf', 'file2.pdf']);

// Clear selection
await page.locator('input[type="file"]').setInputFiles([]);
```

**File Download:**
```js
// Wait for download event
const downloadPromise = page.waitForEvent('download');
await page.click('#download-button');
const download = await downloadPromise;

// Verify filename
expect(download.suggestedFilename()).toBe('report.pdf');

// Save to disk
await download.saveAs('./downloads/report.pdf');
```
</details>

### Q15.3 (Advanced)
**What is `storageState` and how does it improve test performance?**

<details>
<summary>Answer Hint</summary>

`storageState` saves a browser context's cookies and localStorage to a JSON file. This lets you:

1. **Log in once** in `globalSetup`
2. **Reuse auth state** in all tests — no repeated login flows

```js
// Save state after login
await page.context().storageState({ path: './auth.json' });

// Reuse in config — every test starts logged in
// playwright.config.js
use: { storageState: './auth.json' }
```

Performance impact: If you have 50 tests that each need login, you go from 50 login flows to 1. In a typical suite, this can save minutes.

You can also have **multiple auth states** (admin vs regular user):
```js
projects: [
  { name: 'admin', use: { storageState: './admin-auth.json' } },
  { name: 'user', use: { storageState: './user-auth.json' } },
]
```
</details>

---

## Section 16: Codebase Walk-Through Examples

These are concrete talking points drawn from **your actual test suite** — use them when an interviewer asks "show me something you've built."

---

### 16.1 — Partial Attribute Selectors (`cart.spec.js`, `InventoryPage.js`)

**The pattern:**
```js
// InventoryPage.js
this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
this.removeButtons    = page.locator('[data-test^="remove-"]');
this.productImages    = page.locator('[data-test$="-img"]');
```

**Why it matters:** SauceDemo's buttons have data-test values like `add-to-cart-sauce-labs-backpack`. If you hardcoded the full value, you'd need a separate locator per product. `^=` (starts-with) matches all add-to-cart buttons at once.

**Interview answer:** *"I use partial attribute selectors when attribute values are dynamic or include identifiers that would require hardcoding. For example, `[data-test^="add-to-cart"]` matches every add-to-cart button in the SauceDemo inventory regardless of product name — much more maintainable than one locator per product."*

---

### 16.2 — `.first()` vs `.nth()` and DOM shift (`cart.spec.js`)

**The pattern:**
```js
// WRONG — after clicking "remove", indices shift
await inventoryPage.addToCartButtons.nth(0).click();
await inventoryPage.removeButtons.nth(0).click(); // now nth(0) is a different button

// BETTER — use .first() when you always want the topmost remaining element
await inventoryPage.addToCartButtons.first().click();
```

**Interview answer:** *"I learned that `.nth(0)` and `.first()` behave differently when the DOM shifts after an action. In the cart tests, after removing an item, the remaining buttons reindex. Using `.first()` always targets the current top element — it's more resilient than a fixed index."*

---

### 16.3 — Route Interception with Override Per Test (`mock.spec.js`)

**The pattern:**
```js
// beforeEach — default mock (success)
test.beforeEach(async ({ page }) => {
  await page.route('**/posts/1', async route => {
    await route.fulfill({ status: 200, body: JSON.stringify(mockPastry) });
  });
});

// Individual test — registers AFTER beforeEach, so it takes priority (LIFO)
test('handles server error', async ({ page }) => {
  await page.route('**/posts/1', async route => {
    await route.fulfill({ status: 500, body: 'Internal Server Error' });
  });
  // ...
});
```

**Interview answer:** *"Playwright resolves route conflicts using last-registered-wins order (LIFO). I use this intentionally — set a default happy-path mock in `beforeEach`, then override just the error scenario in a specific test. It keeps the common setup DRY while allowing per-test variation."*

---

### 16.4 — Masking Dynamic Elements in Visual Tests (`visual.spec.js`)

**The pattern:**
```js
await expect(page).toHaveScreenshot('inventory.png', {
  mask: [page.locator('[data-test="shopping-cart-badge"]')],
  maxDiffPixels: 100
});
```

**Interview answer:** *"Visual regression tests break if dynamic content like cart counts or timestamps changes between runs. I use the `mask` option to redact those elements — Playwright replaces them with a solid color block. The baseline comparison then only fails when real layout or styling changes, not when data changes."*

---

### 16.5 — API Client as a Page Object (`posts.spec.js`, `PostsClient.js`)

**The pattern:**
```js
class PostsClient {
  constructor(request) {
    this.request = request;
    this.baseUrl = 'https://jsonplaceholder.typicode.com';
  }
  async getPost(id) {
    return this.request.get(`${this.baseUrl}/posts/${id}`);
  }
  async createPost(data) {
    return this.request.post(`${this.baseUrl}/posts`, { data });
  }
}
```

**Interview answer:** *"I applied the Page Object Model pattern to API testing too. The `PostsClient` class wraps all HTTP calls just like a UI page object wraps locators and actions. Tests only call named methods — they never construct URLs directly. If the base URL or endpoint changes, I update one class, not every test."*

---

### 16.6 — CI/CD Skip for Visual Tests (`visual.spec.js`)

**The pattern:**
```js
test.beforeEach(async ({ page }, testInfo) => {
  test.skip(!!process.env.CI, 'Visual tests skipped in CI — run locally to update baselines');
});
```

**Interview answer:** *"Visual regression baselines are OS-specific — a screenshot on macOS looks slightly different than on Linux in CI due to font rendering. Rather than fight false positives, we skip visual tests in CI and run them locally against a consistent environment. This is a pragmatic trade-off I'd revisit if we set up a dedicated Linux CI image to generate the baselines."*

---

Good luck with your interviews, Chi! You've built real tests, not just read about them — that's your biggest advantage.
