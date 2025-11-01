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

  // Google OAuth 콜백 처리 - 프론트엔드 주도 플로우
  async googleLogin(code, redirectUri) {
    try {
      // /api prefix 없이 도메인으로 직접 요청 (백엔드 엔드포인트가 /auth/google/exchange)
      const baseURL = import.meta.env.VITE_API_URL || window.location.origin

      // code와 redirectUri를 함께 전송 (구글 OAuth 스펙 요구사항)
      const response = await axios.post(`${baseURL}/auth/google/exchange`, {
        code,
        redirectUri
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // 응답 헤더에서 Authorization 토큰 추출
      const authHeader = response.headers['authorization'] || response.headers['Authorization']
      let token = null

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7) // "Bearer " 제거
      }

      // response.data와 함께 token 반환
      return {
        ...response.data,
        token
      }
    } catch (error) {
      console.error('구글 로그인 처리 실패:', error)
      throw error
    }
  },

  // Kakao OAuth 콜백 처리 - 프론트엔드 주도 플로우
  async kakaoLogin(code, redirectUri) {
    try {
      // /api prefix 없이 도메인으로 직접 요청 (백엔드 엔드포인트가 /auth/kakao/exchange)
      const baseURL = import.meta.env.VITE_API_URL || window.location.origin

      // code와 redirectUri를 함께 전송 (카카오 OAuth 스펙 요구사항)
      const response = await axios.post(`${baseURL}/auth/kakao/exchange`, {
        code,
        redirectUri
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // 응답 헤더에서 Authorization 토큰 추출
      const authHeader = response.headers['authorization'] || response.headers['Authorization']
      let token = null

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7) // "Bearer " 제거
      }

      // response.data와 함께 token 반환
      return {
        ...response.data,
        token
      }
    } catch (error) {
      console.error('카카오 로그인 처리 실패:', error)
      throw error
    }
  }
}