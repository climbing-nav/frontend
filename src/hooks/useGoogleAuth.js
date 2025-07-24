import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { googleLoginAsync } from '../store/slices/authSlice'

export const useGoogleAuth = () => {
  const dispatch = useDispatch()
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false)

  useEffect(() => {
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

    checkGoogleScript()
  }, [])

  const initializeGoogleAuth = () => {
    // Google Identity Services 초기화
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID", // .env 파일에서 설정
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    })
  }

  const handleGoogleResponse = (response) => {
    if (response.credential) {
      // JWT 토큰을 Redux를 통해 서버로 전송
      dispatch(googleLoginAsync(response.credential))
        .unwrap()
        .then((result) => {
          console.log('구글 로그인 성공:', result)
        })
        .catch((error) => {
          console.error('구글 로그인 실패:', error)
        })
    }
  }

  const signInWithGoogle = () => {
    if (!isGoogleScriptLoaded) {
      console.error('Google 스크립트가 아직 로드되지 않았습니다.')
      return
    }

    try {
      // One Tap 로그인 프롬프트 표시
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // One Tap이 표시되지 않았거나 건너뛰어진 경우, popup 방식으로 대체
          showGooglePopup()
        }
      })
    } catch (error) {
      console.error('구글 로그인 오류:', error)
      // 백업으로 popup 방식 사용
      showGooglePopup()
    }
  }

  const showGooglePopup = () => {
    // popup 방식의 Google 로그인
    window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
      scope: 'email profile',
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          // 액세스 토큰을 사용해서 사용자 정보 가져오기
          fetchGoogleUserInfo(tokenResponse.access_token)
        }
      }
    }).requestAccessToken()
  }

  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
      const userInfo = await response.json()
      
      // 사용자 정보와 함께 서버에 로그인 요청
      dispatch(googleLoginAsync({
        access_token: accessToken,
        user_info: userInfo
      }))
        .unwrap()
        .then((result) => {
          console.log('구글 로그인 성공:', result)
        })
        .catch((error) => {
          console.error('구글 로그인 실패:', error)
        })
    } catch (error) {
      console.error('구글 사용자 정보 가져오기 실패:', error)
    }
  }

  return {
    signInWithGoogle,
    isGoogleScriptLoaded
  }
}