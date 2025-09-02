import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { googleLoginAsync } from '../store/slices/authSlice'

// Google OAuth 관련 상수
const GOOGLE_SCRIPT_LOAD_TIMEOUT = 10000 // 10초
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export const useGoogleAuth = () => {
  const dispatch = useDispatch()
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false)
  const [scriptLoadError, setScriptLoadError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Google OAuth 초기화 함수
  const initializeGoogleAuth = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('Google Client ID가 설정되지 않았습니다. .env 파일을 확인하세요.')
      setScriptLoadError('Google Client ID가 설정되지 않았습니다.')
      return false
    }

    if (!window.google?.accounts?.id) {
      setScriptLoadError('Google Identity Services를 로드할 수 없습니다.')
      return false
    }

    try {
      // Google Identity Services 초기화
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true, // FedCM 사용 (최신 표준)
      })

      setIsInitialized(true)
      setScriptLoadError(null)
      return true
    } catch (error) {
      console.error('Google OAuth 초기화 실패:', error)
      setScriptLoadError('Google OAuth 초기화에 실패했습니다.')
      return false
    }
  }, [])

  useEffect(() => {
    let timeoutId
    
    // Google API 스크립트가 로드되었는지 확인
    const checkGoogleScript = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleScriptLoaded(true)
        initializeGoogleAuth()
      } else {
        // 스크립트가 아직 로드되지 않았다면 조금 기다렸다가 다시 시도
        setTimeout(checkGoogleScript, 100)
      }
    }

    // 타임아웃 설정 - 10초 후에도 로드되지 않으면 에러 처리
    timeoutId = setTimeout(() => {
      if (!isGoogleScriptLoaded) {
        setScriptLoadError('Google SDK 로드 시간이 초과되었습니다.')
      }
    }, GOOGLE_SCRIPT_LOAD_TIMEOUT)

    checkGoogleScript()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [initializeGoogleAuth, isGoogleScriptLoaded])

  // Google OAuth 응답 처리
  const handleGoogleResponse = useCallback((response) => {
    if (!response.credential) {
      console.error('Google OAuth 응답에 credential이 없습니다.')
      return
    }

    // JWT 토큰 검증 (기본적인 형식 검사)
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      
      // 토큰 만료시간 확인
      if (payload.exp && payload.exp < Date.now() / 1000) {
        console.error('Google OAuth 토큰이 만료되었습니다.')
        return
      }

      // Client ID 검증
      if (payload.aud !== GOOGLE_CLIENT_ID) {
        console.error('Google OAuth 토큰의 Client ID가 일치하지 않습니다.')
        return
      }

    } catch (error) {
      console.error('Google OAuth 토큰 검증 실패:', error)
      return
    }

    // JWT 토큰을 Redux를 통해 서버로 전송
    dispatch(googleLoginAsync(response.credential))
      .unwrap()
      .then((result) => {
        console.log('구글 로그인 성공:', result)
      })
      .catch((error) => {
        console.error('구글 로그인 실패:', error)
        throw error // 상위 컴포넌트에서 에러 처리할 수 있도록
      })
  }, [dispatch])

  const signInWithGoogle = useCallback(async () => {
    // 스크립트 로드 및 초기화 확인
    if (scriptLoadError) {
      throw new Error(scriptLoadError)
    }

    if (!isGoogleScriptLoaded) {
      throw new Error('Google SDK가 아직 로드되지 않았습니다.')
    }

    if (!isInitialized) {
      throw new Error('Google OAuth가 초기화되지 않았습니다.')
    }

    return new Promise((resolve, reject) => {
      try {
        // One Tap 로그인 프롬프트 표시
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // One Tap이 표시되지 않았거나 건너뛰어진 경우, popup 방식으로 대체
            showGooglePopup()
              .then(resolve)
              .catch(reject)
          } else if (notification.isDisplayed()) {
            // One Tap이 정상적으로 표시됨
            resolve()
          } else {
            reject(new Error('Google 로그인 프롬프트를 표시할 수 없습니다.'))
          }
        })
      } catch (error) {
        console.error('구글 로그인 오류:', error)
        // 백업으로 popup 방식 사용
        showGooglePopup()
          .then(resolve)
          .catch(reject)
      }
    })
  }, [isGoogleScriptLoaded, isInitialized, scriptLoadError])

  const showGooglePopup = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Google OAuth2가 로드되지 않았습니다.'))
        return
      }

      try {
        // popup 방식의 Google 로그인
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: (tokenResponse) => {
            if (tokenResponse?.access_token) {
              // 액세스 토큰을 사용해서 사용자 정보 가져오기
              fetchGoogleUserInfo(tokenResponse.access_token)
                .then(resolve)
                .catch(reject)
            } else if (tokenResponse?.error) {
              reject(new Error(`Google OAuth 에러: ${tokenResponse.error}`))
            } else {
              reject(new Error('Google OAuth 토큰을 받을 수 없습니다.'))
            }
          },
          error_callback: (error) => {
            reject(new Error(`Google OAuth 에러: ${error.message || 'Unknown error'}`))
          }
        })

        tokenClient.requestAccessToken({ prompt: 'consent' })
      } catch (error) {
        reject(error)
      }
    })
  }, [])

  const fetchGoogleUserInfo = useCallback(async (accessToken) => {
    if (!accessToken) {
      throw new Error('액세스 토큰이 없습니다.')
    }

    try {
      // Google UserInfo API 호출
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`Google API 호출 실패: ${response.status} ${response.statusText}`)
      }

      const userInfo = await response.json()
      
      // 필수 필드 확인
      if (!userInfo.email || !userInfo.id) {
        throw new Error('Google 사용자 정보가 불완전합니다.')
      }
      
      // 사용자 정보와 함께 서버에 로그인 요청
      return dispatch(googleLoginAsync({
        access_token: accessToken,
        user_info: userInfo
      })).unwrap()
        
    } catch (error) {
      console.error('구글 사용자 정보 가져오기 실패:', error)
      throw error
    }
  }, [dispatch])

  // Google 로그아웃 (선택적)
  const signOutWithGoogle = useCallback(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
  }, [])

  return {
    signInWithGoogle,
    signOutWithGoogle,
    isGoogleScriptLoaded: isGoogleScriptLoaded && isInitialized,
    scriptLoadError,
    isInitialized
  }
}