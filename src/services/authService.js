import api from './api'
import axios from 'axios'
import { clearAuthCookies } from '../utils/cookieUtils'

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

    // localStorage와 쿠키 모두 정리
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    clearAuthCookies()

    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/user/me')
    return response.data
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('Refresh token이 없습니다.')
    }

    try {
      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken
      })
      
      // 새로운 토큰 저장
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token)
        }
      }
      
      return response.data
    } catch (error) {
      // Refresh 실패시 토큰 정리
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      throw error
    }
  },

  // Google OAuth 로그인 - 서버 사이드 플로우
  // 쿠키 기반 인증 사용 - 서버가 HttpOnly 쿠키로 토큰 관리
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

      // 쿠키 기반 인증 - localStorage 저장 불필요
      // 서버가 HttpOnly 쿠키로 토큰을 자동 설정

      return response.data
    } catch (error) {
      throw error
    }
  },

  // Kakao OAuth 콜백 처리 - 프론트엔드 주도 플로우
  async kakaoLogin(code) {
    try {
      // /api prefix 없이 도메인으로 직접 요청 (백엔드 엔드포인트가 /auth/kakao/exchange)
      const baseURL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || window.location.origin

      const response = await axios.post(`${baseURL}/auth/kakao/exchange`, { code }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // 응답에서 토큰 추출 및 저장
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token)
        }
      }

      return response.data
    } catch (error) {
      console.error('카카오 로그인 처리 실패:', error)
      throw error
    }
  }
}