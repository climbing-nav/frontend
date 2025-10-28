import { useCallback } from 'react'

export const useKakaoAuth = () => {
  // 프론트엔드에서 직접 카카오 OAuth URL 생성 및 리다이렉트
  const signInWithKakao = useCallback(() => {
    try {
      const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY
      const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/auth/kakao/callback`

      if (!KAKAO_REST_API_KEY) {
        throw new Error('카카오 REST API 키가 설정되지 않았습니다.')
      }

      // 카카오 OAuth URL 생성
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`

      // 카카오 로그인 페이지로 리다이렉트
      window.location.href = kakaoAuthUrl
    } catch (error) {
      console.error('카카오 로그인 시작 실패:', error)
      throw new Error('카카오 로그인을 시작할 수 없습니다.')
    }
  }, [])

  const signOutWithKakao = useCallback(() => {
    // 로컬 토큰 제거 (실제 로그아웃은 authService에서 처리)
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
  }, [])

  return {
    signInWithKakao,
    signOutWithKakao,
    // 프론트엔드 주도 플로우에서는 항상 준비 상태
    isKakaoScriptLoaded: true,
    scriptLoadError: null,
    isInitialized: true
  }
}