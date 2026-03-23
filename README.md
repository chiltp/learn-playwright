# Learn Playwright

E2E test automation practice using [Playwright](https://playwright.dev/) against [SauceDemo](https://www.saucedemo.com/) — a demo e-commerce site built for testing.

## What This Covers

| Test Suite | Scenarios |
|---|---|
| **Login** | Valid login, locked user, invalid credentials, empty fields |
| **Inventory** | Product display, sorting (A-Z, Z-A, price low-high, price high-low) |
| **Shopping Cart** | Add/remove items, cart badge updates, cart page contents |
| **Checkout** | Complete purchase flow, form validation errors |

## Project Structure

```
tests/
  pages/              # Page Object Model
    LoginPage.js
    InventoryPage.js
    CartPage.js
    CheckoutPage.js
  login.spec.js       # Login test suite
  inventory.spec.js   # Inventory/sorting test suite
  cart.spec.js        # Shopping cart test suite
  checkout.spec.js    # Checkout flow test suite
```

## Running Tests

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npm test

# Run in headed mode (see the browser)
npm run test:headed

# Run only in Chromium
npm run test:chromium

# View the HTML report after a test run
npm run report
```

## Key Patterns Used

- **Page Object Model** — each page has its own class with selectors and actions, keeping tests readable and maintainable
- **`data-test` selectors** — using test-specific attributes instead of fragile CSS selectors
- **Cross-browser testing** — runs on Chromium, Firefox, and WebKit
