import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { Box, CircularProgress, Alert, Typography, Fab, IconButton } from '@mui/material'
import { MyLocation, LocationOn, ZoomIn, ZoomOut } from '@mui/icons-material'
import GymInfoPopup from '../GymInfoPopup'
import {
  updateMarkersOptimized,
  cleanupMarkers,
  isMobileDevice,
  logMemoryUsage
} from '../../../utils/mobileMarkerOptimizer'

// Debouncing utility for event handlers
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

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
 * @param {boolean} props.showZoomControls - Whether to show zoom controls (default: true)
 * @param {Array} props.gyms - Array of gym data to display as markers
 * @param {Function} props.onMapReady - Callback when map is initialized
 * @param {Function} props.onLocationFound - Callback when user location is found
 * @param {Function} props.onLocationError - Callback for location errors
 * @param {Function} props.onGymClick - Callback when gym marker is clicked
 * @param {Function} props.onMapClick - Callback when map is clicked
 * @param {Function} props.onZoomChanged - Callback when zoom level changes
 * @param {Function} props.onCenterChanged - Callback when map center changes
 * @param {Function} props.onBoundsChanged - Callback when map bounds change
 * @param {Function} props.onError - Callback for error handling
 * @param {Function} props.onNavigateToGymDetail - Callback to navigate to gym detail page
 * @param {Object} props.sx - Additional styling
 */
