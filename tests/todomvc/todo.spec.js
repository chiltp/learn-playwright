const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('TodoMVC', () => {
    let todoPage;

    // Navigate to the TodoMVC app before each test
    test.beforeEach(async ({ page }) => {
        todoPage = new TodoPage(page);
        await todoPage.goto();
    });

    // --- Adding todos ---

    test('should add a todo item to the list', async ({ page }) => {
        await todoPage.addTodo("Buy groceries");
        await expect(todoPage.todoItems).toHaveCount(1);
        await expect(todoPage.todoItems.first()).toHaveText("Buy groceries");
    });

    test('should add multiple todo items to the list', async ({ page }) => {
        await todoPage.addTodo("Build my second playwright test");
        await todoPage.addTodo("Go for a walk");
        await todoPage.addTodo("Read a book");
        await expect(todoPage.todoItems).toHaveCount(3);
        await expect(todoPage.todoItems.nth(0)).toHaveText("Build my second playwright test");
        await expect(todoPage.todoItems.nth(1)).toHaveText("Go for a walk");
        await expect(todoPage.todoItems.nth(2)).toHaveText("Read a book");
    });

    // --- Completing and uncompleting todos ---

    test('should mark a todo as completed', async ({ page }) => {
        await todoPage.addTodo("Do some workout");
        await todoPage.todoCheckboxes.first().check();
        await expect(todoPage.todoCheckboxes.first()).toBeChecked();
    });

    test('should unmark a completed todo', async ({ page }) => {
        await todoPage.addTodo("Do some workout");
        await todoPage.todoCheckboxes.first().check();
        await todoPage.todoCheckboxes.first().uncheck();
        await expect(todoPage.todoCheckboxes.first()).not.toBeChecked();
    });

    // --- Deleting todos ---

    // Hover to reveal the delete button, then click it
    test('should delete a todo from the list', async ({ page }) => {
        await todoPage.addTodo("Do some workout");
        await todoPage.todoItems.first().hover();
        await todoPage.deleteButton.first().click();
        await expect(todoPage.todoItems).toHaveCount(0);
    });

    // --- Editing todos ---

    // Double-click to enter edit mode, change text, press Enter to save
    test('should edit a todo item', async ({ page }) => {
        await todoPage.addTodo("Do some workout");
        await todoPage.todoItems.first().dblclick();
        const editInput = todoPage.todoItems.first().getByRole('textbox');
        await editInput.fill("Do some workout at the gym");
        await editInput.press('Enter');
        await expect(todoPage.todoItems.first()).toHaveText("Do some workout at the gym");
    });

    // --- Filtering ---

    test('should filter todos by Active and Completed', async ({ page }) => {
        await todoPage.addTodo("Do some workout");
        await todoPage.addTodo("Go for a walk");
        await todoPage.todoCheckboxes.first().check();

        // Active filter: only uncompleted todos
        await todoPage.footerNavigation.getByRole('link', { name: 'Active' }).click();
        await expect(todoPage.todoItems).toHaveCount(1);
        await expect(todoPage.todoItems.first()).toHaveText("Go for a walk");

        // Completed filter: only completed todos
        await todoPage.footerNavigation.getByRole('link', { name: 'Completed' }).click();
        await expect(todoPage.todoItems).toHaveCount(1);
        await expect(todoPage.todoItems.first()).toHaveText("Do some workout");
    });

    test('should show all todos when clicking the All filter', async ({ page }) => {
        await todoPage.addTodo("Do some workout");
        await todoPage.addTodo("Go for a walk");
        await todoPage.todoCheckboxes.nth(1).check();
        await todoPage.footerNavigation.getByRole('link', { name: 'Active' }).click();
        await todoPage.footerNavigation.getByRole('link', { name: 'All' }).click();
        await expect(todoPage.todoItems).toHaveCount(2);
    });

    // --- Footer ---

    test('should show the correct item count', async ({ page }) => {
        await todoPage.addTodo("Do some workout");
        await todoPage.addTodo("Go for a walk");
        await expect(todoPage.footer.locator('.todo-count')).toHaveText("2 items left!");
    });

    // Clear completed removes checked todos from the list
    test('should remove completed todos when clicking Clear completed', async ({ page }) => {
        await todoPage.addTodo("Do some workout");
        await todoPage.todoCheckboxes.first().check();
        await todoPage.footer.getByRole('button', { name: 'Clear completed' }).click();
        await expect(todoPage.todoItems).toHaveCount(0);
    });

    // --- Persistence ---

    // This app does not persist todos to localStorage
    test('should not persist todos after page reload', async ({ page }) => {
        await todoPage.addTodo("Do some workout");
        await page.reload();
        await expect(todoPage.todoItems).toHaveCount(0);
    });
});
