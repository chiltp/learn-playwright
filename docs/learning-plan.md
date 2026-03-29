# Playwright Learning Plan

Learn Playwright from scratch by writing E2E tests against real web apps, one test at a time.

## Approach

- Clean slate: no scaffolded code, build everything yourself
- One test at a time: write, run, understand, then move on
- Concepts introduced only when needed
- Page Object Model introduced after feeling the pain of repeated selectors

---

## Project 1: SauceDemo (E-commerce)

### Phase 0 — Setup & Foundations (Completed)
- Clean scaffolded files (keep config + package.json)
- async/await exercise (no Playwright)

### Phase 1 — Login Tests (Completed)
1. Navigate to SauceDemo, check page loaded
2. Fill credentials, click login, assert inventory page
3. Error case: locked out user
4. Empty field validations
5. Refactor: extract LoginPage class (Page Object Model)

### Phase 2 — Inventory Tests (Completed)
6. Sort products by price, verify entire list is sorted
7. Sort products by name, verify alphabetical order
8. Verify every product has name, price, and image
9. Refactor: extract InventoryPage class

### Phase 3 — Cart Tests (Completed)
10. Add item, check badge shows "1"
11. Remove item, verify badge disappears
12. Navigate to cart page, verify item persists
13. Add 3 items, verify exact names in cart
14. Refactor: extract CartPage class

### Phase 4 — Checkout Tests (Completed)
15. Complete purchase flow (login → cart → checkout → confirmation)
16. Form validation errors (missing name, missing zip)
17. Full E2E: verify "Thank you" confirmation page
18. Refactor: extract CheckoutPage class

---

## Project 2: TodoMVC (CRUD App) (Completed)

### CRUD Operations
1. Add a single todo
2. Add multiple todos
3. Edit a todo (double-click to enter edit mode)
4. Delete a todo (hover to reveal delete button)

### Complete/Uncomplete
5. Mark a todo as completed
6. Unmark a completed todo

### Filtering & Footer
7. Filter by Active and Completed
8. "All" filter shows everything
9. Item count updates correctly
10. Clear completed removes checked todos

### Persistence
11. Verify todos do not persist after page reload

---

## Project 3: API Testing with Playwright

### Phase 1 — API Fundamentals
1. What is a REST API
2. HTTP methods: GET, POST, PUT, DELETE
3. Status codes: 200, 201, 404, 500
4. Request & response structure (headers, body, JSON)

### Phase 2 — API Testing with Playwright
5. Make a GET request
6. Make a POST request (create data)
7. Test PUT (update) and DELETE
8. Assert status codes, response body, headers

### Phase 3 — Real API Practice
9. Test a public API (JSONPlaceholder)
10. Build an ApiClient page object (POM for APIs)
11. Test CRUD operations end-to-end

### Phase 4 — Combining UI + API (Completed — concepts only, no practice app with both UI + API available)
12. Use API to set up test data, then verify in the browser
13. Use API to clean up after tests

---

## Project 4: Cross-Browser Testing

### Phase 1 — Multi-Browser Setup
1. Add Firefox and WebKit projects to `playwright.config.js`
2. Run existing tests across all three browsers
3. Understand browser differences (rendering, timing)

### Phase 2 — Browser-Specific Strategies
4. Run a single project: `--project=firefox`
5. Handle browser-specific quirks (if any tests fail)
6. Configure retries per project

---

## Project 5: Visual Regression Testing (Completed)

### Phase 1 — Screenshot Basics (Completed)
1. Take a full-page screenshot with `toHaveScreenshot()`
2. Run again — see it pass (matches baseline)
3. Understand the snapshot folder structure

### Phase 2 — Handling Dynamic Content (Completed)
4. Mask dynamic elements (timestamps, animations) with `mask` option
5. Set `maxDiffPixels` or `threshold` for acceptable differences
6. Use element-level screenshots (screenshot a single component, not the full page)

### Phase 3 — Updating & Managing Baselines (Completed)
7. Make an intentional UI change, see the test fail
8. Update snapshots with `--update-snapshots`
9. When to use visual tests vs functional assertions

### Phase 4 — Practice on SauceDemo (Completed)
10. Visual test: login page appearance
11. Visual test: inventory page layout
12. Visual test: cart page with items
13. Compare screenshots across browsers (ties Project 4 + 5 together)

---

## Project 6: Interview Prep — Advanced Topics

Hands-on practice with advanced Playwright topics commonly asked in interviews. Each phase builds working tests, not just theory. See `docs/interview-prep.md` for Q&A study guide.

### Phase 1 — Network Interception & Mocking
1. Learn `page.route()` — intercept a request and log it
2. Mock an API response with `route.fulfill()` — return fake data and verify the UI renders it
3. Simulate a server error (500) — verify the UI handles failure gracefully
4. Block resources (images) with `route.abort()` — verify page loads faster
5. Use `route.continue()` to modify a request before it reaches the server

### Phase 2 — Custom Fixtures
6. Create a custom fixture with `base.extend()` — provide a page object automatically
7. Build an auto-login fixture — tests receive a pre-authenticated page
8. Use `storageState` — save auth cookies once, reuse across all tests
9. Set up `globalSetup` — run login once before the entire test suite

### Phase 3 — CI/CD Integration
10. Review existing GitHub Actions workflow and understand each step
11. Configure CI-specific settings: retries, single worker, traces, screenshots
12. Upload HTML report as an artifact — download and view after a CI run
13. Handle auth in CI with environment variables + `globalSetup`

### Phase 4 — Advanced Patterns
14. Handle lazy-loaded content with `waitFor()` and `waitForResponse()`
15. Test file upload with `setInputFiles()`
16. Test file download with `waitForEvent('download')`
17. Set up multiple auth states per project (admin vs regular user)

---

## Concept Introduction Order

| When | Concept |
|---|---|
| Phase 0 | async/await, promises |
| Phase 1, Test 1 | test(), page.goto(), expect, assertions |
| Phase 1, Test 2 | page.locator(), fill(), click(), data-test selectors |
| Phase 1, Test 3 | test.describe(), beforeEach |
| Phase 1 refactor | Page Object Model pattern |
| Phase 2 | selectOption(), allTextContents(), array assertions, partial attribute selectors (`^=`, `$=`) |
| Phase 3 | toBeHidden(), .first() vs .nth(), state change testing, hover() |
| Phase 4 | Multi-step flows, chaining page objects |
| TodoMVC | data-testid, getByRole(), check()/uncheck(), dblclick(), page.reload(), hover-to-reveal UI patterns |
| Repo restructure | Multiple projects in playwright.config.js |
| API Phase 1 | REST API concepts, HTTP methods, status codes, JSON |
| API Phase 2 | request.get(), request.post(), request.put(), request.delete() |
| API Phase 3 | ApiClient pattern (POM for APIs), CRUD testing |
| API Phase 4 | API + UI combined testing, test data setup/cleanup |
| Cross-Browser | Multiple browser projects in config, `--project` flag, browser-specific retries |
| Visual Regression | `toHaveScreenshot()`, snapshot baselines, `--update-snapshots`, `mask`, `maxDiffPixels`, element screenshots |
| Interview Prep | Network interception (`page.route()`), custom fixtures (`base.extend()`), `storageState`, `globalSetup`, CI/CD (GitHub Actions), file upload/download |
