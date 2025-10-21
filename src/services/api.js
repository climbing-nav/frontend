import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://13.125.229.39:8080',
  timeout: 10000,
  withCredentials: true, // 쿠키를 자동으로 포함
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 쿠키에서 특정 값을 읽는 유틸리티 함수
const getCookieValue = (name) => {
  if (typeof document === 'undefined') return null
  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  } catch (error) {
    return null
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 쿠키 기반 인증을 확인
      const accessCookie = getCookieValue('ACCESS')

      // 쿠키가 없고, localStorage에 토큰이 있는 경우에만 정리
      // 쿠키가 있으면 백엔드가 쿠키 기반 인증을 사용 중이므로 리다이렉트하지 않음
      if (!accessCookie) {
        const hasLocalToken = localStorage.getItem('token')
        if (hasLocalToken) {
          localStorage.removeItem('token')
          localStorage.removeItem('refresh_token')
        }
        // 쿠키도 없고 토큰도 없으면 로그인 페이지로 리다이렉트
        // (이미 로그인 페이지에 있으면 리다이렉트하지 않음)
        if (!window.location.pathname.includes('/auth') && !window.location.pathname.includes('/login')) {
          window.location.href = '/'
        }
      }
      // 쿠키가 있는 경우: 에러만 반환하고 리다이렉트하지 않음
      // Redux가 알아서 인증 상태를 관리함
    }
    return Promise.reject(error)
  }
)

export default api