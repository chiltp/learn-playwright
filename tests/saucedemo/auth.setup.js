// require('fs') imports Node's built-in file system module — no ./ needed because
// Node checks built-in modules first, then node_modules, then your own files (./something)
const fs = require('fs');

// { test: setup } is destructuring with renaming.
// Playwright exports a function called 'test' — we rename it 'setup' locally
// so it's clear this file sets up state, not runs a real test.
const { test: setup } = require('@playwright/test');

// Create the folder before setup() tries to write user.json into it.
// { recursive: true } = create parent folders if missing, no error if already exists.
fs.mkdirSync('playwright/.auth', { recursive: true });

setup('save login session', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/inventory/);

    // Save storage state into the file.
    await page.context().storageState({ path: 'playwright/.auth/user.json' });
});