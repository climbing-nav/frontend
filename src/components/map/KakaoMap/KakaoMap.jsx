import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Alert, Typography } from '@mui/material'

/**
 * KakaoMap Component
 * Interactive map component using Kakao Maps API with gym markers and user location features
 * 
 * @param {Object} props
 * @param {number} props.width - Map width (default: '100%')
 * @param {number} props.height - Map height (default: 400)
 * @param {Object} props.center - Map center coordinates { lat, lng }
 * @param {number} props.level - Map zoom level (1-14, default: 3)
 * @param {Function} props.onMapReady - Callback when map is initialized
 * @param {Function} props.onError - Callback for error handling
 * @param {Object} props.sx - Additional styling
 */
function KakaoMap({
  width = '100%',
  height = 400,
  center = { lat: 37.5665, lng: 126.9780 }, // Default: Seoul City Hall
  level = 3,
  onMapReady,
  onError,
  sx = {}
}) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)


  // Check if Kakao Maps API is loaded - 의존성 배열 제거로 무한 루프 방지
  useEffect(() => {
    if (isKakaoLoaded) return // 이미 로드된 경우 실행하지 않음

    let intervalId = null
    let attempts = 0
    const maxAttempts = 10

    const checkKakaoMaps = () => {
      attempts++
      console.log(`Kakao Maps check attempt ${attempts}/${maxAttempts}`)
      
      if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
        console.log('✅ Kakao Maps SDK fully loaded')
        console.log('🔄 Setting isKakaoLoaded to true...')
        setIsKakaoLoaded(true)
        if (intervalId) clearInterval(intervalId)
        return
      }
      
      if (attempts >= maxAttempts) {
        console.error('❌ Failed to load Kakao Maps after maximum attempts')
        setError('Kakao Maps를 로드할 수 없습니다. 페이지를 새로고침해주세요.')
        setIsLoading(false)
        if (intervalId) clearInterval(intervalId)
        // onError 호출 제거 (무한 루프 방지)
        return
      }

      // If kakao exists but maps is not ready
      if (window.kakao && !window.kakao.maps) {
        console.log('🔄 Kakao loaded, waiting for maps...')
      } else if (!window.kakao) {
        console.log('⏳ Waiting for Kakao SDK...')
      }
    }

    // Initial check
    checkKakaoMaps()

    // Set up interval to keep checking
    intervalId = setInterval(checkKakaoMaps, 500) // Check every 500ms

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, []) // 의존성 배열을 빈 배열로 변경

  // Initialize map when Kakao is loaded
  useEffect(() => {
    console.log('🔍 Map initialization useEffect triggered')
    console.log('isKakaoLoaded:', isKakaoLoaded)
    console.log('mapContainer.current:', !!mapContainer.current)
    
    if (!isKakaoLoaded) {
      console.log('❌ Kakao not loaded yet')
      return
    }
    
    if (!mapContainer.current) {
      console.log('❌ Map container not ready')
      return
    }

    console.log('🗺️ Initializing Kakao Map...')
    console.log('Container dimensions:', {
      width: mapContainer.current.offsetWidth,
      height: mapContainer.current.offsetHeight
    })

    try {
      setIsLoading(true)
      setError(null)

      // Ensure container has proper dimensions
      if (mapContainer.current.offsetWidth === 0 || mapContainer.current.offsetHeight === 0) {
        console.warn('⚠️ Map container has zero dimensions, retrying...')
        // Use a different approach to retry without changing isKakaoLoaded
        setTimeout(() => {
          // Force re-render by re-running this effect
          if (mapContainer.current && mapContainer.current.offsetWidth > 0) {
            // Container is ready now, continue with initialization
            const retryOptions = {
              center: new window.kakao.maps.LatLng(center.lat, center.lng),
              level: level
            }
            try {
              const retryMap = new window.kakao.maps.Map(mapContainer.current, retryOptions)
              mapInstance.current = retryMap
              setIsLoading(false)
              if (onMapReady) {
                onMapReady(retryMap)
              }
            } catch (retryError) {
              console.error('❌ Retry failed:', retryError)
              setError(`지도 초기화 재시도 실패: ${retryError.message}`)
              setIsLoading(false)
            }
          }
        }, 200)
        return
      }

      // Map options
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: level
      }

      console.log('📍 Creating map with center:', center, 'level:', level)

      // Create map
      const map = new window.kakao.maps.Map(mapContainer.current, options)
      mapInstance.current = map

      console.log('✅ Map created successfully!')

      // Map is ready
      setIsLoading(false)
      
      if (onMapReady) {
        onMapReady(map)
      }

    } catch (error) {
      console.error('❌ Kakao Map initialization error:', error)
      const errorMessage = `Kakao Map 초기화 실패: ${error.message}`
      setError(errorMessage)
      setIsLoading(false)
      
      if (onError) {
        onError(error)
      }
    }
  }, [isKakaoLoaded, center.lat, center.lng, level]) // 함수 props를 의존성에서 제거

  // Update map center when props change
  useEffect(() => {
    if (mapInstance.current) {
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng)
      mapInstance.current.setCenter(newCenter)
    }
  }, [center.lat, center.lng])

  // Update map level when props change
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setLevel(level)
    }
  }, [level])

  // Always render the map container, but show loading overlay
  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        '& > div': {
          borderRadius: 1,
          overflow: 'hidden'
        },
        ...sx
      }}
    >
      {/* Map Container - Always Present */}
      <div 
        ref={mapContainer}
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '4px',
          position: 'relative'
        }}
        role="application"
        aria-label="Kakao 지도"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(245, 245, 245, 0.9)',
            borderRadius: 1,
            zIndex: 1000
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              지도를 로딩 중입니다...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Error Overlay */}
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1,
            zIndex: 1000
          }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              width: '100%', 
              maxWidth: 400,
              mx: 2
            }}
          >
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  )
}

export default KakaoMap