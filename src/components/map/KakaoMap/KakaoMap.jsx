import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, CircularProgress, Alert, Typography, Fab } from '@mui/material'
import { MyLocation, LocationOn } from '@mui/icons-material'

/**
 * KakaoMap Component
 * Interactive map component using Kakao Maps API with gym markers and user location features
 * 
 * @param {Object} props
 * @param {number} props.width - Map width (default: '100%')
 * @param {number} props.height - Map height (default: 400)
 * @param {Object} props.center - Map center coordinates { lat, lng }
 * @param {number} props.level - Map zoom level (1-14, default: 3)
 * @param {boolean} props.showUserLocation - Whether to show user location (default: true)
 * @param {boolean} props.showLocationButton - Whether to show location button (default: true)
 * @param {Function} props.onMapReady - Callback when map is initialized
 * @param {Function} props.onLocationFound - Callback when user location is found
 * @param {Function} props.onLocationError - Callback for location errors
 * @param {Function} props.onError - Callback for error handling
 * @param {Object} props.sx - Additional styling
 */
function KakaoMap({
  width = '100%',
  height = 400,
  center = { lat: 37.5665, lng: 126.9780 }, // Default: Seoul City Hall
  level = 3,
  showUserLocation = true,
  showLocationButton = true,
  onMapReady,
  onLocationFound,
  onLocationError,
  onError,
  sx = {}
}) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const userLocationMarker = useRef(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState(null)


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

  // Geolocation functions
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const error = new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.')
      setLocationError(error.message)
      if (onLocationError) {
        onLocationError(error)
      }
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // Cache for 1 minute
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const location = { lat: latitude, lng: longitude, accuracy }
        
        setUserLocation(location)
        setLocationLoading(false)
        setLocationError(null)

        if (onLocationFound) {
          onLocationFound(location)
        }

        // Add/update user location marker on map
        if (mapInstance.current && showUserLocation) {
          updateUserLocationMarker(location)
        }
      },
      (error) => {
        setLocationLoading(false)
        let errorMessage = '위치를 가져올 수 없습니다.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            break
          case error.TIMEOUT:
            errorMessage = '위치 요청 시간이 초과되었습니다.'
            break
          default:
            errorMessage = `위치 오류: ${error.message}`
            break
        }
        
        setLocationError(errorMessage)
        if (onLocationError) {
          onLocationError(error)
        }
      },
      options
    )
  }, [showUserLocation, onLocationFound, onLocationError])

  // Update user location marker
  const updateUserLocationMarker = useCallback((location) => {
    if (!mapInstance.current || !window.kakao || !window.kakao.maps) return

    // Remove existing marker
    if (userLocationMarker.current) {
      userLocationMarker.current.setMap(null)
    }

    // Create marker position
    const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng)

    // Create custom marker image for user location
    const imageSrc = 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#4285f4" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `)
    const imageSize = new window.kakao.maps.Size(24, 24)
    const imageOption = { offset: new window.kakao.maps.Point(12, 12) }
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

    // Create marker
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
      title: '내 위치'
    })

    // Add marker to map
    marker.setMap(mapInstance.current)
    userLocationMarker.current = marker

    // Center map on user location
    mapInstance.current.setCenter(markerPosition)
  }, [])

  // Center map to user location
  const centerToUserLocation = useCallback(() => {
    if (userLocation && mapInstance.current) {
      const position = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
      mapInstance.current.setCenter(position)
    } else {
      getCurrentLocation()
    }
  }, [userLocation, getCurrentLocation])

  // Get user location when map is ready and showUserLocation is true
  useEffect(() => {
    if (mapInstance.current && showUserLocation && !userLocation && !locationLoading) {
      getCurrentLocation()
    }
  }, [mapInstance.current, showUserLocation, userLocation, locationLoading, getCurrentLocation])

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

      {/* Location Error Alert */}
      {locationError && (
        <Alert 
          severity="warning" 
          onClose={() => setLocationError(null)}
          sx={{ 
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            zIndex: 1000,
            maxWidth: 400
          }}
        >
          <Typography variant="body2">
            {locationError}
          </Typography>
        </Alert>
      )}

      {/* Location Button */}
      {showLocationButton && !isLoading && !error && (
        <Fab
          size="small"
          color="primary"
          aria-label="내 위치 찾기"
          onClick={centerToUserLocation}
          disabled={locationLoading}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            bgcolor: 'white',
            color: locationLoading ? 'text.disabled' : 'primary.main',
            '&:hover': {
              bgcolor: 'grey.50'
            },
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          {locationLoading ? (
            <CircularProgress size={20} />
          ) : (
            userLocation ? <LocationOn /> : <MyLocation />
          )}
        </Fab>
      )}
    </Box>
  )
}

export default KakaoMap