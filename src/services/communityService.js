import api from './api'

export const communityService = {
  async getPosts(page = 1, limit = 10) {
    const response = await api.get('/posts', {
      params: { page, limit }
    })
    return response.data
  },

  async getPostById(id) {
    const response = await api.get(`/posts/${id}`)
    return response.data
  },

  async createPost(postData) {
    const response = await api.post('/posts', postData)
    return response.data
  },

  async updatePost(id, postData) {
    const response = await api.put(`/posts/${id}`, postData)
    return response.data
  },

  async deletePost(id) {
    const response = await api.delete(`/posts/${id}`)
    return response.data
  },

  async getComments(postId) {
    const response = await api.get(`/posts/${postId}/comments`)
    return response.data
  },

  async createComment(postId, commentData) {
    const response = await api.post(`/posts/${postId}/comments`, commentData)
    return response.data
  },

  async deleteComment(postId, commentId) {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`)
    return response.data
  }
}