# async/await

- **async** marks a function that contains slow operations (network requests, browser actions)
- **await** means "wait for this to finish before moving on"
- Without `await`, you get `Promise { <pending> }` instead of the actual result
- Rule 1: `await` means "wait for this to finish"
- Rule 2: You can only use `await` inside an `async` function

Every browser action is slow compared to normal code:
- Loading a page → network request
- Typing → simulating keystrokes
- Clicking → waiting for browser response
- Assertions → waiting for elements to appear

**Rule of thumb:** if a line talks to the browser, it needs `await`.
