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

## Template Literals

Strings with backticks that can include variables:

```js
// Regular string — clunky concatenation
'/posts/' + id

// Template literal — cleaner
`/posts/${id}`
```

`${...}` inserts the variable's value into the string.
