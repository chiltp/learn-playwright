# Actions

| Action | What it does | Example |
|---|---|---|
| `fill()` | Type into a text input | `input.fill('hello')` |
| `click()` | Click an element | `button.click()` |
| `check()` | Check a checkbox | `checkbox.check()` |
| `uncheck()` | Uncheck a checkbox | `checkbox.uncheck()` |
| `selectOption()` | Pick from a `<select>` dropdown | `dropdown.selectOption('lohi')` |
| `press()` | Press a keyboard key | `input.press('Enter')` |
| `hover()` | Hover over an element | `item.hover()` |
| `dblclick()` | Double-click an element | `item.dblclick()` |
| `getAttribute()` | Read an HTML attribute | `img.getAttribute('src')` |

## Getting text from elements

| Method | Returns | Use case |
|---|---|---|
| `textContent()` | Single element's text | Reading one item |
| `allTextContents()` | Array of text from all matches | Reading all prices, all names |
