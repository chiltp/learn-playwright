# Playwright Learning Plan

Learn Playwright from scratch by writing E2E tests against SauceDemo, one test at a time.

## Approach

- Clean slate: no scaffolded code, build everything yourself
- One test at a time: write, run, understand, then move on
- Concepts introduced only when needed
- Page Object Model introduced after feeling the pain of repeated selectors

## Phases

### Phase 0 — Setup & Foundations
- Clean scaffolded files (keep config + package.json)
- async/await exercise (no Playwright)

### Phase 1 — Login Tests
1. Navigate to SauceDemo, check page loaded
2. Fill credentials, click login, assert inventory page
3. Error case: locked out user
4. Empty field validations
5. Refactor: extract LoginPage class (Page Object Model)

### Phase 2 — Inventory Tests
6. Assert products displayed after login
7. Test sorting options
8. Refactor: extract InventoryPage class

### Phase 3 — Cart Tests
9. Add item, check badge count
10. Remove item, verify badge gone
11. Go to cart page, verify items
12. Refactor: extract CartPage class

### Phase 4 — Checkout Tests
13. Complete purchase flow
14. Form validation errors
15. Refactor: extract CheckoutPage class

## Concept Introduction Order

| When | Concept |
|---|---|
| Phase 0 | async/await, promises |
| Test 1 | test(), page.goto(), expect, assertions |
| Test 2 | page.locator(), fill(), click(), data-test selectors |
| Test 3 | test.describe(), beforeEach |
| Phase 1 refactor | Page Object Model pattern |
| Phase 2 | selectOption(), array assertions |
| Phase 3 | toHaveCount(), toBeVisible(), toBeHidden() |
| Phase 4 | multi-step flows, chaining page objects |
