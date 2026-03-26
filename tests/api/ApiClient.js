class ApiClient {
    constructor(request) {
        this.request = request;
    }

    // Helper method to make request.get() calls
    async getPost(id) {
        return await this.request.get(`/posts/${id}`);
    }

    //Helper method to make request.get() calls for all posts
    async getAllPosts() {
        return await this.request.get('/posts');
    }

    // Helper method to make request.post() calls
    async createPost(postData) {
        return await this.request.post('/posts', {
            data: postData
        });
    }

    // Helper method to make request.put() calls
    async updatePost(id, postData) {
        return await this.request.put(`/posts/${id}`, {
            data: postData
        });
    }

    // Helper method to make request.delete() calls
    async deletePost(id) {
        return await this.request.delete(`/posts/${id}`);
    }
}

module.exports = { ApiClient };