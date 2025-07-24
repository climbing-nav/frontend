import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { kakaoLoginAsync } from '../store/slices/authSlice'

export const useKakaoAuth = () => {
  const dispatch = useDispatch()
  const [isKakaoScriptLoaded, setIsKakaoScriptLoaded] = useState(false)

  useEffect(() => {
    // Kakao SDK가 로드되었는지 확인
    const checkKakaoScript = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY || "YOUR_KAKAO_APP_KEY" // .env 파일에서 설정
        window.Kakao.init(kakaoAppKey)
        setIsKakaoScriptLoaded(true)
        console.log('카카오 SDK 초기화 완료:', window.Kakao.isInitialized())
      } else if (window.Kakao && window.Kakao.isInitialized()) {
        setIsKakaoScriptLoaded(true)
      } else {
        // 스크립트가 아직 로드되지 않았다면 조금 기다렸다가 다시 시도
        setTimeout(checkKakaoScript, 100)
      }
    }

    checkKakaoScript()
  }, [])

  const signInWithKakao = () => {
    if (!isKakaoScriptLoaded) {
      console.error('카카오 SDK가 아직 로드되지 않았습니다.')
      return
    }

    if (!window.Kakao.isInitialized()) {
      console.error('카카오 SDK가 초기화되지 않았습니다.')
      return
    }

    try {
      window.Kakao.Auth.login({
        success: function(authObj) {
          console.log('카카오 로그인 성공:', authObj)
          
          // 카카오 사용자 정보 요청
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: function(res) {
              console.log('카카오 사용자 정보:', res)
              
              // 서버에 로그인 요청
              const loginData = {
                access_token: authObj.access_token,
                refresh_token: authObj.refresh_token,
                id_token: authObj.id_token,
                user_info: res
              }
              
              dispatch(kakaoLoginAsync(loginData))
                .unwrap()
                .then((result) => {
                  console.log('카카오 로그인 처리 성공:', result)
                })
                .catch((error) => {
                  console.error('카카오 로그인 처리 실패:', error)
                })
            },
            fail: function(error) {
              console.error('카카오 사용자 정보 요청 실패:', error)
            }
          })
        },
        fail: function(err) {
          console.error('카카오 로그인 실패:', err)
        },
        scope: 'profile_nickname,profile_image,account_email' // 필요한 권한 설정
      })
    } catch (error) {
      console.error('카카오 로그인 오류:', error)
    }
  }

  const signOutWithKakao = () => {
    if (!isKakaoScriptLoaded || !window.Kakao.isInitialized()) {
      console.error('카카오 SDK가 준비되지 않았습니다.')
      return
    }

    try {
      window.Kakao.Auth.logout(() => {
        console.log('카카오 로그아웃 완료')
      })
    } catch (error) {
      console.error('카카오 로그아웃 오류:', error)
    }
  }

  const unlinkKakao = () => {
    if (!isKakaoScriptLoaded || !window.Kakao.isInitialized()) {
      console.error('카카오 SDK가 준비되지 않았습니다.')
      return
    }

    try {
      window.Kakao.API.request({
        url: '/v1/user/unlink',
        success: function(res) {
          console.log('카카오 연결 해제 완료:', res)
        },
        fail: function(error) {
          console.error('카카오 연결 해제 실패:', error)
        }
      })
    } catch (error) {
      console.error('카카오 연결 해제 오류:', error)
    }
  }

  return {
    signInWithKakao,
    signOutWithKakao,
    unlinkKakao,
    isKakaoScriptLoaded
  }
}