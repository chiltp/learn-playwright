const { test, expect } = require('@playwright/test');
const { UsersClient } = require('./pages/UsersClient');

// API Testing Cheat Sheet (bakery analogy):
//
//   You (test)  →  Counter (API endpoint)  →  Kitchen (server)  →  Counter  →  You
//
//   request.get('/users')     = "What's on the menu?"          → 200 OK + data
//   request.post('/users')    = "I'd like to place an order"   → 201 Created + new item
//   request.put('/users/1')   = "Change order #1"              → 200 OK + updated item
//   request.delete('/users/1') = "Cancel order #1"             → 200 OK
//
//   response              = the receipt sitting on the counter (status, headers, raw body)
//   await response.json() = you picking up the receipt and reading it (parsed data)

test.describe('Users API', () => {
    let usersClient;

    //Initialize the API client before all tests
    test.beforeEach(async ( { request }) => {
        usersClient = new UsersClient(request);
    });

    // GET single - fetch one user by ID
    test('should fetch a single user by ID', async () => {
        const response = await usersClient.getUser(1);
        const user = await response.json();

        expect(response.status()).toBe(200);
        expect(user).toHaveProperty('id', 1);
        expect(user).toHaveProperty('name');
    });

    // GET all - fetch the entire list of users
    test('should retrieve a list of users', async () => {
        const response = await usersClient.getAllUsers();
        const users = await response.json();

        expect(response.status()).toBe(200);
        expect(users).toHaveLength(10);
    });

    // Negative test - request a resource that doesn't exist
    test('should return 404 for non-existent user', async () => {
        const response = await usersClient.getUser(9999);
        expect(response.status()).toBe(404);
    });
});