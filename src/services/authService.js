import api from './api'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async logout() {
    const response = await api.post('/auth/logout')
    localStorage.removeItem('token')
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response.data
  },

  // Google OAuth 로그인 - JWT credential 방식
  async googleLogin(credentialData) {
    let payload

    // credential 데이터 타입에 따른 처리
    if (typeof credentialData === 'string') {
      // JWT credential 토큰인 경우
      payload = { credential: credentialData }
    } else if (credentialData.access_token) {
      // 액세스 토큰 + 사용자 정보인 경우
      payload = {
        access_token: credentialData.access_token,
        user_info: credentialData.user_info
      }
    } else {
      throw new Error('유효하지 않은 Google OAuth 데이터입니다.')
    }

    try {
      const response = await api.post('/auth/google', payload)
      
      // 토큰 저장
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        
        // Refresh token도 있다면 저장
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token)
        }
      }
      
      return response.data
    } catch (error) {
      // 토큰 저장소 정리 (에러 시)
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      throw error
    }
  },

  // Kakao 로그인 (CDN 방식)
  async kakaoLogin(authObj) {
    const response = await api.post('/auth/kakao', {
      access_token: authObj.access_token,
      refresh_token: authObj.refresh_token,
      id_token: authObj.id_token
    })
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    
    return response.data
  }
}