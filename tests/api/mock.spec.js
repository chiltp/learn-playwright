const { test, expect } = require('@playwright/test');

// Instead of fetching real posts from the server (the bakery's actual menu),
// we intercept the request and serve our own fake data (a custom pastry order).
// This lets us test predictably without depending on what the real API returns.
test.describe('Mocking API Responses', () => {
    test.beforeEach(async ({ page }) => {
        // page.route() sets up an intercept: "whenever a request matches this URL pattern,
        // don't let it reach the real server — handle it ourselves."
        // Think of it as standing at the bakery door and handing customers a fake menu
        // before they even step inside.
        await page.route('**/posts', route => {
            // route.fulfill() is our fake response — we're playing the role of the server.
            // We control exactly what gets returned, like a test kitchen writing its own receipt.
            route.fulfill({
                status: 200,                        // "Everything's fine, here's your order!"
                contentType: 'application/json',    // Tell the browser to expect JSON, not HTML
                body: JSON.stringify({
                    id: 1,
                    title: "Pain au chocolat",
                    body: "A delicious pastry filled with chocolate.",
                    userId: 1
                }),
            });
        });
        // Navigate to the page AFTER setting up the route intercept.
        // If you did this first, the real request might fire before the mock is ready.
        await page.goto('https://jsonplaceholder.typicode.com/posts');
    });

    // Verify the mocked data actually appears on the page.
    // If this passes, we know the intercept worked — the browser rendered our fake pastry, not the real menu.
    test('should display the mocked post title and body', async ({ page }) => {
        await expect(page.locator('body')).toContainText('Pain au chocolat');
        await expect(page.locator('body')).toContainText('A delicious pastry filled with chocolate.');
    });

    // This test overrides the beforeEach route with a 500 response.
    // Instead of serving a fresh pastry, the kitchen sends back a disaster ticket —
    // we want to verify the app handles a server error gracefully.
    test('should display error message when server returns 500', async ({ page }) => {
        // Registering a new route here overrides the 200 mock from beforeEach for this test only.
        // Playwright matches routes most-recently-registered first — our 500 mock jumps the queue.
        await page.route('**/posts', route => {
            route.fulfill({
                status: 500,                        // "The oven exploded. No orders today."
                contentType: 'application/json',
                body: JSON.stringify({ error: "The croissant oven exploded." }),
            });
        });

        // Reload to re-trigger the request — beforeEach already navigated, so we need a fresh trip.
        await page.reload();

        // Confirm the error body we controlled is what actually appears on the page.
        await expect(page.locator('body')).toContainText('The croissant oven exploded.');
    });

});