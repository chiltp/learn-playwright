# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context

This is a **learning project** for Chi (a student learning Playwright). The `playwright-tutor` skill governs how to teach — use it whenever Chi asks to learn, practice, or get explanations. Do not write code for her; guide her to write it herself.

## Git Workflow

- User frequently works across multiple branches and repos (MathGPT, QA repos). Always confirm the correct repo path and current branch before executing git operations.
- When pushing files to a different branch than the current one, confirm the source and target branches explicitly before proceeding.
- Never use placeholder paths like `/path/to/project` — always resolve the actual path first.

## Interaction Style

- When the user asks for a direct fix or direct answer, provide it immediately. Do NOT default to Socratic questioning unless the user explicitly requests tutoring mode.
- If a tutoring/Socratic skill is active but the user says 'just fix it' or 'give me the answer', switch to direct mode immediately.

## File & Tool Operations

- When user asks to 'see' or 'open' a file, open it in VS Code (`code <filepath>`) rather than displaying contents in the terminal, unless they specify otherwise.
- After creating or modifying skill files, hooks, or MCP configs, remind the user they may need to restart the Claude Code session for changes to take effect.

### MCP Server Configuration

- Always use `claude mcp add` CLI commands to configure MCP servers. Do NOT manually edit `~/.claude/.mcp.json` as changes may not be picked up.

## QA Test Documentation

- This user frequently works on QA test case documents (Markdown), TestRail scripts, and test case reviews.
- When editing QA docs, always check for duplicate preconditions, correct priority labels, and consistent variation numbering before committing.
- Confirm the canonical file path before editing — test docs may exist in multiple directories.

## Commands

```bash
# Install
npm install
npx playwright install

# Run all tests (all 7 projects)
npm test

# Run by suite
npm run test:saucedemo       # Chromium + Firefox + WebKit
npm run test:todomvc         # Chromium + Firefox + WebKit
npm run test:api             # No browser, REST API only

# Run a single spec file
npx playwright test tests/saucedemo/login.spec.js

# Run a single test by name
npx playwright test --grep "should log in with valid credentials"

# Run a single project
npx playwright test --project=saucedemo-chromium

# Headed mode (see the browser)
npm run test:headed

# Update visual regression baselines (run locally, not in CI)
npx playwright test visual.spec.js --update-snapshots

# View HTML report
npm run report
```

## Architecture

### Project Configuration (`playwright.config.js`)

Seven projects are defined — SauceDemo and TodoMVC each run across Chromium, Firefox, and WebKit; API tests run without a browser. Each project has its own `testDir` and `baseURL`. Visual regression baselines are OS-specific, so they are skipped in CI.

### Page Object Model

Every test suite uses a Page Object class that lives in a `pages/` subdirectory next to the spec files:

- `tests/saucedemo/pages/` — `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`
- `tests/todomvc/pages/` — `TodoPage`
- `tests/api/pages/` — `PostsClient`, `UsersClient` (API clients, not browser pages)

Page objects expose locators as instance properties and reusable actions as `async` methods. Tests import the class, instantiate it with `page`, and call those methods — they never touch raw selectors directly.

### Selector Strategy

- Prefer `[data-test="..."]` attributes (SauceDemo provides these)
- Use `getByRole()` for semantic elements (links, buttons) without test IDs
- Partial attribute selectors for dynamic values: `[data-test^="add-to-cart"]` (starts-with), `[data-test$="-img"]` (ends-with)

### Test Structure

Each spec file uses `test.describe` with a `test.beforeEach` that navigates to the page and creates a fresh page object. Tests are independent — no shared state between them.

### Concept Docs

`docs/concepts/` contains markdown explanations written during learning sessions. These are Chi's personal reference notes, not API documentation. Do not modify them without being asked.

## Current Focus

**Project 6: Network Interception & Mocking** (started April 2026)
- Learning `page.route()` for request interception
- Learning `page.waitForResponse()` for response waiting
- Goal: mock SauceDemo inventory API with custom (pastry-themed) data

## QA Testing Rules

- No hardcoded waits — never use `page.waitForTimeout()`. Use `waitForResponse` or `waitForSelector` instead.
- One assertion per test concept — don't combine multiple concerns in one test.
- Test isolation — each test must be independent, no shared state between tests.
- Prefer `getByRole` and `getByLabel` over raw CSS selectors where possible.

## Anti-Patterns Found in This Codebase

These are real issues discovered via code analysis — point them out when they appear in new tests:

- **`test.beforeAll` for shared state** (`sorting.spec.js`): Using `beforeAll` creates one page object shared across all tests. If one test modifies state, subsequent tests inherit it. Always prefer `beforeEach` to get a fresh, isolated setup per test.
- **Raw CSS class selectors in visual tests** (`visual.spec.js`): Selectors like `.login_wrapper-inner` and `.login_credentials_wrap-inner` are styling classes that can change when CSS is refactored. Use `data-test` attributes or `getByRole()` instead. Visual tests are the one exception where scoping screenshots to a semantic container is acceptable, but document why.
- **Hardcoded visual thresholds in test body**: `maxDiffPixels: 100` inside individual tests duplicates configuration. Define thresholds in `playwright.config.js` under `expect.toHaveScreenshot` so they apply project-wide.
- **Missing `await` on `page.route()`**: Route registration is async — forgetting `await` means the mock may not be active before the page loads, causing intermittent failures.
- **No API-based auth for speed**: Currently all tests log in via UI. For tests that don't test login itself, using `storageState` (saved session) or direct API auth skips the login flow and speeds up the suite significantly.

## Learning Style

- Chi is learning — give Socratic hints, not direct answers or pre-written code.
- Use cafe/pastry-themed variable names and examples (e.g., mock products named after pastries).
- JS beginner: explain `async/await` and JS concepts when they come up naturally.
- Interview prep focus: explain the "why" behind patterns, not just the "what".
