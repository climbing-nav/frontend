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

  // Google OAuth 로그인 (CDN 방식)
  async googleLogin(credential) {
    const response = await api.post('/auth/google', {
      credential: credential
    })
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    
    return response.data
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