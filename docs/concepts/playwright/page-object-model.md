# Page Object Model (POM)

**Problem:** Selectors like `[data-test="username"]` are repeated everywhere. If one changes, you'd have to update every test.

**Solution:** Put all selectors and actions in a class — like hiring a waiter who knows the kitchen layout, so your tests just say what they want.

## The Pattern

Every page object follows the same structure:

```
1. Constructor receives a Playwright object (page or request)
2. Store it as this.page or this.request
3. Define locators or endpoints
4. Create methods that wrap common actions
5. Export the class
```

### UI Page Object (browser testing)

```js
class LoginPage {
    constructor(page) {
        this.page = page;                                          // Store the browser tab
        this.usernameInput = page.locator('[data-test="username"]'); // Define locators
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
    }

    async goto() {
        await this.page.goto('/');                                 // Wrap navigation
    }

    async login(username, password) {
        await this.usernameInput.fill(username);                   // Wrap actions
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

module.exports = { LoginPage };
```

### API Page Object (API testing)

```js
class ApiClient {
    constructor(request) {
        this.request = request;                                    // Store the HTTP client
    }

    async getPost(id) {
        return await this.request.get(`/posts/${id}`);             // Wrap GET request
    }

    async createPost(data) {
        return await this.request.post('/posts', { data });        // Wrap POST request
    }
}

module.exports = { ApiClient };
```

### Side-by-side comparison

| | UI Page Object | API Page Object |
|---|---|---|
| Constructor receives | `page` (browser tab) | `request` (HTTP client) |
| Stores it as | `this.page` | `this.request` |
| Methods wrap | Browser actions (fill, click) | HTTP requests (get, post) |
| Hides | Selectors (`[data-test="..."]`) | URLs (`/posts/1`) |
| Test reads like | `loginPage.login('user', 'pass')` | `apiClient.createPost(data)` |

## Why Use POM?

Without page objects — every test knows the kitchen layout:
```js
// If URL changes from /posts to /articles, update EVERY test
await request.get('/posts/1');
await request.post('/posts', { data: newPost });
```

With page objects — tests talk to the waiter:
```js
// URL changes? Update ONE file (ApiClient.js). Tests stay the same.
await apiClient.getPost(1);
await apiClient.createPost(newPost);
```

**Benefits:**
- Selectors/URLs defined once — change in one place
- Tests become readable — say *what* not *how*
- Reusable actions across multiple test files

## Usage in Tests

```js
let loginPage;
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
});
```
