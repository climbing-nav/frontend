import api from './api'

export const communityService = {
  /**
   * 게시글 목록 조회 (TODO: 백엔드 API 확인 필요)
   */
  async getPosts(page = 1, limit = 10) {
    const response = await api.get('/posts', {
      params: { page, limit }
    })
    return response.data
  },

  /**
   * 게시글 조회
   * @param {number|string} postId - 게시글 ID
   */
  async getPostById(postId) {
    const response = await api.get(`/api/posts/${postId}`)
    return response.data
  },

  /**
   * 게시글 생성
   * @param {Object} postData
   * @param {string} postData.title - 제목
   * @param {string} postData.content - 내용
   * @param {string} postData.boardCode - 게시판 코드 (FREE, REVIEW, TIP, TRADE, RECRUIT)
   */
  async createPost({ title, content, boardCode }) {
    const response = await api.post('/api/posts/save', {
      title,
      content,
      boardCode
    })
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