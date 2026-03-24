# Learn Playwright

E2E test automation practice using [Playwright](https://playwright.dev/) against two web apps:

- [SauceDemo](https://www.saucedemo.com/) — a demo e-commerce site built for testing
- [TodoMVC (React)](https://todomvc.com/examples/react/dist/) — a classic todo app for comparing frameworks

## What This Covers

### SauceDemo (17 tests)

| Test Suite | Scenarios |
|---|---|
| **Login** | Valid login, locked user, empty fields |
| **Inventory** | Sorting by price/name, product data completeness |
| **Cart** | Add/remove items, cart badge, item persistence, exact name verification |
| **Checkout** | Complete purchase flow, form validation errors, confirmation page |

### TodoMVC (11 tests)

| Test Suite | Scenarios |
|---|---|
| **CRUD** | Add single/multiple todos, edit (double-click), delete (hover + click) |
| **Complete/Uncomplete** | Check/uncheck todos |
| **Filtering** | All, Active, Completed filters |
| **Footer** | Item count, Clear completed |
| **Persistence** | Verify behavior on page reload |

## Project Structure

```
tests/
  saucedemo/              # E-commerce app tests
    pages/
      LoginPage.js
      InventoryPage.js
      CartPage.js
      CheckoutPage.js
    login.spec.js
    inventory.spec.js
    cart.spec.js
    checkout.spec.js
  todomvc/                # Todo app tests
    pages/
      TodoPage.js
    todo.spec.js
playwright.config.js      # Two projects: saucedemo + todomvc
```

## Running Tests

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests (both projects)
npm test

# Run only SauceDemo tests
npm run test:saucedemo

# Run only TodoMVC tests
npm run test:todomvc

# Run in headed mode (see the browser)
npm run test:headed

# View the HTML report after a test run
npm run report
```

## Key Patterns Used

- **Page Object Model** — each page has its own class with selectors and actions, keeping tests readable and maintainable
- **`data-test` / `data-testid` selectors** — using test-specific attributes instead of fragile CSS selectors
- **`getByRole()` locators** — semantic queries for elements without test IDs (links, buttons)
- **Partial attribute selectors** — `[data-test^="add-to-cart"]` (starts with), `[data-test$="-img"]` (ends with) for dynamic attributes
- **Multiple project configuration** — single config file running tests against different apps
