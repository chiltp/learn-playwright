# npm

**npm** = Node Package Manager. A tool that downloads and manages code packages (dependencies) so you don't write everything from scratch.

## Key commands

| Command | What it does |
|---|---|
| `npm install` | Download all dependencies listed in package.json |
| `npm test` | Run the "test" script from package.json |
| `npm run <script>` | Run any custom script from package.json |
| `npx <command>` | Run a package's CLI tool directly |

## npm vs npx

- `npm` = install and manage packages
- `npx` = run a package's command (e.g., `npx playwright test`)

## package.json vs package-lock.json

| | `package.json` | `package-lock.json` |
|---|---|---|
| Who writes it | You | npm (auto-generated) |
| Version style | Flexible (`^1.58.2` = 1.58.2+) | Exact (`1.58.2`) |
| Purpose | "What I need" | "Exactly what I installed" |
| Edit manually? | Yes | Never |

The lock file ensures everyone on the team installs the exact same versions.

## npm run vs npx

`npm run test:saucedemo` and `npx playwright test --project=saucedemo` do the same thing. The npm script is a shortcut defined in `package.json`. Use `npx` directly when you need extra flags like `--headed` or `--debug`.
