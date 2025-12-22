import axios from 'axios'
import { clearAuthCookies } from '../utils/cookieUtils'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

// 요청 인터셉터: localStorage에서 ACCESS 토큰을 읽어 Authorization 헤더에 추가
api.interceptors.request.use(
  (config) => {
    // localStorage에서 ACCESS 토큰 가져오기
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

// 응답 인터셉터: 401 에러 시 토큰 갱신 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 403 && !originalRequest._retry) {
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

      try {
        // HttpOnly 쿠키는 JavaScript로 읽을 수 없으므로 바로 토큰 갱신 요청
        // 브라우저가 자동으로 REFRESH 쿠키를 전송함
        // 백엔드가 쿠키 없거나 만료되었으면 401 에러 반환
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://52.78.220.103:8080/api'}/token/refresh`,
          {},
          {
            withCredentials: true // REFRESH 쿠키 자동 전송
          }
        )

        // 응답에서 새 ACCESS 토큰 추출하여 localStorage에 저장
        const newAccessToken = response.data?.token

        if (newAccessToken) {
          localStorage.setItem('token', newAccessToken)

          // 대기 중인 요청들 처리
          processQueue(null, newAccessToken)

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        } else {
          throw new Error('토큰 갱신 실패: 새 토큰을 받지 못했습니다')
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        processQueue(refreshError, null)
        clearAuthCookies()
        localStorage.removeItem('token')
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
