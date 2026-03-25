# Playwright Config

## baseURL behavior

`page.goto('/')` always goes to the **domain root**, ignoring any path in `baseURL`:

| baseURL | `goto('/')` resolves to |
|---|---|
| `https://www.saucedemo.com` | `https://www.saucedemo.com/` — works |
| `https://todomvc.com/examples/react/dist/` | `https://todomvc.com/` — wrong! |

For apps in subdirectories, use the full URL in `goto()` instead of `'/'`.

## Multiple projects

One `playwright.config.js` can run tests against different apps:

```js
projects: [
  { name: 'saucedemo', testDir: './tests/saucedemo', use: { baseURL: '...' } },
  { name: 'todomvc', testDir: './tests/todomvc', use: { baseURL: '...' } },
]
```

Run one project: `npx playwright test --project=saucedemo`
