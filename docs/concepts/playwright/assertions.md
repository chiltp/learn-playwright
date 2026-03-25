# Assertions

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
