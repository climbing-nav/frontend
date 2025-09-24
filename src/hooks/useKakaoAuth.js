import { useCallback } from 'react'

export const useKakaoAuth = () => {
  // 서버 사이드 OAuth 플로우를 위한 간단한 리다이렉트 함수
  const signInWithKakao = useCallback(() => {
    try {
      // 백엔드의 카카오 OAuth 시작 엔드포인트로 리다이렉트
      const backendUrl = import.meta.env.VITE_API_URL || 'http://13.125.229.39:8080'
      window.location.href = `${backendUrl}/auth/kakao/login`
    } catch (error) {
      console.error('카카오 로그인 리다이렉트 실패:', error)
      throw new Error('카카오 로그인을 시작할 수 없습니다.')
    }
  }, [])

  const signOutWithKakao = useCallback(() => {
    // 서버 사이드에서 로그아웃 처리
    // 필요시 백엔드 로그아웃 엔드포인트 호출
    console.log('카카오 로그아웃은 서버에서 처리됩니다.')
  }, [])

  return {
    signInWithKakao,
    signOutWithKakao,
    // 서버 사이드 플로우에서는 항상 준비 상태
    isKakaoScriptLoaded: true,
    scriptLoadError: null,
    isInitialized: true
  }
}