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

## Interview Prep: Advanced Topics to Study

Topics commonly asked in Playwright/automation interviews that go beyond the project exercises. See `docs/interview-prep.md` for full Q&A.

### Network Interception & Mocking
- `page.route()` — intercept, mock, or block network requests
- `route.fulfill()` vs `route.continue()` vs `route.abort()`
- Testing UI error states by mocking failed API responses
- Blocking resources (images, ads) for faster tests

### Custom Fixtures
- Extending `test` with `base.extend()` to include page objects
- Auto-login fixtures (pre-authenticated page)
- `storageState` — save/reuse cookies and auth across tests
- `globalSetup` — run once before all tests (e.g., login, seed data)

### CI/CD Integration
- GitHub Actions workflow for Playwright
- CI-specific config: retries, single worker, traces, screenshots
- Uploading HTML reports as artifacts
- Handling auth in CI with environment variables + `globalSetup`

### Visual Regression Testing
- `toHaveScreenshot()` — compare UI against baselines
- `--update-snapshots` to refresh baselines after intentional changes
- Masking dynamic content (timestamps, animations)
- When to use visual tests vs functional assertions

### Advanced Patterns
- Lazy-loaded content: `waitFor()`, `waitForLoadState()`, `waitForResponse()`
- File upload (`setInputFiles()`) and download (`waitForEvent('download')`)
- Multiple auth states per project (admin vs user)

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
| Interview Prep | Network interception (`page.route()`), custom fixtures (`base.extend()`), `storageState`, `globalSetup`, CI/CD (GitHub Actions), visual regression (`toHaveScreenshot()`), file upload/download |
