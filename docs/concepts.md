# Concepts Learned

Notes and reference from the Playwright learning journey.

---

## async/await

- **async** marks a function that contains slow operations (network requests, browser actions)
- **await** means "wait for this to finish before moving on"
- Without `await`, you get `Promise { <pending> }` instead of the actual result
- Rule 1: `await` means "wait for this to finish"
- Rule 2: You can only use `await` inside an `async` function

Every browser action is slow compared to normal code:
- Loading a page → network request
- Typing → simulating keystrokes
- Clicking → waiting for browser response
- Assertions → waiting for elements to appear

**Rule of thumb:** if a line talks to the browser, it needs `await`.

---

## Test Structure

### Defining tests

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

### Grouping tests and setup

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

---

## Page Object Model (POM)

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

---

## Locators

### Selector types

| Selector | Example | When to use |
|---|---|---|
| `data-test` attribute | `[data-test="username"]` | SauceDemo-style, most stable |
| `data-testid` attribute | `[data-testid="todo-item"]` | TodoMVC-style, same idea |
| Class selector | `.todo-count` | When no test ID exists |
| `getByRole()` | `getByRole('link', { name: 'Active' })` | Semantic, for elements without test IDs |

### Partial attribute selectors (CSS)

| Syntax | Meaning | Example |
|---|---|---|
| `^=` | Starts with | `[data-test^="add-to-cart"]` — matches all "Add to cart" buttons |
| `$=` | Ends with | `[data-test$="-img"]` — matches all product images |
| `*=` | Contains | `[data-test*="item"]` — matches anything with "item" in it |

### .first() vs .nth(i)

A locator like `todoPage.todoItems` matches **all** elements with that selector. For actions (click, hover, fill), you must specify which one:

| Method | What it does |
|---|---|
| `.first()` | First matching element |
| `.last()` | Last matching element |
| `.nth(i)` | Element at index i |

**When the list shifts** (e.g., "Add to cart" buttons become "Remove" after clicking): use `.first()` — it always grabs the front of the line.

**When the list is stable** (e.g., reading names on the cart page): use `.nth(i)` — positions are reliable.

### getByRole — HTML elements and their roles

| HTML Element | Implicit ARIA Role |
|---|---|
| `<input type="text">` | `textbox` |
| `<input type="checkbox">` | `checkbox` |
| `<button>` | `button` |
| `<a href="...">` | `link` |
| `<select>` | `combobox` |
| `<h1>` - `<h6>` | `heading` |

Use `getByRole('link', { name: 'Active' })` to find elements by what they *are*, not their CSS selector.

---

## Actions

| Action | What it does | Example |
|---|---|---|
| `fill()` | Type into a text input | `input.fill('hello')` |
| `click()` | Click an element | `button.click()` |
| `check()` | Check a checkbox | `checkbox.check()` |
| `uncheck()` | Uncheck a checkbox | `checkbox.uncheck()` |
| `selectOption()` | Pick from a `<select>` dropdown | `dropdown.selectOption('lohi')` |
| `press()` | Press a keyboard key | `input.press('Enter')` |
| `hover()` | Hover over an element | `item.hover()` |
| `dblclick()` | Double-click an element | `item.dblclick()` |
| `getAttribute()` | Read an HTML attribute | `img.getAttribute('src')` |

### Getting text from elements

| Method | Returns | Use case |
|---|---|---|
| `textContent()` | Single element's text | Reading one item |
| `allTextContents()` | Array of text from all matches | Reading all prices, all names |

---

## Assertions

| Assertion | What it checks |
|---|---|
| `toHaveTitle()` | Page title matches |
| `toHaveURL()` | Page URL matches (supports regex) |
| `toHaveText()` | Element text matches (auto-trims, auto-waits) |
| `toHaveCount()` | Number of matching elements |
| `toBeVisible()` | Element is visible |
| `toBeHidden()` | Element is not visible / doesn't exist |
| `toBeChecked()` | Checkbox is checked |
| `toBeTruthy()` | Value is not null, undefined, 0, or empty string |
| `toEqual()` | Deep equality (for arrays, objects) |

Use `not` to negate: `expect(checkbox).not.toBeChecked()`

**Prefer Playwright assertions** (`toHaveText`, `toHaveCount`) over manual checks (`textContent()` + `toBe()`). Playwright assertions auto-wait and auto-retry.

---

## Playwright Config

### baseURL behavior

`page.goto('/')` always goes to the **domain root**, ignoring any path in `baseURL`:

| baseURL | `goto('/')` resolves to |
|---|---|
| `https://www.saucedemo.com` | `https://www.saucedemo.com/` — works |
| `https://todomvc.com/examples/react/dist/` | `https://todomvc.com/` — wrong! |

For apps in subdirectories, use the full URL in `goto()` instead of `'/'`.

### Multiple projects

One `playwright.config.js` can run tests against different apps:

```js
projects: [
  { name: 'saucedemo', testDir: './tests/saucedemo', use: { baseURL: '...' } },
  { name: 'todomvc', testDir: './tests/todomvc', use: { baseURL: '...' } },
]
```

Run one project: `npx playwright test --project=saucedemo`

---

## Git & GitHub

### Local commit vs push to GitHub

- `git commit` = save a snapshot on **your machine only**
- `git push` = send your commits to **GitHub (remote server)**
- You can make many local commits before pushing — they all get sent at once

### The Git workflow

```
Write code → git add (stage) → git commit (local snapshot) → git push (send to GitHub)
```

| Command | What it does |
|---|---|
| `git status` | See what changed |
| `git add <files>` | Stage files for commit |
| `git commit -m "message"` | Save snapshot locally |
| `git push origin main` | Send to GitHub |
| `git pull origin main` | Get latest from GitHub |
| `git diff` | See unstaged changes |
| `git checkout -b feature/name` | Create a new branch |

### Branching

Branches are like a test kitchen — experiment with a new recipe without touching the main menu. Create a Pull Request to merge back into `main` after review.

---

## npm

**npm** = Node Package Manager. A tool that downloads and manages code packages (dependencies) so you don't write everything from scratch.

### Key commands

| Command | What it does |
|---|---|
| `npm install` | Download all dependencies listed in package.json |
| `npm test` | Run the "test" script from package.json |
| `npm run <script>` | Run any custom script from package.json |
| `npx <command>` | Run a package's CLI tool directly |

### npm vs npx

- `npm` = install and manage packages
- `npx` = run a package's command (e.g., `npx playwright test`)

### package.json vs package-lock.json

| | `package.json` | `package-lock.json` |
|---|---|---|
| Who writes it | You | npm (auto-generated) |
| Version style | Flexible (`^1.58.2` = 1.58.2+) | Exact (`1.58.2`) |
| Purpose | "What I need" | "Exactly what I installed" |
| Edit manually? | Yes | Never |

The lock file ensures everyone on the team installs the exact same versions.

### npm run vs npx

`npm run test:saucedemo` and `npx playwright test --project=saucedemo` do the same thing. The npm script is a shortcut defined in `package.json`. Use `npx` directly when you need extra flags like `--headed` or `--debug`.
