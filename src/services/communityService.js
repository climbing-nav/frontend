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
    console.log('📋 getPostById 전체 응답:', response)
    console.log('📋 response.data:', response.data)
    console.log('📋 response.data.data:', response.data?.data)
    console.log('📋 댓글 목록:', response.data?.data?.comments || response.data?.comments)
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

  /**
   * 댓글 작성
   * @param {Object} commentData
   * @param {number|string} commentData.postId - 게시글 ID
   * @param {string} commentData.author - 작성자
   * @param {string} commentData.content - 댓글 내용
   */
  async createComment({ postId, author, content }) {
    const response = await api.post('/comments/save', {
      postId,
      author,
      content
    })
    return response.data
  },

  /**
   * 댓글 삭제
   * @param {number|string} commentId - 댓글 ID
   */
  async deleteComment(commentId) {
    console.log('🌐 API 호출: DELETE /comments/' + commentId)
    try {
      const response = await api.delete(`/comments/${commentId}`)
      console.log('✅ API 응답 성공:', response)
      return response.data
    } catch (error) {
      console.error('❌ API 호출 실패:', error)
      console.error('❌ error.response:', error.response)
      console.error('❌ URL:', `/comments/${commentId}`)
      throw error
    }
  },

  /**
   * 게시글 좋아요
   * @param {number|string} postId - 게시글 ID
   */
  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like`)
    return response.data
  },

  /**
   * 게시글 좋아요 취소
   * @param {number|string} postId - 게시글 ID
   */
  async unlikePost(postId) {
    const response = await api.delete(`/posts/${postId}/like`)
    return response.data
  }
}