import axios from 'axios'
import { getAccessToken, getRefreshToken, clearAuthCookies } from '../utils/cookieUtils'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://52.78.220.103:8080',
  timeout: 10000,
  withCredentials: true, // REFRESH 쿠키 전송을 위해 필요
})

// 토큰 갱신 중인지 추적하는 플래그
let isRefreshing = false
// 토큰 갱신 대기 중인 요청들
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// 요청 인터셉터: 쿠키에서 ACCESS 토큰을 읽어 Authorization 헤더에 추가
api.interceptors.request.use(
  (config) => {
    // 1. 쿠키에서 ACCESS 토큰 가져오기 (OAuth 로그인 후)
    const cookieToken = getAccessToken()

    // 2. localStorage에서 토큰 가져오기 (이메일 로그인 fallback)
    const localToken = localStorage.getItem('token')

    // 3. 우선순위: 쿠키 > localStorage
    const token = cookieToken || localToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 401 에러 시 토큰 갱신 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 토큰 갱신 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      // REFRESH 토큰 확인
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        // REFRESH 토큰이 없으면 로그아웃 처리
        isRefreshing = false
        clearAuthCookies()
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/'
        return Promise.reject(error)
      }

      try {
        // 토큰 갱신 요청
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://52.78.220.103:8080'}/api/token/refresh`,
          {},
          {
            withCredentials: true // REFRESH 쿠키 전송
          }
        )

        // 갱신된 ACCESS 토큰은 쿠키로 자동 설정됨
        const newAccessToken = getAccessToken()

        if (newAccessToken) {
          // 대기 중인 요청들 처리
          processQueue(null, newAccessToken)

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        } else {
          throw new Error('토큰 갱신 실패')
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        processQueue(refreshError, null)
        clearAuthCookies()
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
