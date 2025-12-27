import api from './api'

export const userService = {
  /**
   * 사용자 작성 게시글 개수 조회
   */
  async getPostCount() {
    const response = await api.get('/user/post/count')
    return response.data
  }
}
