import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://52.78.220.103:8080',
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

// httpOnly 쿠키 사용 시:
// - 쿠키는 브라우저가 자동으로 모든 요청에 포함 (withCredentials: true 필요)
// - JavaScript에서 document.cookie로 접근 불가 (XSS 공격 방어)
// - 인증 상태는 서버 API(/api/auth/me 등)로 확인

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // httpOnly 쿠키는 JavaScript로 확인할 수 없음
      // 401 응답은 서버가 쿠키를 확인한 결과임

      // localStorage 토큰 정리 (레거시 지원)
      const hasLocalToken = localStorage.getItem('token')
      if (hasLocalToken) {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
      }

      // 인증이 필요한 페이지에서 401 발생 시 로그인 페이지로 리다이렉트
      // (이미 로그인/인증 페이지에 있으면 리다이렉트하지 않음)
      if (!window.location.pathname.includes('/auth') && !window.location.pathname.includes('/login')) {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api