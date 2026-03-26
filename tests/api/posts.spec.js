const { test, expect } = require("@playwright/test");
const { ApiClient } = require("./ApiClient");

// API Testing Cheat Sheet (bakery analogy):
//
//   You (test)  →  Counter (API endpoint)  →  Kitchen (server)  →  Counter  →  You
//
//   request.get('/posts')     = "What's on the menu?"          → 200 OK + data
//   request.post('/posts')    = "I'd like to place an order"   → 201 Created + new item
//   request.put('/posts/1')   = "Change order #1"              → 200 OK + updated item
//   request.delete('/posts/1') = "Cancel order #1"             → 200 OK
//
//   response              = the receipt sitting on the counter (status, headers, raw body)
//   await response.json() = you picking up the receipt and reading it (parsed data)

test.describe('Posts API', () => {
    let apiClient;

    // Initialize the API client before all tests
    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
    });

    // GET single — fetch one post by ID
    test('should fetch a single post by ID', async () => {
        const response = await apiClient.getPost(1);
        const post = await response.json();

        expect(response.status()).toBe(200);
        expect(post).toHaveProperty('id', 1);
        expect(post).toHaveProperty('title');
    });

    // GET all — fetch the entire list
    test('should retrieve a list of posts', async () => {
        const response = await apiClient.getAllPosts();
        const posts = await response.json();

        expect(response.status()).toBe(200);
        expect(posts).toHaveLength(100);
    });

    // POST — create a new post by sending a JSON body
    test('should create a new post', async () => {
        const newPost = {
            title: "My new post",
            body: "This is the content.",
            userId: 1
        };
        const response = await apiClient.createPost(newPost);
        const createdPost = await response.json();

        expect(response.status()).toBe(201);
        expect(createdPost).toHaveProperty('id');
        expect(createdPost).toMatchObject(newPost);
    });

    // PUT — update an existing post by ID
    test('should update an existing post', async () => {
        const updatedPost = {
            title: "Updated title",
            body: "This is the updated content.",
            userId: 1
        };

        const response = await apiClient.updatePost(1, updatedPost);
        const post = await response.json();

        expect(response.status()).toBe(200);
        expect(post).toHaveProperty('id', 1);
        expect(post).toMatchObject(updatedPost);
    });

    // DELETE — remove a post by ID (no body needed)
    test('should delete a post', async () => {
        const response = await apiClient.deletePost(1);
        expect(response.status()).toBe(200);
    });

    // GET with query — fetch posts by a specific user
    test('should fetch only user 1s posts', async ({ request }) => {
        const response = await request.get('/posts', {
            params: { userId: 1 }
        });
        const posts = await response.json();

        for (const post of posts) {
            expect(post).toHaveProperty('userId', 1);
        }
    });

    // Negative test — request a resource that doesn't exist
    test('should return 404 for non-existent post', async () => {
        const response = await apiClient.getPost(9999);
        expect(response.status()).toBe(404);
    });
});
