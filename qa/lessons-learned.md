# Lessons Learned

Real mistakes found in this codebase and how to fix them. Use this as a pre-commit checklist before writing new tests.

---

## 1. Using `test.beforeAll` instead of `test.beforeEach`

**Where it appeared:** `tests/saucedemo/sorting.spec.js`

**The mistake:**
```js
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  loginPage = new LoginPage(page);
  // ... login once, shared across all tests
});
```

**The problem:** All tests share the same `page` instance. If one test sorts Z-A, the next test starts with Z-A ordering instead of a clean state. Tests become order-dependent.

**The fix:**
```js
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  await loginPage.goto();
  await loginPage.login(STANDARD_USER, PASSWORD);
});
```

**Rule:** Always use `beforeEach` unless you're certain the setup has zero side effects AND the performance gain justifies the coupling risk.

---

## 2. Raw CSS class selectors in tests that prefer `data-test`

**Where it appeared:** `tests/saucedemo/visual.spec.js`

**The mistake:**
```js
const loginBox = page.locator('.login_wrapper-inner');
const credentials = page.locator('.login_credentials_wrap-inner');
```

**The problem:** `.login_wrapper-inner` is a styling class. If a CSS refactor renames it, the test breaks even though the feature still works. This contradicts the project's `data-test` selector strategy.

**The fix:** Ask the dev team to add `data-test` attributes to these containers, or use a structural selector:
```js
const loginBox = page.getByRole('main'); // semantic fallback
```

**Rule:** Only fall back to CSS classes when `data-test`, `getByRole`, or `getByLabel` are genuinely unavailable.

---

## 3. Exposing locators publicly instead of wrapping actions in methods

**Where it appeared:** `tests/saucedemo/pages/CartPage.js`

**The mistake:**
```js
// CartPage.js — locator exposed directly
this.checkoutButton = page.locator('[data-test="checkout"]');

// cart.spec.js — test clicks the raw locator
await cartPage.checkoutButton.click();
```

**The problem:** If the checkout flow requires two clicks (confirm modal added later), you update every test that calls `checkoutButton.click()` — not one method.

**The fix:**
```js
// CartPage.js
async proceedToCheckout() {
  await this.checkoutButton.click();
}

// cart.spec.js
await cartPage.proceedToCheckout();
```

**Rule:** Page objects should expose actions (methods), not implementation details (locators). Tests only know WHAT they can do, not HOW.

---

## 4. Missing `await` on `page.route()`

**Potential location:** Any test using `page.route()`

**The mistake:**
```js
// Missing await — route may not register before page.goto() fires
page.route('**/api/inventory', async route => {
  await route.fulfill({ body: JSON.stringify(mockData) });
});
await page.goto('/inventory');
```

**The problem:** `page.route()` is async. Without `await`, the mock may not be active when the request fires — causing intermittent test failures that are hard to reproduce.

**The fix:**
```js
await page.route('**/api/inventory', async route => {
  await route.fulfill({ body: JSON.stringify(mockData) });
});
await page.goto('/inventory');
```

**Rule:** `await` every Playwright call. Missing `await` is the #1 cause of flaky tests.

---

## 5. Forgetting `JSON.stringify()` when fulfilling with object bodies

**Potential location:** `tests/saucedemo/network.spec.js`, `tests/api/mock.spec.js`

**The mistake:**
```js
await route.fulfill({
  status: 200,
  body: [{ id: 1, name: 'Croissant', price: 3.50 }]  // object, not string
});
```

**The problem:** Playwright sends the body as a string. JavaScript converts the array to `[object Object]` — the app receives a malformed response.

**The fix:**
```js
await route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify([{ id: 1, name: 'Croissant', price: 3.50 }])
});
```

**Rule:** Always `JSON.stringify()` object bodies in `route.fulfill()`. Add `contentType: 'application/json'` to be explicit.

---

## 6. Not verifying response headers in API tests

**Where it appeared:** `tests/api/posts.spec.js`, `tests/api/users.spec.js`

**The mistake:**
```js
const response = await postsClient.getPost(1);
expect(response.status()).toBe(200);
expect(await response.json()).toMatchObject({ id: 1 });
// ← never checks Content-Type
```

**The problem:** A 200 with `Content-Type: text/html` usually means you hit an error page or redirect — not your API. The body check may still pass if the error page happens to contain your test data.

**The fix:**
```js
expect(response.headers()['content-type']).toContain('application/json');
```

**Rule:** Assert the `Content-Type` header on API responses to confirm you're talking to the right endpoint.

---

## 7. Hardcoded visual thresholds per test instead of config-level defaults

**Where it appeared:** `tests/saucedemo/visual.spec.js`

**The mistake:**
```js
// Repeated in multiple tests
await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
await expect(element).toHaveScreenshot({ maxDiffPixels: 50 });
```

**The problem:** If you decide to tighten the threshold project-wide, you have to update every individual test. Inconsistent thresholds also make it hard to understand what the policy actually is.

**The fix:** Set a project-wide default in `playwright.config.js`:
```js
expect: {
  toHaveScreenshot: { maxDiffPixels: 100 }
}
```

Then only override per test when a specific component genuinely needs different tolerance.

**Rule:** Configure defaults centrally, override individually only when justified.

---

## 8. UI login in `beforeEach` for tests that don't test login

**Where it appeared:** `tests/saucedemo/cart.spec.js`, `tests/saucedemo/checkout.spec.js`, etc.

**The mistake:**
```js
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(STANDARD_USER, PASSWORD);  // full UI login every time
});
```

**The problem:** A full UI login flow (navigate, fill, click, wait) adds ~1-2 seconds per test. With 20+ tests, that's 30-40 seconds of pure auth overhead.

**The fix:** Use `storageState` to save auth once and reuse it:
```js
// global-setup.js
await page.goto('/');
await loginPage.login(STANDARD_USER, PASSWORD);
await page.context().storageState({ path: 'auth.json' });

// playwright.config.js
use: { storageState: 'auth.json' }
```

**Rule:** Only test the login flow in `login.spec.js`. Every other suite should start already authenticated.

---

## 9. No test for the case where route interception order matters

**Where it appeared:** `tests/api/mock.spec.js`

**The pattern that needed a test:**
Playwright uses LIFO (last-in, first-out) for route handlers. When a test registers a route in the test body AND one was already registered in `beforeEach`, the test-body one takes priority. This is powerful but invisible — if you forget the order rule, your override silently does nothing.

**The lesson:** When using route overrides per test, add a comment explaining the LIFO behavior:
```js
// This route is registered AFTER beforeEach's default mock,
// so it takes priority for this test only (LIFO ordering).
await page.route('**/posts/1', async route => {
  await route.fulfill({ status: 500 });
});
```

**Rule:** Document non-obvious behaviors inline. Route ordering, `.first()` vs `.nth()` shifts, and `beforeAll` coupling are all things that look fine until they silently break.

---

## 10. `data-testid` vs `data-test` — inconsistent naming across suites

**Where it appeared:** `tests/saucedemo/` uses `[data-test="..."]`, `tests/todomvc/` uses `[data-testid="..."]`

**The situation:** These are different apps with different attribute conventions — this isn't a mistake per se. But if you're building a new app from scratch, pick one and document it.

**The lesson:** Your locator strategy should be decided per project and documented in CLAUDE.md or a `testing-conventions.md`. When inheriting an app that uses `data-testid`, match what's there. When you own the app, establish a team-wide convention before writing tests.

**Rule:** Inherit the attribute naming from the app you're testing. When you control both the app and the tests, define the convention once and enforce it via linter or code review.
