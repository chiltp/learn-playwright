# Locators

## Selector types

| Selector | Example | When to use |
|---|---|---|
| `data-test` attribute | `[data-test="username"]` | SauceDemo-style, most stable |
| `data-testid` attribute | `[data-testid="todo-item"]` | TodoMVC-style, same idea |
| Class selector | `.todo-count` | When no test ID exists |
| `getByRole()` | `getByRole('link', { name: 'Active' })` | Semantic, for elements without test IDs |

## Partial attribute selectors (CSS)

| Syntax | Meaning | Example |
|---|---|---|
| `^=` | Starts with | `[data-test^="add-to-cart"]` — matches all "Add to cart" buttons |
| `$=` | Ends with | `[data-test$="-img"]` — matches all product images |
| `*=` | Contains | `[data-test*="item"]` — matches anything with "item" in it |

## .first() vs .nth(i)

A locator like `todoPage.todoItems` matches **all** elements with that selector. For actions (click, hover, fill), you must specify which one:

| Method | What it does |
|---|---|
| `.first()` | First matching element |
| `.last()` | Last matching element |
| `.nth(i)` | Element at index i |

**When the list shifts** (e.g., "Add to cart" buttons become "Remove" after clicking): use `.first()` — it always grabs the front of the line.

**When the list is stable** (e.g., reading names on the cart page): use `.nth(i)` — positions are reliable.

## getByRole — HTML elements and their roles

| HTML Element | Implicit ARIA Role |
|---|---|
| `<input type="text">` | `textbox` |
| `<input type="checkbox">` | `checkbox` |
| `<button>` | `button` |
| `<a href="...">` | `link` |
| `<select>` | `combobox` |
| `<h1>` - `<h6>` | `heading` |

Use `getByRole('link', { name: 'Active' })` to find elements by what they *are*, not their CSS selector.
