# CI/CD (Continuous Integration / Continuous Deployment)

## CI vs CD

| | CI (Continuous Integration) | CD (Continuous Deployment) |
|---|---|---|
| What it does | Automatically **tests** your code on every push | Automatically **deploys** your code after tests pass |
| When you need it | Always — catches bugs before they reach others | When you have a live app to deploy |

## How CI works

Every time you push code to GitHub:

```
You push code
  → GitHub spins up a fresh computer (blank slate, nothing installed)
  → Installs everything from scratch (Node.js, npm packages, browsers)
  → Runs ALL your tests
  → Reports: green checkmark (passed) or red X (failed)
```

**"From scratch" matters** — no leftover files, no cached state. If tests pass in CI, they'll pass for anyone.

## The workflow file (.github/workflows/playwright.yml)

| Step | What it does |
|---|---|
| `on: push / pull_request` | When to run — every push or PR to main |
| `runs-on: ubuntu-latest` | Where — a fresh Linux computer in the cloud |
| `actions/checkout` | Download your code onto that computer |
| `actions/setup-node` | Install Node.js |
| `npm ci` | Install packages (stricter than `npm install` — uses exact lock file versions) |
| `npx playwright install --with-deps` | Download browsers (Chromium, Firefox, WebKit) |
| `npx playwright test` | Run all tests |
| `upload-artifact` | Save the HTML report even if tests fail |

## npm ci vs npm install

- `npm install` — reads `package.json`, may update `package-lock.json`
- `npm ci` — reads `package-lock.json` only, installs exact versions, faster and stricter. Use in CI.

## Checking CI results

On GitHub: green checkmark or red X next to each commit.
From terminal: `gh run list --limit 5`
