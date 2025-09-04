import { useState, useEffect } from 'react'

/**
 * Hook for managing Kakao Maps SDK initialization and loading states
 * 
 * @returns {Object} { isKakaoMapsLoaded, isInitialized, scriptLoadError, initializeKakaoMaps }
 */
export const useKakaoMaps = () => {
  const [isKakaoMapsLoaded, setIsKakaoMapsLoaded] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [scriptLoadError, setScriptLoadError] = useState(null)

  useEffect(() => {
    let timeoutId = null
    
    const checkKakaoMaps = () => {
      try {
        if (window.kakao && window.kakao.maps) {
          // Already loaded and available
          setIsKakaoMapsLoaded(true)
          setIsInitialized(true)
          setScriptLoadError(null)
          return
        }

        if (window.kakao) {
          // Kakao is loaded but maps needs to be initialized
          window.kakao.maps.load(() => {
            setIsKakaoMapsLoaded(true)
            setIsInitialized(true)
            setScriptLoadError(null)
          })
        } else {
          // Kakao is not loaded yet, wait a bit more
          timeoutId = setTimeout(() => {
            if (!window.kakao) {
              setScriptLoadError('Kakao Maps API 스크립트를 로드할 수 없습니다.')
              setIsKakaoMapsLoaded(false)
              setIsInitialized(false)
            } else {
              checkKakaoMaps()
            }
          }, 2000)
        }
      } catch (error) {
        console.error('Kakao Maps check error:', error)
        setScriptLoadError('Kakao Maps API 초기화 중 오류가 발생했습니다.')
        setIsKakaoMapsLoaded(false)
        setIsInitialized(false)
      }
    }

    // Initial check
    checkKakaoMaps()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  // Manual initialization function (if needed)
  const initializeKakaoMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve()
        return
      }

      if (window.kakao) {
        window.kakao.maps.load(() => {
          setIsKakaoMapsLoaded(true)
          setIsInitialized(true)
          setScriptLoadError(null)
          resolve()
        })
      } else {
        const error = new Error('Kakao Maps API가 로드되지 않았습니다.')
        setScriptLoadError(error.message)
        reject(error)
      }
    })
  }

  return {
    isKakaoMapsLoaded,
    isInitialized,
    scriptLoadError,
    initializeKakaoMaps
  }
}

export default useKakaoMaps