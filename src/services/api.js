import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://52.78.220.103:8080',
  timeout: 10000,
  withCredentials: true, // 쿠키를 자동으로 포함
})

// httpOnly 쿠키 사용 시 Authorization 헤더 불필요
// 쿠키가 자동으로 모든 요청에 포함됨 (withCredentials: true)
api.interceptors.request.use(
  (config) => {
    // httpOnly 쿠키 기반 인증에서는 별도의 헤더 설정 불필요
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
      // 401 응답은 서버가 쿠키를 확인하고 인증 실패를 반환한 것

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