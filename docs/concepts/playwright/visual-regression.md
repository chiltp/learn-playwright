# Visual Regression Testing

Compare screenshots against saved baselines to catch unintended visual changes.

## The Concept

Like a baker with a **photo of the perfect croissant** on the wall:
- **First run** — no photo exists, Playwright takes one and saves it as the **baseline** (test "fails")
- **Second run** — Playwright takes a new screenshot, compares it to the baseline. Match = pass

## `toHaveScreenshot()`

The core assertion — takes a screenshot AND compares it to the baseline automatically:

```js
test('login page looks correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('login-page.png');
});
```

No need to call `page.screenshot()` separately — `toHaveScreenshot()` handles everything.

## Snapshot Folder Structure

Baselines are saved in a folder named after your spec file:

```
tests/saucedemo/
├── visual.spec.js
└── visual.spec.js-snapshots/
    └── login-page-saucedemo-chromium-darwin.png
```

The filename includes:
- **Screenshot name** (`login-page`)
- **Project name** (`saucedemo-chromium`)
- **OS** (`darwin` for macOS, `linux`, `win32`)

This is why screenshots are browser and platform specific — they render differently.

## First Run vs Second Run

| Run | What Happens | Result |
|---|---|---|
| First | No baseline exists — takes screenshot and saves it | Fails |
| Second | Takes screenshot, compares to baseline | Passes (if unchanged) |

## Key Takeaways

- `toHaveScreenshot()` = take photo + compare to baseline in one step
- First run always "fails" — it's creating the baseline
- Baselines are per-browser and per-OS
- Commit baseline screenshots to git so the team shares the same reference

## Handling Dynamic Content

Some page elements change between runs (timestamps, animations). Use options to handle them:

```js
// Mask dynamic elements — replaced with a pink box in the screenshot
await expect(page).toHaveScreenshot('page.png', {
    mask: [page.locator('.timestamp')],
});

// Allow small pixel differences (anti-aliasing, font rendering)
await expect(page).toHaveScreenshot('page.png', {
    maxDiffPixels: 100,
});
```

## Element-Level Screenshots

Screenshot a single component instead of the full page:

```js
const loginForm = page.locator('.login_wrapper-inner');
await expect(loginForm).toHaveScreenshot('login-form.png');
```

Useful when you only care about one section and don't want unrelated page changes to break the test.

## Updating Baselines

When the UI changes **intentionally**, update the saved baselines:

```bash
npx playwright test visual.spec.js --update-snapshots
```

This tells Playwright: "the new screenshots are the correct ones now — replace the old baselines."

### When to Update vs When to Investigate

- **Update** when you intentionally changed the UI (redesign, new feature, CSS refactor)
- **Investigate** when you didn't change anything — the failure might be a real bug

Blindly updating snapshots every time a test fails defeats the purpose of visual testing.

## Visual Tests vs Functional Assertions

| Use Visual Tests When | Use Functional Assertions When |
|---|---|
| Checking overall appearance after CSS changes | Verifying specific text content |
| Catching unintended layout shifts | Testing behavior (click, submit, navigate) |
| Design-heavy pages (landing pages, marketing) | Testing logic (sorting, filtering, CRUD) |

**Rule of thumb:** Functional assertions test **behavior** ("did the right thing happen?"). Visual tests check **appearance** ("does it still look the same?").

## Cross-Browser Baselines

Each browser renders differently, so Playwright keeps **separate baselines per browser**:

```
login-page-saucedemo-chromium-darwin.png
login-page-saucedemo-firefox-darwin.png
login-page-saucedemo-webkit-darwin.png
```

A pixel-perfect match in Chromium would fail in Firefox due to font rendering, spacing, and anti-aliasing differences. This is expected.

## Key Takeaways

- `toHaveScreenshot()` = take photo + compare to baseline in one step
- First run always "fails" — it's creating the baseline
- Baselines are per-browser and per-OS
- Use `mask` for dynamic content, `maxDiffPixels` for minor rendering differences
- Use `--update-snapshots` when UI changes are intentional
- Visual tests complement functional assertions — use both, not one or the other
- Commit baseline screenshots to git so the team shares the same reference
