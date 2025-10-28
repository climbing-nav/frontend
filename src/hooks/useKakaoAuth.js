import { useCallback } from 'react'
import api from '../services/api'

export const useKakaoAuth = () => {
  // 백엔드 카카오 OAuth 시작 후 redirect URL 응답받기
  const signInWithKakao = useCallback(async () => {
    try {
      // 백엔드의 카카오 OAuth 시작 엔드포인트 호출
      const response = await api.get('/auth/kakao/login')

      // 백엔드에서 반환된 redirect URL로 이동
      if (response.data && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl
      } else {
        throw new Error('Redirect URL을 받지 못했습니다.')
      }
    } catch (error) {
      console.error('카카오 로그인 시작 실패:', error)
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