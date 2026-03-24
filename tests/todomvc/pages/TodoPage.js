// Page Object for the TodoMVC React app (https://todomvc.com/examples/react/dist/)
// Locators and reusable actions for todo CRUD operations, filtering, and footer

class TodoPage {
    constructor(page) {
        this.page = page;

        // Todo input and list
        this.newTodoInput = page.locator('[data-testid="text-input"]');
        this.todoItems = page.locator('[data-testid="todo-item"]');
        this.todoCheckboxes = page.locator('[data-testid="todo-item-toggle"]');
        this.deleteButton = page.locator('[data-testid="todo-item-button"]');

        // Footer (item count, filters, clear completed)
        this.footer = page.locator('[data-testid="footer"]');
        this.footerNavigation = page.locator('[data-testid="footer-navigation"]');
    }

    // Navigate to the TodoMVC React app
    async goto() {
        await this.page.goto('https://todomvc.com/examples/react/dist/');
    }

    // Type a new todo and press Enter to add it
    async addTodo(text) {
        await this.newTodoInput.fill(text);
        await this.newTodoInput.press('Enter');
    }
}

module.exports = { TodoPage };
