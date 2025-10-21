import api from './api'

// httpOnly 쿠키 기반 인증:
// - 모든 인증 API는 서버가 Set-Cookie 헤더로 응답
// - 클라이언트는 쿠키를 저장하지 않음 (브라우저가 자동 관리)
// - withCredentials: true로 모든 요청에 쿠키 자동 포함

export const authService = {
  // 일반 로그인 (이메일/비밀번호)
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    // 서버가 Set-Cookie로 ACCESS, REFRESH 쿠키 설정
    return response.data
  },

  // 회원가입
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    // 서버가 Set-Cookie로 쿠키 설정 (자동 로그인)
    return response.data
  },

  // 로그아웃
  async logout() {
    const response = await api.post('/auth/logout')
    // 서버가 쿠키 삭제 (Max-Age=0 또는 Expires=과거)
    return response.data
  },

  // 현재 사용자 정보 조회
  async getCurrentUser() {
    const response = await api.get('/auth/me')
    // httpOnly 쿠키가 자동으로 전송되어 서버가 인증 확인
    return response.data
  },

  // 토큰 갱신 (httpOnly 쿠키 방식)
  async refreshToken() {
    // httpOnly 쿠키의 REFRESH 토큰이 자동으로 전송됨
    const response = await api.post('/auth/refresh')
    // 서버가 새로운 ACCESS 쿠키 발급
    return response.data
  },

  // Google OAuth 로그인
  async googleLogin(credentialData) {
    let payload

    // credential 데이터 타입에 따른 처리
    if (typeof credentialData === 'string') {
      payload = { credential: credentialData }
    } else if (credentialData.access_token) {
      payload = {
        access_token: credentialData.access_token,
        user_info: credentialData.user_info
      }
    } else {
      throw new Error('유효하지 않은 Google OAuth 데이터입니다.')
    }

    const response = await api.post('/auth/google', payload)
    // 서버가 Set-Cookie로 쿠키 설정
    return response.data
  },

  // Kakao 로그인은 서버 사이드 플로우로 처리됨
  // 별도의 클라이언트 사이드 API 호출 불필요
}