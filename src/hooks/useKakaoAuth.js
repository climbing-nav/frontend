import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { kakaoLoginAsync } from '../store/slices/authSlice'

// Kakao OAuth 관련 상수
const KAKAO_SCRIPT_LOAD_TIMEOUT = 10000 // 10초
const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY

export const useKakaoAuth = () => {
  const dispatch = useDispatch()
  const [isKakaoScriptLoaded, setIsKakaoScriptLoaded] = useState(false)
  const [scriptLoadError, setScriptLoadError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Kakao OAuth 초기화 함수
  const initializeKakaoAuth = useCallback(() => {
    if (!KAKAO_APP_KEY) {
      console.error('Kakao App Key가 설정되지 않았습니다. .env 파일을 확인하세요.')
      setScriptLoadError('Kakao App Key가 설정되지 않았습니다.')
      return false
    }

    if (!window.Kakao) {
      setScriptLoadError('Kakao SDK를 로드할 수 없습니다.')
      return false
    }

    try {
      // Kakao SDK 초기화
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY)
        console.log('카카오 SDK 초기화 완료:', window.Kakao.isInitialized())
      }

      if (window.Kakao.isInitialized()) {
        setIsInitialized(true)
        setScriptLoadError(null)
        return true
      } else {
        throw new Error('Kakao SDK 초기화에 실패했습니다.')
      }
    } catch (error) {
      console.error('Kakao OAuth 초기화 실패:', error)
      setScriptLoadError('Kakao OAuth 초기화에 실패했습니다.')
      return false
    }
  }, [])

  useEffect(() => {
    let timeoutId
    
    // Kakao SDK가 로드되었는지 확인
    const checkKakaoScript = () => {
      if (window.Kakao) {
        setIsKakaoScriptLoaded(true)
        initializeKakaoAuth()
      } else {
        // 스크립트가 아직 로드되지 않았다면 조금 기다렸다가 다시 시도
        setTimeout(checkKakaoScript, 100)
      }
    }

    // 타임아웃 설정 - 10초 후에도 로드되지 않으면 에러 처리
    timeoutId = setTimeout(() => {
      if (!isKakaoScriptLoaded) {
        setScriptLoadError('Kakao SDK 로드 시간이 초과되었습니다.')
      }
    }, KAKAO_SCRIPT_LOAD_TIMEOUT)

    checkKakaoScript()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [initializeKakaoAuth, isKakaoScriptLoaded])

  const signInWithKakao = useCallback(async () => {
    // 스크립트 로드 및 초기화 확인
    if (scriptLoadError) {
      throw new Error(scriptLoadError)
    }

    if (!isKakaoScriptLoaded) {
      throw new Error('Kakao SDK가 아직 로드되지 않았습니다.')
    }

    if (!isInitialized) {
      throw new Error('Kakao OAuth가 초기화되지 않았습니다.')
    }

    return new Promise((resolve, reject) => {
      try {
        window.Kakao.Auth.login({
          success: function(authObj) {
            console.log('카카오 로그인 성공:', authObj)
            
            // 토큰 유효성 검사
            if (!authObj.access_token) {
              reject(new Error('Kakao 액세스 토큰을 받을 수 없습니다.'))
              return
            }
            
            // 카카오 사용자 정보 요청
            window.Kakao.API.request({
              url: '/v2/user/me',
              success: function(res) {
                console.log('카카오 사용자 정보:', res)
                
                // 필수 필드 확인
                if (!res.id || !res.kakao_account) {
                  reject(new Error('Kakao 사용자 정보가 불완전합니다.'))
                  return
                }
                
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
                    resolve(result)
                  })
                  .catch((error) => {
                    console.error('카카오 로그인 처리 실패:', error)
                    reject(error)
                  })
              },
              fail: function(error) {
                console.error('카카오 사용자 정보 요청 실패:', error)
                reject(new Error(`카카오 사용자 정보 요청 실패: ${error.msg || 'Unknown error'}`))
              }
            })
          },
          fail: function(err) {
            console.error('카카오 로그인 실패:', err)
            let errorMessage = 'Kakao 로그인에 실패했습니다.'
            
            // 에러 코드에 따른 메시지 커스터마이징
            if (err.error === 'access_denied') {
              errorMessage = 'Kakao 로그인이 취소되었습니다.'
            } else if (err.error === 'server_error') {
              errorMessage = 'Kakao 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            }
            
            reject(new Error(errorMessage))
          },
          scope: 'profile_nickname,profile_image,account_email' // 필요한 권한 설정
        })
      } catch (error) {
        console.error('카카오 로그인 오류:', error)
        reject(error)
      }
    })
  }, [isKakaoScriptLoaded, isInitialized, scriptLoadError, dispatch])

  const signOutWithKakao = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!isKakaoScriptLoaded || !window.Kakao.isInitialized()) {
        reject(new Error('카카오 SDK가 준비되지 않았습니다.'))
        return
      }

      try {
        window.Kakao.Auth.logout((response) => {
          console.log('카카오 로그아웃 완료:', response)
          resolve(response)
        })
      } catch (error) {
        console.error('카카오 로그아웃 오류:', error)
        reject(error)
      }
    })
  }, [isKakaoScriptLoaded])

  const unlinkKakao = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!isKakaoScriptLoaded || !window.Kakao.isInitialized()) {
        reject(new Error('카카오 SDK가 준비되지 않았습니다.'))
        return
      }

      try {
        window.Kakao.API.request({
          url: '/v1/user/unlink',
          success: function(res) {
            console.log('카카오 연결 해제 완료:', res)
            resolve(res)
          },
          fail: function(error) {
            console.error('카카오 연결 해제 실패:', error)
            reject(new Error(`카카오 연결 해제 실패: ${error.msg || 'Unknown error'}`))
          }
        })
      } catch (error) {
        console.error('카카오 연결 해제 오류:', error)
        reject(error)
      }
    })
  }, [isKakaoScriptLoaded])

  return {
    signInWithKakao,
    signOutWithKakao,
    unlinkKakao,
    isKakaoScriptLoaded: isKakaoScriptLoaded && isInitialized,
    scriptLoadError,
    isInitialized
  }
}