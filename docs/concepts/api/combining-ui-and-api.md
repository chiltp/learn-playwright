# Combining UI + API Testing

The most powerful pattern — use API calls to set up data fast, then verify with the browser.

## The Concept

- **Before:** Walk into the bakery, manually place an order at the counter, then check the display case
- **After:** Call ahead and place your order by phone (API), then walk in and check the display case (UI)

API setup is faster and more reliable than clicking through UI steps.

## The Pattern

Use `{ page, request }` in one test — API for setup, browser for verification:

```js
test('should show the new post on the page', async ({ page, request }) => {
    // Use API to create test data (phone order — fast, reliable)
    const response = await request.post('/api/posts', {
        data: { title: 'My Post', body: 'Content' }
    });
    const post = await response.json();

    // Use browser to verify data appears in UI (walk in and check)
    await page.goto(`/posts/${post.id}`);
    await expect(page.locator('.post-title')).toHaveText('My Post');
});
```

## Authentication Shortcut

Skip the login form by getting a token via API:

```js
test.beforeEach(async ({ page, request }) => {
    // Login via API — fast, no UI clicks
    const response = await request.post('/api/login', {
        data: { username: 'user', password: 'pass' }
    });
    const { token } = await response.json();

    // Set the token so the browser is "logged in"
    await page.setExtraHTTPHeaders({ Authorization: `Bearer ${token}` });
});

test('should see dashboard', async ({ page }) => {
    // No login needed — go straight to the page
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toHaveText('Welcome');
});
```

## When to Use What

| Situation | Use | Why |
|---|---|---|
| Setting up test data | API | Faster, more reliable |
| Verifying user sees correct data | UI | That's what users see |
| Cleaning up after tests | API | Fast bulk delete |
| Testing the login flow itself | UI | That's what you're testing |
| Skipping login for other tests | API | Get a token, skip the form |

## Key Takeaway

- **API for speed** — setup and cleanup
- **UI for truth** — verify what the user actually sees
- **Both in one test** — `{ page, request }` gives you both tools
