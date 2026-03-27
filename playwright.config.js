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
      name: 'saucedemo-chromium',
      testDir: './tests/saucedemo',
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['Desktop Chrome'],
      },
    },
    // SauceDemo tests
    {
      name: 'saucedemo-firefox',
      testDir: './tests/saucedemo',
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['Desktop Firefox'],
      },
    },
     // SauceDemo tests
    {
      name: 'saucedemo-webkit',
      testDir: './tests/saucedemo',
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['Desktop Safari'],
      },
    },
    // TodoMVC tests
    {
      name: 'todomvc-chromium',
      testDir: './tests/todomvc',
      use: {
        baseURL: 'https://todomvc.com/examples/react/dist/',
        ...devices['Desktop Chrome'],
      },
    },
    // TodoMVC tests
    {
      name: 'todomvc-firefox',
      testDir: './tests/todomvc',
      use: {
        baseURL: 'https://todomvc.com/examples/react/dist/',
        ...devices['Desktop Firefox'],
      },
    },
     // TodoMVC tests
    {
      name: 'todomvc-webkit',
      testDir: './tests/todomvc',
      use: {
        baseURL: 'https://todomvc.com/examples/react/dist/',
        ...devices['Desktop Safari'],
      },
    },
    // API tests
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },
  ],
});
