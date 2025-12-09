import api from './api'

export const communityService = {
  /**
   * 게시글 목록 조회
   * @param {string} boardCode - 게시판 코드 (FREE, REVIEW, TIP, TRADE, RECRUIT) - null이면 전체 조회
   */
  async getPosts(boardCode = null) {
    const params = {}

    // boardCode가 있으면 파라미터에 추가
    if (boardCode) {
      params.boardCode = boardCode
    }

    const response = await api.get('/posts', { params })
    return response.data
  },

  /**
   * 게시글 조회
   * @param {number|string} postId - 게시글 ID
   */
  async getPostById(postId) {
    const response = await api.get(`/posts/${postId}`)
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
    const response = await api.post('/posts/save', {
      title,
      content,
      boardCode
    })
    return response.data
  },

  async updatePost(id, postData) {
    const response = await api.patch(`/posts/${id}`, postData)
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