function KakaoMap({
  width = '100%',
  height = 400,
  center = { lat: 37.5665, lng: 126.9780 }, // Default: Seoul City Hall
  level = 3,
  showUserLocation = true,
  showLocationButton = true,
  showZoomControls = true,
  gyms = [],
  onMapReady,
  onLocationFound,
  onLocationError,
  onGymClick,
  onMapClick,
  onZoomChanged,
  onCenterChanged,
  onBoundsChanged,
  onError,
  onNavigateToGymDetail,
  sx = {}
}) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const userLocationMarker = useRef(null)
  const gymMarkersRef = useRef([])

  const eventListenersRef = useRef([])

  // Performance optimization refs
  const isUnmountedRef = useRef(false)
  const lastZoomLevelRef = useRef(level)

  // Reset unmounted flag on mount
  useEffect(() => {
    isUnmountedRef.current = false
  }, [])
  
  // Error tracking for circuit breaker pattern
  const errorCountRef = useRef(0)
  const lastErrorTimeRef = useRef(null)
  const errorTimeoutRef = useRef(null)
  
  // Circuit breaker constants
  const MAX_ERRORS = 3
  const ERROR_RESET_TIME = 30000 // 30 seconds
  const CRITICAL_ERROR_THRESHOLD = 5
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [isCriticalError, setIsCriticalError] = useState(false)
  const [circuitBreakerOpen, setCircuitBreakerOpen] = useState(false)
  
  // Popup state for gym information
  const [selectedGym, setSelectedGym] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [isMapReady, setIsMapReady] = useState(false)

  // Removed memoizedCenter to fix infinite loop issue

  // Error tracking and circuit breaker functions - moved before usage
  const trackError = useCallback((errorType = 'general') => {
    const now = Date.now()
    errorCountRef.current += 1
    lastErrorTimeRef.current = now
    
    console.warn(`[KakaoMap] Error tracked: ${errorType} (Count: ${errorCountRef.current})`)
    
    // Check for critical error threshold
    if (errorCountRef.current >= CRITICAL_ERROR_THRESHOLD) {
      console.error(`[KakaoMap] Critical error threshold reached (${errorCountRef.current} errors)`)
      setIsCriticalError(true)
      setCircuitBreakerOpen(true)
      
      // Show alert to user
      if (!window.kakaoMapAlertShown) {
        window.kakaoMapAlertShown = true
        alert('지도 서비스에 문제가 발생했습니다.\n인터넷 연결 상태를 확인하고 페이지를 새로고침해주세요.')
      }
      return true // Critical error detected
    }
    
    // Activate circuit breaker for repeated errors
    if (errorCountRef.current >= MAX_ERRORS) {
      setCircuitBreakerOpen(true)
      
      // Reset after timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
      
      errorTimeoutRef.current = setTimeout(() => {
        errorCountRef.current = 0
        setCircuitBreakerOpen(false)
        lastErrorTimeRef.current = null
      }, ERROR_RESET_TIME)
      
      return true // Circuit breaker activated
    }
    
    return false // Continue normal operation
  }, [])

  const resetErrorTracking = useCallback(() => {
    errorCountRef.current = 0
    lastErrorTimeRef.current = null
    setCircuitBreakerOpen(false)
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }
  }, [])

  // Handle popup close
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false)
    setSelectedGym(null)
  }, [])

  // Update user location marker - fixed to prevent flickering
  const updateUserLocationMarker = useCallback((location) => {

    if (!mapInstance.current) {
      return
    }

    if (!window.kakao || !window.kakao.maps) {
      return
    }

    try {
      // Create position
      const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng)

      // If marker already exists, just update its position instead of removing/recreating
      if (userLocationMarker.current) {
        userLocationMarker.current.setPosition(markerPosition)

        // Center map on user location only if this is a significant location change
        if (!userLocation ||
            Math.abs(userLocation.lat - location.lat) > 0.001 ||
            Math.abs(userLocation.lng - location.lng) > 0.001) {
          mapInstance.current.setCenter(markerPosition)
        }
        return
      }

      // Create new marker only if it doesn't exist

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
        title: '내 위치',
        zIndex: 10 // Ensure user location marker appears on top
      })

      // Add marker to map
      marker.setMap(mapInstance.current)
      userLocationMarker.current = marker


      // Center map on user location
      mapInstance.current.setCenter(markerPosition)
    } catch (error) {
      console.error('❌ Error creating user location marker:', error)
    }
  }, [userLocation])

  // Check if Kakao Maps API is loaded - 의존성 배열 제거로 무한 루프 방지
  useEffect(() => {
    // Return early if critical error
    if (isCriticalError) {
      return
    }

    if (isKakaoLoaded) return // 이미 로드된 경우 실행하지 않음

    let intervalId = null
    let attempts = 0
    const maxAttempts = 10

    const checkKakaoMaps = () => {
      attempts++
      
      if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
        setIsKakaoLoaded(true)
        if (intervalId) clearInterval(intervalId)
        return
      }
      
      if (attempts >= maxAttempts) {
        console.error('❌ Failed to load Kakao Maps after maximum attempts')
        const errorMessage = 'Kakao Maps를 로드할 수 없습니다. 페이지를 새로고침해주세요.'
        
        // Track critical error
        const shouldStop = trackError('kakao-maps-load-failed')
        if (!shouldStop) {
          setError(errorMessage)
          setIsLoading(false)
        }
        
        if (intervalId) clearInterval(intervalId)
        
        if (onError && !shouldStop) {
          onError(new Error(errorMessage))
        }
        return
      }

      // If kakao exists but maps is not ready
      if (window.kakao && !window.kakao.maps) {
      } else if (!window.kakao) {
      }
    }

    // Initial check
    checkKakaoMaps()

    // Set up interval to keep checking
    intervalId = setInterval(checkKakaoMaps, 500) // Check every 500ms

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }, [trackError, onError, isCriticalError, isKakaoLoaded]) // 의존성 업데이트

  // Initialize map when Kakao is loaded
  useEffect(() => {
    
    // Return early if critical error
    if (isCriticalError) {
      return
    }
    
    if (!isKakaoLoaded) {
      return
    }
    
    if (!mapContainer.current) {
      return
    }


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


      // Create map
      const map = new window.kakao.maps.Map(mapContainer.current, options)
      mapInstance.current = map


      // Map is ready
      setIsLoading(prev => prev ? false : prev)

      // Set up map event listeners
      setupMapEventListeners(map)


      // Set map as ready
      setIsMapReady(true)

      if (onMapReady) {
        onMapReady(map)
      }

    } catch (error) {
      console.error('❌ Kakao Map initialization error:', error)
      const errorMessage = `Kakao Map 초기화 실패: ${error.message}`
      
      // Track initialization error
      const shouldStop = trackError('kakao-map-init-failed')
      if (!shouldStop) {
        setError(errorMessage)
        setIsLoading(prev => prev ? false : prev)
        
        if (onError) {
          onError(error)
        }
      }
    }
  }, [isKakaoLoaded, center.lat, center.lng, level, isCriticalError]) // memoizedCenter 대신 원래 값 사용

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

  // Geolocation functions with circuit breaker
  const getCurrentLocation = useCallback(() => {
    // Check circuit breaker before attempting geolocation
    if (circuitBreakerOpen) {
      console.warn('[KakaoMap] Circuit breaker is open, skipping geolocation request')
      return
    }
    
    if (isCriticalError) {
      console.error('[KakaoMap] Critical error state, not attempting geolocation')
      return
    }
    
    if (!navigator.geolocation) {
      const error = new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.')
      setLocationError(error.message)
      trackError('geolocation-not-supported')
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
        
        // Reset error tracking on successful location
        resetErrorTracking()

        // Check if location has significantly changed to avoid unnecessary updates
        const hasSignificantChange = !userLocation ||
          Math.abs(userLocation.lat - location.lat) > 0.0001 ||
          Math.abs(userLocation.lng - location.lng) > 0.0001

        if (hasSignificantChange) {
          setUserLocation(location)

          if (onLocationFound) {
            onLocationFound(location)
          }

          // Add/update user location marker on map
          if (mapInstance.current && showUserLocation) {
            updateUserLocationMarker(location)
          }
        } else {
        }

        setLocationLoading(false)
        setLocationError(null)
      },
      (error) => {
        setLocationLoading(false)
        
        // Track error and check circuit breaker
        const shouldStop = trackError('geolocation-error')
        if (shouldStop) {
          console.warn('[KakaoMap] Stopping geolocation requests due to circuit breaker/critical error')
          return
        }
        
        let errorMessage = '위치를 가져올 수 없습니다.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
            trackError('geolocation-permission-denied')
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            trackError('geolocation-unavailable')
            break
          case error.TIMEOUT:
            errorMessage = '위치 요청 시간이 초과되었습니다.'
            trackError('geolocation-timeout')
            break
          default:
            errorMessage = `위치 오류: ${error.message}`
            trackError('geolocation-unknown')
            break
        }
        
        setLocationError(errorMessage)
        if (onLocationError) {
          onLocationError(error)
        }
      },
      options
    )
  }, [showUserLocation, onLocationFound, onLocationError, circuitBreakerOpen, isCriticalError, trackError, resetErrorTracking, updateUserLocationMarker])

  // Center map to user location
  const centerToUserLocation = useCallback(() => {
    if (userLocation && mapInstance.current) {
      const position = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
      mapInstance.current.setCenter(position)
    } else {
      getCurrentLocation()
    }
  }, [userLocation, getCurrentLocation])

  // Zoom control functions
  const handleZoomIn = useCallback(() => {
    if (mapInstance.current) {
      const currentLevel = mapInstance.current.getLevel()
      if (currentLevel > 1) {
        mapInstance.current.setLevel(currentLevel - 1)
      }
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (mapInstance.current) {
      const currentLevel = mapInstance.current.getLevel()
      if (currentLevel < 14) {
        mapInstance.current.setLevel(currentLevel + 1)
      }
    }
  }, [])

  // Get current zoom level
  const getCurrentZoomLevel = useCallback(() => {
    if (mapInstance.current) {
      return mapInstance.current.getLevel()
    }
    return level
  }, [level])

  // Get user location when map is ready and showUserLocation is true
  useEffect(() => {
    if (mapInstance.current && showUserLocation && !userLocation && !locationLoading) {
      getCurrentLocation()
    }
  }, [mapInstance.current, showUserLocation, userLocation, locationLoading, getCurrentLocation])

  // Optimized event handlers with debouncing
  const debouncedZoomHandler = useCallback(
    debounce((level) => {
      if (isUnmountedRef.current) return

      // Only trigger if zoom level actually changed
      if (lastZoomLevelRef.current !== level) {
        lastZoomLevelRef.current = level
        if (onZoomChanged) {
          onZoomChanged(level)
        }
      }
    }, 150),
    [onZoomChanged]
  )

  const debouncedCenterHandler = useCallback(
    debounce((center) => {
      if (isUnmountedRef.current || !onCenterChanged) return
      onCenterChanged(center)
    }, 100),
    [onCenterChanged]
  )

  const debouncedBoundsHandler = useCallback(
    debounce((bounds) => {
      if (isUnmountedRef.current || !onBoundsChanged) return
      onBoundsChanged(bounds)
    }, 200),
    [onBoundsChanged]
  )

  // Clean up event listeners
  const removeEventListeners = useCallback(() => {
    eventListenersRef.current.forEach(listener => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove()
      }
    })
    eventListenersRef.current = []
  }, [])

  // Setup map event listeners
  const setupMapEventListeners = useCallback((map) => {
    if (!window.kakao || !window.kakao.maps || isUnmountedRef.current) return

    // Clear existing listeners first
    removeEventListeners()

    // Map click event
    if (onMapClick) {
      const clickListener = window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
        if (isUnmountedRef.current) return
        const latlng = mouseEvent.latLng
        onMapClick({
          lat: latlng.getLat(),
          lng: latlng.getLng()
        })
      })
      eventListenersRef.current.push(clickListener)
    }

    // Zoom change event with debouncing
    const zoomListener = window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
      if (isUnmountedRef.current) return
      const level = map.getLevel()
      debouncedZoomHandler(level)
    })
    eventListenersRef.current.push(zoomListener)

    // Center change event with debouncing
    if (onCenterChanged) {
      const centerListener = window.kakao.maps.event.addListener(map, 'center_changed', () => {
        if (isUnmountedRef.current) return
        const center = map.getCenter()
        debouncedCenterHandler({
          lat: center.getLat(),
          lng: center.getLng()
        })
      })
      eventListenersRef.current.push(centerListener)
    }

    // Bounds change event with debouncing
    if (onBoundsChanged) {
      const boundsListener = window.kakao.maps.event.addListener(map, 'bounds_changed', () => {
        if (isUnmountedRef.current) return
        const bounds = map.getBounds()
        const sw = bounds.getSouthWest()
        const ne = bounds.getNorthEast()

        debouncedBoundsHandler({
          southWest: {
            lat: sw.getLat(),
            lng: sw.getLng()
          },
          northEast: {
            lat: ne.getLat(),
            lng: ne.getLng()
          }
        })
      })
      eventListenersRef.current.push(boundsListener)
    }

    // Minimal drag events (no console logs for performance)
    const dragStartListener = window.kakao.maps.event.addListener(map, 'dragstart', () => {
      // Drag start - no action needed for memory optimization
    })
    eventListenersRef.current.push(dragStartListener)

    const dragEndListener = window.kakao.maps.event.addListener(map, 'dragend', () => {
      // Drag end - no action needed for memory optimization
    })
    eventListenersRef.current.push(dragEndListener)

    // Idle event for optimization
    const idleListener = window.kakao.maps.event.addListener(map, 'idle', () => {
      if (isUnmountedRef.current) return
      // Map idle - good time for cleanup or optimization
      if (window.gc && typeof window.gc === 'function') {
        // Force garbage collection if available (development)
        setTimeout(() => window.gc(), 100)
      }
    })
    eventListenersRef.current.push(idleListener)
  }, [onMapClick, debouncedZoomHandler, debouncedCenterHandler, debouncedBoundsHandler, removeEventListeners])

  // Helper function to get congestion color
  const getCongestionColor = useCallback((congestion) => {
    switch (congestion) {
      case 'comfortable':
        return '#4CAF50' // Green
      case 'normal':
        return '#FF9800' // Orange
      case 'crowded':
        return '#F44336' // Red
      default:
        return '#9E9E9E' // Grey
    }
  }, [])

  // Create gym marker
  const createGymMarker = useCallback((gym) => {
    if (!window.kakao || !window.kakao.maps) return null

    if (isUnmountedRef.current) {
    }


    const position = new window.kakao.maps.LatLng(gym.lat, gym.lng)
    const congestionColor = getCongestionColor(gym.congestion)

    // Create custom marker image with congestion color
    const markerImageSrc = 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="${congestionColor}"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <path d="M12 12L20 12L20 20L12 20Z" fill="${congestionColor}"/>
        <path d="M14 14L18 16L14 18Z" fill="white"/>
      </svg>
    `)

    const imageSize = new window.kakao.maps.Size(32, 40)
    const imageOption = { offset: new window.kakao.maps.Point(16, 40) }
    const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption)

    // Create marker (simplified - no pooling for now to fix the issue)
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      title: gym.name
    })

    // Add click event with popup functionality
    const clickHandler = (mouseEvent) => {
      if (isUnmountedRef.current) return

      // Set popup position to screen center for better mobile UX
      setPopupPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      })

      setSelectedGym(gym)
      setIsPopupOpen(true)

      // Call external callback if provided
      if (onGymClick) {
        onGymClick(gym)
      }
    }

    // Add click listener
    marker.clickListener = window.kakao.maps.event.addListener(marker, 'click', clickHandler)

    // Store gym data in marker for reference
    marker.gymData = gym

    return marker
  }, [getCongestionColor]) // onGymClick 의존성 제거로 불필요한 재생성 방지

  // 모바일 최적화된 체육관 마커 업데이트
  const updateGymMarkers = useCallback(() => {
    if (!mapInstance.current || isUnmountedRef.current) {
      return
    }

    if (!window.kakao?.maps) {
      return
    }

    try {
      // 기존 마커 정리
      gymMarkersRef.current.forEach(marker => {
        if (marker) {
          marker.setMap(null)
          if (marker.clickListener) {
            window.kakao.maps.event.removeListener(marker.clickListener)
          }
        }
      })
      gymMarkersRef.current = []

      // 모바일 환경 감지
      const isMobile = isMobileDevice()

      // 모바일에서는 마커 수를 제한하여 성능 향상
      const maxMarkers = isMobile ? 25 : 100
      const limitedGyms = gyms.slice(0, maxMarkers)

      if (limitedGyms.length === 0) return

      // 최적화된 마커 업데이트 사용
      const handleGymClick = (gym, marker) => {
        if (isUnmountedRef.current) return

        // 모바일에서는 간단한 팝업 위치 설정
        setPopupPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        })

        setSelectedGym(gym)
        setIsPopupOpen(true)

        if (onGymClick) {
          onGymClick(gym)
        }
      }

      const markers = updateMarkersOptimized(
        mapInstance.current,
        limitedGyms,
        handleGymClick,
        selectedGym?.id
      )

      gymMarkersRef.current = markers

      // 개발 환경에서 메모리 사용량 로깅
      if (process.env.NODE_ENV === 'development') {
        logMemoryUsage()
      }

    } catch (error) {
      console.error('❌ 체육관 마커 업데이트 오류:', error)
      trackError('marker-update-failed')
    }
  }, [gyms, onGymClick, selectedGym?.id, trackError])

  // Update gym markers when gyms data changes or map is ready
  useEffect(() => {

    if (isMapReady && mapInstance.current && gyms.length > 0) {
      updateGymMarkers()
    } else {
      if (!isMapReady) {
      }
      if (!mapInstance.current) {
      }
      if (gyms.length === 0) {
      }
    }
  }, [isMapReady, gyms, updateGymMarkers]) // isMapReady 추가로 정확한 타이밍 보장

  // Component cleanup on unmount with comprehensive memory management
  useEffect(() => {
    return () => {

      // Set unmounted flag to prevent any further operations
      isUnmountedRef.current = true

      // Clear error timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
        errorTimeoutRef.current = null
      }

      // Remove all event listeners
      removeEventListeners()

      // Clear user location marker
      if (userLocationMarker.current) {
        userLocationMarker.current.setMap(null)
        userLocationMarker.current = null
      }

      // 마커 최적화된 정리
      cleanupMarkers()
      gymMarkersRef.current = []

      // Clean up map instance
      if (mapInstance.current) {
        // Remove all map event listeners
        try {
          window.kakao?.maps?.event?.removeListener(mapInstance.current)
        } catch (e) {
          console.warn('Error removing map listeners:', e)
        }
        mapInstance.current = null
      }

      // Force garbage collection if available (development)
      if (window.gc && typeof window.gc === 'function') {
        setTimeout(() => window.gc(), 100)
      }

    }
  }, [removeEventListeners])

  // Render critical error UI
  if (isCriticalError) {
    return (
      <Box
        sx={{
          width,
          height,
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 1,
          p: 4,
          textAlign: 'center',
          ...sx
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'error.light',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: 'error.main',
              fontWeight: 'bold'
            }}
          >
            ⚠️
          </Typography>
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
          지도 서비스 오류
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400 }}>
          지도 서비스에 문제가 발생했습니다.
          <br />
          인터넷 연결 상태를 확인하고 페이지를 새로고침해주세요.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            페이지 새로고침
          </button>
          
          <button
            onClick={() => {
              setIsCriticalError(false)
              resetErrorTracking()
              window.kakaoMapAlertShown = false
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#1976d2',
              border: '1px solid #1976d2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            다시 시도
          </button>
        </Box>
        
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.disabled', 
            mt: 3,
            fontSize: '12px'
          }}
        >
          문제가 지속되면 관리자에게 문의해주세요.
        </Typography>
      </Box>
    )
  }

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
      {locationError && !circuitBreakerOpen && (
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

      {/* Circuit Breaker Warning */}
      {circuitBreakerOpen && !isCriticalError && (
        <Alert 
          severity="error"
          sx={{ 
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            zIndex: 1000,
            maxWidth: 450
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            위치 서비스 일시 중단
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            반복적인 오류로 인해 위치 서비스를 일시적으로 중단했습니다. 
            {Math.ceil(ERROR_RESET_TIME / 1000)}초 후 자동으로 재시도됩니다.
          </Typography>
        </Alert>
      )}

      {/* Zoom Controls */}
      {showZoomControls && !isLoading && !error && (
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <IconButton
            onClick={handleZoomIn}
            disabled={getCurrentZoomLevel() <= 1}
            sx={{
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: 'grey.50'
              },
              '&:disabled': {
                bgcolor: 'grey.100'
              }
            }}
          >
            <ZoomIn />
          </IconButton>
          <IconButton
            onClick={handleZoomOut}
            disabled={getCurrentZoomLevel() >= 14}
            sx={{
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: 'grey.50'
              },
              '&:disabled': {
                bgcolor: 'grey.100'
              }
            }}
          >
            <ZoomOut />
          </IconButton>
        </Box>
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
            bottom: 50,
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
      
      {/* Gym Information Popup */}
      <GymInfoPopup
        gym={selectedGym}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        position={popupPosition}
        placement="center"
        onNavigateToGymDetail={onNavigateToGymDetail}
      />
    </Box>
  )
}

export default memo(KakaoMap)