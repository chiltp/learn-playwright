# Test Structure

## Defining tests

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

## Grouping tests and setup

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
