# JavaScript Fundamentals

Concepts that come up when writing Playwright tests.

## Class vs Instance

**Class** (capital letter) = a **blueprint**. It describes how something should work.
**Instance** (lowercase) = an **actual worker** created from that blueprint.

```js
// Blueprint — "here's how a waiter should work"
class ApiClient {
    constructor(request) { ... }
    async getPost(id) { ... }
}

// Hiring a waiter (creating an instance from the blueprint)
const apiClient = new ApiClient(request);

// Asking YOUR waiter to do something
await apiClient.getPost(1);
```

You can't ask the blueprint to do work:

```js
ApiClient.getPost(1);   // WRONG — asking the recipe card to fetch a croissant
apiClient.getPost(1);   // RIGHT — asking the waiter you hired
```

### Convention: Capital = class, lowercase = instance

| Class (blueprint) | Instance (worker) | Created with |
|---|---|---|
| `LoginPage` | `loginPage` | `new LoginPage(page)` |
| `InventoryPage` | `inventoryPage` | `new InventoryPage(page)` |
| `TodoPage` | `todoPage` | `new TodoPage(page)` |
| `ApiClient` | `apiClient` | `new ApiClient(request)` |

## for...of vs for (index)

Two ways to loop through an array:

```js
// Index-based — when you need the position
for (let i = 0; i < posts.length; i++) {
    expect(posts[i]).toHaveProperty('userId', 1);
}

// for...of — cleaner when you just need each item
for (const post of posts) {
    expect(post).toHaveProperty('userId', 1);
}
```

Use `for...of` when you don't need the index. Use index-based when you need `.nth(i)` or position tracking.

## Destructuring

Pulling specific values out of an object:

```js
// Without destructuring
const test = require('@playwright/test').test;
const expect = require('@playwright/test').expect;

// With destructuring — same thing, shorter
const { test, expect } = require('@playwright/test');
```

Playwright uses this in test functions too:

```js
// { page } pulls page out of Playwright's toolbox
test('my test', async ({ page }) => { ... });

// { request } pulls the HTTP client
test('my api test', async ({ request }) => { ... });
```

## Promises & await

A Promise is JavaScript's way of saying "I'm working on it — check back when I'm done." Some operations (like waiting for a page to load, or checking a URL) take time. Instead of freezing everything, JS hands you a Promise — a placeholder for a future result.

`await` is how you pause and wait for that result before moving on.

**Bakery analogy:** You order a croissant. The baker gives you a buzzer — that's the Promise. When it goes off (`await`), you go pick up your croissant. If you tried to eat the buzzer itself, that's what chaining further calls onto an unresolved Promise does.

**In Playwright:** Each `await expect(...)` is its own complete statement. You can't chain two assertions together — each one needs its own `await`.

```js
// correct — two separate awaited assertions
await expect(page).toHaveURL(/inventory/);
await expect(someLocator).toBeVisible();

// wrong — toHaveURL() returns a Promise, not a chainable object
await expect(page).toHaveURL(/inventory/).toBeVisible();
```

---

## Unused Parameters

When you declare a parameter in a function signature, you're telling the runtime "give me this value." If you never use it inside the function, it misleads readers into thinking the value matters.

**Bakery analogy:** A barista making a black espresso doesn't need milk, syrup, or a napkin — grabbing them anyway and putting them back unused is confusing. `{ page }` in a test that never touches `page` is the unused napkin.

**In Playwright:** If a test only interacts with a page object (e.g., `loginPage`), it doesn't need `{ page }` in its signature — the page object already holds a reference to `page` internally.

```js
// page is grabbed but never used
test('some test', async ({ page }) => {
    await loginPage.doSomething();
    await expect(loginPage.someLocator).toBeVisible();
});

// cleaner — only ask for what you need
test('some test', async () => {
    await loginPage.doSomething();
    await expect(loginPage.someLocator).toBeVisible();
});
```

---

## Template Literals

Strings with backticks that can include variables:

```js
// Regular string — clunky concatenation
'/posts/' + id

// Template literal — cleaner
`/posts/${id}`
```

`${...}` inserts the variable's value into the string.
