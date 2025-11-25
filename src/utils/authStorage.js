// 인증 관련 로컬 스토리지 관리 유틸리티

const AUTH_TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_DATA_KEY = 'data'
const AUTH_PROVIDER_KEY = 'auth_provider' // google, kakao, email

// 서버 사이드 렌더링 환경 체크
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

export const authStorage = {
  // 토큰 관련
  getToken() {
    if (!isBrowser) return null
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    } catch (error) {
      console.error('토큰 조회 실패:', error)
      return null
    }
  },

  setToken(token) {
    if (!isBrowser) return
    try {
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY)
      }
    } catch (error) {
      console.error('토큰 저장 실패:', error)
    }
  },

  getRefreshToken() {
    if (!isBrowser) return null
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('Refresh 토큰 조회 실패:', error)
      return null
    }
  },

  setRefreshToken(refreshToken) {
    if (!isBrowser) return
    try {
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      }
    } catch (error) {
      console.error('Refresh 토큰 저장 실패:', error)
    }
  },

  // 사용자 데이터 관련
  getUserData() {
    if (!isBrowser) return null
    try {
      const userData = localStorage.getItem(USER_DATA_KEY)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('사용자 데이터 조회 실패:', error)
      return null
    }
  },

  setUserData(userData) {
    if (!isBrowser) return
    try {
      if (userData) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
      } else {
        localStorage.removeItem(USER_DATA_KEY)
      }
    } catch (error) {
      console.error('사용자 데이터 저장 실패:', error)
    }
  },

  // 인증 제공자 관련
  getAuthProvider() {
    if (!isBrowser) return null
    try {
      return localStorage.getItem(AUTH_PROVIDER_KEY)
    } catch (error) {
      console.error('인증 제공자 조회 실패:', error)
      return null
    }
  },

  setAuthProvider(provider) {
    if (!isBrowser) return
    try {
      if (provider) {
        localStorage.setItem(AUTH_PROVIDER_KEY, provider)
      } else {
        localStorage.removeItem(AUTH_PROVIDER_KEY)
      }
    } catch (error) {
      console.error('인증 제공자 저장 실패:', error)
    }
  },

  // 전체 인증 데이터 정리
  clearAuthData() {
    if (!isBrowser) return
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_DATA_KEY)
      localStorage.removeItem(AUTH_PROVIDER_KEY)
    } catch (error) {
      console.error('인증 데이터 정리 실패:', error)
    }
  },

  // 인증 상태 확인
  hasValidAuth() {
    if (!isBrowser) return false
    const token = this.getToken()
    const userData = this.getUserData()
    return !!(token && userData)
  },

  // 토큰 만료 확인 (JWT 토큰인 경우)
  isTokenExpired(token = null) {
    if (!isBrowser) return true
    const authToken = token || this.getToken()

    if (!authToken) return true

    try {
      // JWT 토큰인지 확인
      if (authToken.split('.').length !== 3) {
        return false // JWT가 아닌 경우 만료 확인 불가
      }

      const payload = JSON.parse(atob(authToken.split('.')[1]))
      const exp = payload.exp

      if (!exp) return false // 만료시간이 없으면 만료되지 않은 것으로 처리

      return Date.now() >= exp * 1000
    } catch (error) {
      console.error('토큰 만료 확인 실패:', error)
      return true // 확인 실패시 만료된 것으로 처리
    }
  }
}

export default authStorage