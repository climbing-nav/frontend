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

  // Check if Kakao Maps API is loaded
  useEffect(() => {
    const checkKakaoMaps = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true)
        return
      }
      
      // If not loaded, wait for it
      if (window.kakao) {
        window.kakao.maps.load(() => {
          setIsKakaoLoaded(true)
        })
      } else {
        setError('Kakao Maps API를 로드할 수 없습니다. 네트워크 연결을 확인해주세요.')
        setIsLoading(false)
        if (onError) {
          onError(new Error('Kakao Maps API load failed'))
        }
      }
    }

    // Check immediately
    checkKakaoMaps()

    // Also check after a delay in case the script is still loading
    const timeoutId = setTimeout(checkKakaoMaps, 1000)

    return () => clearTimeout(timeoutId)
  }, [onError])

  // Initialize map when Kakao is loaded
  useEffect(() => {
    if (!isKakaoLoaded || !mapContainer.current) return

    try {
      setIsLoading(true)
      setError(null)

      // Map options
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: level
      }

      // Create map
      const map = new window.kakao.maps.Map(mapContainer.current, options)
      mapInstance.current = map

      // Map is ready
      setIsLoading(false)
      
      if (onMapReady) {
        onMapReady(map)
      }

    } catch (error) {
      console.error('Kakao Map initialization error:', error)
      const errorMessage = 'Kakao Map 초기화에 실패했습니다.'
      setError(errorMessage)
      setIsLoading(false)
      
      if (onError) {
        onError(error)
      }
    }
  }, [isKakaoLoaded, center.lat, center.lng, level, onMapReady, onError])

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

  // Render loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          borderRadius: 1,
          ...sx
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            지도를 로딩 중입니다...
          </Typography>
        </Box>
      </Box>
    )
  }

  // Render error state
  if (error) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...sx
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%', 
            maxWidth: 400 
          }}
        >
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Box>
    )
  }

  // Render map
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
      <div 
        ref={mapContainer}
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '4px'
        }}
        role="application"
        aria-label="Kakao 지도"
      />
    </Box>
  )
}

export default KakaoMap