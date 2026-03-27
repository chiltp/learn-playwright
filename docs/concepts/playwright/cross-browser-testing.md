# Cross-Browser Testing

Run the same tests across different browser engines to catch browser-specific bugs.

## The Three Browser Engines

| Engine | Browser | Playwright Device |
|---|---|---|
| Chromium | Chrome, Edge | `devices['Desktop Chrome']` |
| Firefox (Gecko) | Firefox | `devices['Desktop Firefox']` |
| WebKit | Safari | `devices['Desktop Safari']` |

## Setting Up Multiple Browser Projects

Create a separate project per browser in `playwright.config.js`:

```js
projects: [
  {
    name: 'saucedemo-chromium',
    testDir: './tests/saucedemo',
    use: {
      baseURL: 'https://www.saucedemo.com',
      ...devices['Desktop Chrome'],
    },
  },
  {
    name: 'saucedemo-firefox',
    testDir: './tests/saucedemo',
    use: {
      baseURL: 'https://www.saucedemo.com',
      ...devices['Desktop Firefox'],
    },
  },
  {
    name: 'saucedemo-webkit',
    testDir: './tests/saucedemo',
    use: {
      baseURL: 'https://www.saucedemo.com',
      ...devices['Desktop Safari'],
    },
  },
]
```

## `devices` vs `browserName`

- `...devices['Desktop Chrome']` sets `browserName`, viewport, user agent, etc. all at once
- `browserName: 'chromium'` only sets the browser engine
- Don't mix both — they can conflict

## Running Tests

```bash
# Run all projects
npx playwright test

# Run a specific browser project
npx playwright test --project=saucedemo-firefox

# Run multiple projects
npx playwright test --project=saucedemo-chromium --project=saucedemo-firefox
```

Note: `--project` requires an **exact match** on the project name.

## Per-Project Retries

Override the global retry count for a specific project:

```js
{
  name: 'saucedemo-webkit',
  testDir: './tests/saucedemo',
  retries: 3,  // Override global retries for this project only
  use: {
    baseURL: 'https://www.saucedemo.com',
    ...devices['Desktop Safari'],
  },
}
```

## npm Scripts for Multi-Browser

```json
"test:saucedemo": "npx playwright test --project=saucedemo-chromium --project=saucedemo-firefox --project=saucedemo-webkit"
```

## Key Takeaways

- Same tests, different ovens (browsers) — the recipe should produce the same result
- Use `devices` spread to set browser + viewport + user agent in one line
- One project per browser per test suite
- API tests don't need multiple browsers (no UI to render)
