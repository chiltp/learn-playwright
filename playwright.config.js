// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    // SauceDemo tests
    {
      name: 'saucedemo',
      testDir: './tests/saucedemo',
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['Desktop Chrome'],
      },
    },
    // TodoMVC tests
    {
      name: 'todomvc',
      testDir: './tests/todomvc',
      use: {
        baseURL: 'https://todomvc.com/examples/react/dist/',
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
