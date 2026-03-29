# Learn Playwright

Test automation practice using [Playwright](https://playwright.dev/) — covering E2E browser testing, API testing, cross-browser testing, and visual regression testing:

- [SauceDemo](https://www.saucedemo.com/) — a demo e-commerce site built for testing
- [TodoMVC (React)](https://todomvc.com/examples/react/dist/) — a classic todo app for comparing frameworks
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) — a free fake REST API for testing

## What This Covers

### SauceDemo — E2E Browser Tests

| Test Suite | Scenarios |
|---|---|
| **Login** | Valid login, locked user, empty fields |
| **Inventory** | Sorting by price/name, product data completeness |
| **Cart** | Add/remove items, cart badge, item persistence, exact name verification |
| **Checkout** | Complete purchase flow, form validation errors, confirmation page |

### TodoMVC — E2E Browser Tests

| Test Suite | Scenarios |
|---|---|
| **CRUD** | Add single/multiple todos, edit (double-click), delete (hover + click) |
| **Complete/Uncomplete** | Check/uncheck todos |
| **Filtering** | All, Active, Completed filters |
| **Footer** | Item count, Clear completed |
| **Persistence** | Verify behavior on page reload |

### JSONPlaceholder — API Tests

| Test Suite | Scenarios |
|---|---|
| **CRUD** | GET single/all posts, POST create, PUT update, DELETE |
| **Filtering** | Query params (`?userId=1`), verify filtered results |
| **Negative** | 404 for non-existent resources |

### Cross-Browser Testing

All SauceDemo and TodoMVC tests run across **Chromium**, **Firefox**, and **WebKit** via separate projects in `playwright.config.js`.

### Visual Regression Testing

| Test Suite | Scenarios |
|---|---|
| **Login page** | Full page screenshot, masked credentials, custom threshold, element-level (form only) |
| **Inventory page** | Full page screenshot after login |
| **Cart page** | Screenshot with items added to cart |

Baselines are per-browser and per-OS. Update with `npx playwright test visual.spec.js --update-snapshots`.

## Project Structure

```
tests/
├── saucedemo/              # E-commerce E2E: login, inventory, cart, checkout, visual regression
│   ├── pages/              # Page objects: LoginPage, InventoryPage, CartPage, CheckoutPage
│   ├── visual.spec.js-snapshots/  # Visual regression baselines (per-browser, per-OS)
│   └── *.spec.js           # Test suites: one per page/feature
├── todomvc/                # Todo app E2E: CRUD, filtering, editing, persistence
│   ├── pages/              # Page objects: TodoPage
│   └── todo.spec.js
└── api/                    # REST API testing (no browser needed)
    ├── pages/              # API page objects: PostsClient, UsersClient
    ├── posts.spec.js
    └── users.spec.js
playwright.config.js        # Seven projects: saucedemo/todomvc/api × chromium/firefox/webkit
```

## Running Tests

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests (all projects)
npm test

# Run only SauceDemo tests
npm run test:saucedemo

# Run only TodoMVC tests
npm run test:todomvc

# Run only API tests
npm run test:api

# Run in headed mode (see the browser)
npm run test:headed

# View the HTML report after a test run
npm run report
```

## Key Patterns Used

- **Page Object Model** — each page/API has its own class with selectors and actions, keeping tests readable and maintainable
- **`data-test` / `data-testid` selectors** — using test-specific attributes instead of fragile CSS selectors
- **`getByRole()` locators** — semantic queries for elements without test IDs (links, buttons)
- **Partial attribute selectors** — `[data-test^="add-to-cart"]` (starts with), `[data-test$="-img"]` (ends with) for dynamic attributes
- **API testing with `request`** — testing REST APIs directly without a browser
- **Multiple project configuration** — single config file running tests against different apps and APIs
- **Cross-browser testing** — same tests across Chromium, Firefox, and WebKit
- **Visual regression testing** — `toHaveScreenshot()` with baselines, masking, thresholds, and element-level screenshots
