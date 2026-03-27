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
