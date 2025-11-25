import { useCallback } from 'react'

export const useGoogleAuth = () => {
  // 프론트엔드에서 직접 구글 OAuth URL 생성 및 리다이렉트
  const signInWithGoogle = useCallback(() => {
    try {
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
      const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`

      if (!GOOGLE_CLIENT_ID) {
        throw new Error('구글 Client ID가 설정되지 않았습니다.')
      }

      // 구글 OAuth URL 생성
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid%20email%20profile`

      // 구글 로그인 페이지로 리다이렉트
      window.location.href = googleAuthUrl
    } catch (error) {
      console.error('구글 로그인 시작 실패:', error)
      throw new Error('구글 로그인을 시작할 수 없습니다.')
    }
  }, [])

  const signOutWithGoogle = useCallback(() => {
    // 로컬 ACCESS 토큰 제거 (실제 로그아웃은 authService에서 처리, REFRESH 토큰은 HttpOnly 쿠키)
    localStorage.removeItem('token')
  }, [])

  return {
    signInWithGoogle,
    signOutWithGoogle,
    // 프론트엔드 주도 플로우에서는 항상 준비 상태
    isGoogleScriptLoaded: true,
    scriptLoadError: null,
    isInitialized: true
  }
}