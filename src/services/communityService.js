import api from './api'

export const communityService = {
  /**
   * 게시글 목록 조회
   * @param {string} boardCode - 게시판 코드 (FREE, REVIEW, TIP, TRADE, RECRUIT) - null이면 전체 조회
   * @param {number} cursorId - 커서 ID (페이지네이션)
   */
  async getPosts(boardCode = null, cursorId = null) {
    const params = {}

    // boardCode가 있으면 파라미터에 추가
    if (boardCode) {
      params.boardCode = boardCode
    }

    // cursorId가 있으면 파라미터에 추가
    if (cursorId) {
      params.cursorId = cursorId
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
   * @param {File[]} files - 이미지 파일 배열 (optional, 최대 3개)
   */
  async createPost({ title, content, boardCode }, files = []) {
    const formData = new FormData()

    // JSON 데이터를 Blob으로 변환하여 'post' 파트로 전송
    const postData = { title, content, boardCode }
    formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }))

    // 이미지 파일들을 'files' 파트로 전송
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file)
      })
    }

    const response = await api.post('/posts/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  /**
   * 게시글 수정
   * @param {number|string} id - 게시글 ID
   * @param {Object} postData
   * @param {string} postData.title - 제목
   * @param {string} postData.content - 내용
   * @param {string} postData.boardCode - 게시판 코드
   * @param {File[]} files - 이미지 파일 배열 (optional, 최대 3개)
   */
  async updatePost(id, { title, content, boardCode }, files = []) {
    const formData = new FormData()

    // JSON 데이터를 Blob으로 변환하여 'postUpdateRequest' 파트로 전송
    const postData = { title, content, boardCode }
    formData.append('postUpdateRequest', new Blob([JSON.stringify(postData)], { type: 'application/json' }))

    // 이미지 파일들을 'files' 파트로 전송
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file)
      })
    }

    const response = await api.patch(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
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
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
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
  },

  /**
   * 내가 작성한 게시글 조회
   * @param {string} boardCode - 게시판 코드 (FREE, REVIEW, TIP, TRADE, RECRUIT) - null이면 전체 조회
   * @param {number} cursorId - 커서 ID (페이지네이션)
   */
  async getMyPosts(boardCode = null, cursorId = null) {
    const params = {}

    // boardCode가 있으면 파라미터에 추가
    if (boardCode) {
      params.boardCode = boardCode
    }

    // cursorId가 있으면 파라미터에 추가
    if (cursorId) {
      params.cursorId = cursorId
    }

    const response = await api.get('/posts/my-posts', { params })
    return response.data
  }
}