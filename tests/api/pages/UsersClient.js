class UsersClient {
    constructor(request) {
        this.request = request;
    }

    // Helper method to make request.get() calls for users
    async getUser(id) {
        return await this.request.get(`/users/${id}`);
    }

    // Helper method to make request.get() calls for all users
    async getAllUsers() {
        return await this.request.get('/users');
    }
}

module.exports = { UsersClient };