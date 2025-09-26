import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { Box, CircularProgress, Alert, Typography, Fab, IconButton } from '@mui/material'
import { MyLocation, LocationOn, ZoomIn, ZoomOut } from '@mui/icons-material'
import GymInfoPopup from '../GymInfoPopup'
import { cleanupMarkers, isMobileDevice } from '../../../utils/mobileMarkerOptimizer'

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
 * KakaoMap 컴포넌트
 * 카카오 지도 API를 사용한 대화형 지도 컴포넌트
 */
function KakaoMap({
  width = '100%',
  height = 400,
  center = { lat: 37.5665, lng: 126.9780 },
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
  const isUnmountedRef = useRef(false)
  const lastZoomLevelRef = useRef(level)
  const markerUpdateMutex = useRef(false)

  // 에러 추적 refs
  const errorCountRef = useRef(0)
  const errorTimeoutRef = useRef(null)

  // 상수
  const MAX_ERRORS = 3
  const ERROR_RESET_TIME = 30000
  const CRITICAL_ERROR_THRESHOLD = 5

  // 상태
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [isCriticalError, setIsCriticalError] = useState(false)
  const [circuitBreakerOpen, setCircuitBreakerOpen] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [isMarkersLoading, setIsMarkersLoading] = useState(false)
  const [currentBounds, setCurrentBounds] = useState(null)
  const visibleMarkersRef = useRef(new Map()) // 현재 화면에 표시된 마커들
  const allGymsRef = useRef([]) // 전체 체육관 데이터

  // 팝업 상태 통합
  const [popup, setPopup] = useState({
    gym: null,
    isOpen: false,
    position: { x: 0, y: 0 }
  })

  useEffect(() => {
    isUnmountedRef.current = false
    allGymsRef.current = gyms // 체육관 데이터 저장
  }, [gyms])

  // 혼잡도 색상 (먼저 정의)
  const getCongestionColor = useCallback((congestion) => {
    switch (congestion) {
      case 'comfortable': return '#4CAF50'
      case 'normal': return '#FF9800'
      case 'crowded': return '#F44336'
      default: return '#9E9E9E'
    }
  }, [])

  // 현재 화면 영역 계산
  const getCurrentBounds = useCallback(() => {
    if (!mapInstance.current) return null
    return mapInstance.current.getBounds()
  }, [])

  // 마커가 현재 화면에 보이는지 확인
  const isMarkerInBounds = useCallback((lat, lng, bounds) => {
    if (!bounds) return false
    const position = new window.kakao.maps.LatLng(lat, lng)
    return bounds.contain(position)
  }, [])

  // 화면에서 보이지 않는 마커 제거
  const removeInvisibleMarkers = useCallback((bounds) => {
    const markersToRemove = []

    visibleMarkersRef.current.forEach((marker, gymId) => {
      const gym = allGymsRef.current.find(g => g.id === gymId)
      if (!gym || !isMarkerInBounds(gym.lat, gym.lng, bounds)) {
        // 화면 밖으로 나간 마커 제거
        try {
          marker.setMap(null)
          console.log('🗑️ 마커 제거:', gym?.name || gymId)
        } catch (e) {
          console.warn('마커 제거 오류:', e)
        }
        markersToRemove.push(gymId)
      }
    })

    // 제거된 마커들을 맵에서 삭제
    markersToRemove.forEach(gymId => {
      visibleMarkersRef.current.delete(gymId)
    })

    console.log(`📊 마커 정리 완료: ${markersToRemove.length}개 제거, ${visibleMarkersRef.current.size}개 유지`)
  }, [isMarkerInBounds])

  // 화면에 보이는 새로운 마커 추가
  const addVisibleMarkers = useCallback((bounds) => {
    if (!mapInstance.current || !bounds) return

    let addedCount = 0
    const isMobile = isMobileDevice()

    allGymsRef.current.forEach(gym => {
      // 이미 표시된 마커는 건너뛰기
      if (visibleMarkersRef.current.has(gym.id)) return

      // 화면에 보이는 체육관만 처리
      if (!gym?.lat || !gym?.lng || !isMarkerInBounds(gym.lat, gym.lng, bounds)) return

      try {
        const position = new window.kakao.maps.LatLng(gym.lat, gym.lng)
        const congestionColor = getCongestionColor(gym.congestion)

        const markerImageSrc = 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="30" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 30 12 30S24 21 24 12C24 5.4 18.6 0 12 0Z"
                  fill="${congestionColor}" stroke="white" stroke-width="1"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
            <circle cx="12" cy="12" r="3" fill="${congestionColor}"/>
          </svg>
        `)

        const markerImage = new window.kakao.maps.MarkerImage(
          markerImageSrc,
          new window.kakao.maps.Size(24, 30),
          { offset: new window.kakao.maps.Point(12, 30) }
        )

        const marker = new window.kakao.maps.Marker({
          position: position,
          image: markerImage,
          title: gym.name,
          zIndex: popup.gym?.id === gym.id ? 100 : 50
        })

        const clickHandler = () => {
          if (isUnmountedRef.current) return

          setPopup({
            gym,
            isOpen: true,
            position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
          })

          if (onGymClick) onGymClick(gym)
        }

        window.kakao.maps.event.addListener(marker, 'click', clickHandler)
        marker.setMap(mapInstance.current)

        // 가시 마커 맵에 추가
        visibleMarkersRef.current.set(gym.id, marker)
        addedCount++

        console.log('➕ 새 마커 추가:', gym.name)

      } catch (error) {
        console.warn(`체육관 마커 생성 실패: ${gym.name}`, error)
      }
    })

    console.log(`📊 새 마커 추가 완료: ${addedCount}개 추가, 총 ${visibleMarkersRef.current.size}개 표시`)
  }, [isMarkerInBounds, getCongestionColor, popup.gym?.id, onGymClick])

  // 에러 추적
  const trackError = useCallback((errorType = 'general') => {
    errorCountRef.current += 1

    if (errorCountRef.current >= CRITICAL_ERROR_THRESHOLD) {
      setIsCriticalError(true)
      setCircuitBreakerOpen(true)

      if (!window.kakaoMapAlertShown) {
        window.kakaoMapAlertShown = true
        alert('지도 서비스에 문제가 발생했습니다.\n페이지를 새로고침해주세요.')
      }
      return true
    }

    if (errorCountRef.current >= MAX_ERRORS) {
      setCircuitBreakerOpen(true)

      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }

      errorTimeoutRef.current = setTimeout(() => {
        errorCountRef.current = 0
        setCircuitBreakerOpen(false)
      }, ERROR_RESET_TIME)

      return true
    }

    return false
  }, [])

  const resetErrorTracking = useCallback(() => {
    errorCountRef.current = 0
    setCircuitBreakerOpen(false)
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }
  }, [])

  // 뷰포트 기반 마커 업데이트
  const updateViewportMarkers = useCallback(() => {
    if (!mapInstance.current || isUnmountedRef.current || !window.kakao?.maps || markerUpdateMutex.current) {
      return
    }

    markerUpdateMutex.current = true
    setIsMarkersLoading(true)

    try {
      const bounds = getCurrentBounds()
      if (!bounds) return

      console.log('🗺️ 뷰포트 기반 마커 업데이트 시작')
      console.log('📊 현재 표시 중인 마커 수:', visibleMarkersRef.current.size)

      // 1. 화면 밖으로 나간 마커 제거
      removeInvisibleMarkers(bounds)

      // 2. 화면에 새로 보이는 마커 추가
      addVisibleMarkers(bounds)

      // 3. 현재 bounds 저장
      setCurrentBounds(bounds)

      // 4. 사용자 위치 마커 보호 및 최상위 유지
      if (userLocationMarker.current) {
        const markerMap = userLocationMarker.current.getMap()
        console.log('📍 사용자 마커가 지도에 연결됨:', !!markerMap)
        console.log('📍 사용자 마커 위치:', userLocationMarker.current.getPosition())
        console.log('📍 사용자 마커 zIndex:', userLocationMarker.current.getZIndex())

        // 마커가 지도에서 제거되었다면 다시 추가
        if (!markerMap && mapInstance.current) {
          console.log('🔄 사용자 위치 마커 지도에 다시 추가')
          userLocationMarker.current.setMap(mapInstance.current)
        }

        // 사용자 위치 마커를 맨 위로 올리기
        userLocationMarker.current.setZIndex(9999)
        console.log('🔄 사용자 위치 마커 zIndex 재설정 완료')

        // 혹시 마커가 보이지 않는다면 강제로 다시 지도에 추가
        try {
          userLocationMarker.current.setMap(null)
          userLocationMarker.current.setMap(mapInstance.current)
          console.log('🔄 사용자 위치 마커 강제 재추가 완료')
        } catch (e) {
          console.warn('사용자 마커 재추가 중 오류:', e)
        }
      }

      console.log('✅ 뷰포트 마커 업데이트 완료')

    } catch (error) {
      console.error('❌ 뷰포트 마커 업데이트 오류:', error)
      trackError('viewport-marker-update-failed')
    } finally {
      markerUpdateMutex.current = false

      // 최소 로딩 시간을 보장하여 깜빡임 방지
      setTimeout(() => {
        setIsMarkersLoading(false)
      }, 150)
    }
  }, [getCurrentBounds, removeInvisibleMarkers, addVisibleMarkers, trackError])

  // 팝업 핸들러
  const handleClosePopup = useCallback(() => {
    setPopup({ gym: null, isOpen: false, position: { x: 0, y: 0 } })
  }, [])

  // 사용자 위치 마커 업데이트
  const updateUserLocationMarker = useCallback((location) => {
    console.log('🎯 updateUserLocationMarker 호출됨:', location)

    if (!mapInstance.current || !window.kakao?.maps || isUnmountedRef.current) {
      console.log('❌ 마커 업데이트 중단: map =', !!mapInstance.current, 'kakao =', !!window.kakao?.maps, 'unmounted =', isUnmountedRef.current)
      return
    }

    try {
      const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng)

      // 기존 마커가 있으면 위치만 업데이트
      if (userLocationMarker.current) {
        console.log('✅ 기존 마커 위치 업데이트:', location)
        userLocationMarker.current.setPosition(markerPosition)
        mapInstance.current.setCenter(markerPosition)
        return
      }

      // 새 마커 생성 - 더 크고 뚜렷한 마커
      const imageSrc = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#FF0000" stroke="white" stroke-width="3"/>
          <circle cx="16" cy="16" r="8" fill="white"/>
          <circle cx="16" cy="16" r="4" fill="#FF0000"/>
        </svg>
      `)

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        new window.kakao.maps.Size(32, 32),
        { offset: new window.kakao.maps.Point(16, 16) }
      )

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
        title: '내 위치'
      })

      marker.setMap(mapInstance.current)
      marker.setZIndex(9999) // 명시적으로 높은 zIndex 설정
      userLocationMarker.current = marker
      console.log('🎯 새 사용자 위치 마커 생성 완료:', location)

      // 마커 생성 시 중심 이동
      mapInstance.current.setCenter(markerPosition)

    } catch (error) {
      console.error('❌ Error creating user location marker:', error)
    }
  }, [])

  // 카카오 API 로드 확인
  useEffect(() => {
    if (isCriticalError || isKakaoLoaded) return

    let intervalId = null
    let attempts = 0
    const maxAttempts = 10

    const checkKakaoMaps = () => {
      attempts++

      if (window.kakao?.maps?.LatLng) {
        setIsKakaoLoaded(true)
        if (intervalId) clearInterval(intervalId)
        return
      }

      if (attempts >= maxAttempts) {
        const errorMessage = 'Kakao Maps를 로드할 수 없습니다. 페이지를 새로고침해주세요.'
        const shouldStop = trackError('kakao-maps-load-failed')

        if (!shouldStop) {
          setError(errorMessage)
          setIsLoading(false)
          if (onError) onError(new Error(errorMessage))
        }

        if (intervalId) clearInterval(intervalId)
        return
      }
    }

    checkKakaoMaps()
    intervalId = setInterval(checkKakaoMaps, 500)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [trackError, onError, isCriticalError, isKakaoLoaded])

  // 지도 초기화
  useEffect(() => {
    if (isCriticalError || !isKakaoLoaded || !mapContainer.current) return

    try {
      setIsLoading(true)
      setError(null)

      if (mapContainer.current.offsetWidth === 0 || mapContainer.current.offsetHeight === 0) {
        setTimeout(() => {
          if (mapContainer.current?.offsetWidth > 0) {
            const retryOptions = {
              center: new window.kakao.maps.LatLng(center.lat, center.lng),
              level: level
            }
            try {
              const retryMap = new window.kakao.maps.Map(mapContainer.current, retryOptions)
              mapInstance.current = retryMap
              setIsLoading(false)
              if (onMapReady) onMapReady(retryMap)
            } catch (retryError) {
              setError(`지도 초기화 재시도 실패: ${retryError.message}`)
              setIsLoading(false)
            }
          }
        }, 200)
        return
      }

      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: level
      }

      const map = new window.kakao.maps.Map(mapContainer.current, options)
      mapInstance.current = map

      setIsLoading(false)
      setupMapEventListeners(map)
      setIsMapReady(true)

      if (onMapReady) {
        onMapReady(map)
      }

    } catch (error) {
      const errorMessage = `Kakao Map 초기화 실패: ${error.message}`
      const shouldStop = trackError('kakao-map-init-failed')

      if (!shouldStop) {
        setError(errorMessage)
        setIsLoading(false)
        if (onError) onError(error)
      }
    }
  }, [isKakaoLoaded, center.lat, center.lng, level, isCriticalError])

  // 지도 중심/레벨 업데이트
  useEffect(() => {
    if (mapInstance.current) {
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng)
      mapInstance.current.setCenter(newCenter)
    }
  }, [center.lat, center.lng])

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setLevel(level)
    }
  }, [level])

  // 위치 정보 함수
  const getCurrentLocation = useCallback(() => {
    if (circuitBreakerOpen || isCriticalError || !navigator.geolocation) {
      if (!navigator.geolocation) {
        const error = new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.')
        setLocationError(error.message)
        trackError('geolocation-not-supported')
        if (onLocationError) onLocationError(error)
      }
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const location = { lat: latitude, lng: longitude, accuracy }

        resetErrorTracking()

        const hasSignificantChange = !userLocation ||
          Math.abs(userLocation.lat - location.lat) > 0.0001 ||
          Math.abs(userLocation.lng - location.lng) > 0.0001

        if (hasSignificantChange) {
          setUserLocation(location)

          if (onLocationFound) {
            onLocationFound(location)
          }

          if (mapInstance.current && showUserLocation) {
            updateUserLocationMarker(location)
          }
        }

        setLocationLoading(false)
        setLocationError(null)
      },
      (error) => {
        setLocationLoading(false)

        const shouldStop = trackError('geolocation-error')
        if (shouldStop) return

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
  }, [showUserLocation, onLocationFound, onLocationError, circuitBreakerOpen, isCriticalError, trackError, resetErrorTracking, updateUserLocationMarker])

  const centerToUserLocation = useCallback(() => {
    if (userLocation && mapInstance.current) {
      const position = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
      mapInstance.current.setCenter(position)
    } else {
      getCurrentLocation()
    }
  }, [userLocation, getCurrentLocation])

  // 부드러운 줌 컨트롤
  const handleZoomIn = useCallback(() => {
    if (mapInstance.current && !isZooming) {
      const currentLevel = mapInstance.current.getLevel()
      if (currentLevel > 1) {
        setIsZooming(true)

        // 부드러운 줌 애니메이션
        const targetLevel = currentLevel - 1
        mapInstance.current.setLevel(targetLevel, { animate: { duration: 350 } })

        // 줌 완료 후 상태 리셋
        setTimeout(() => {
          setIsZooming(false)
        }, 400)
      }
    }
  }, [isZooming])

  const handleZoomOut = useCallback(() => {
    if (mapInstance.current && !isZooming) {
      const currentLevel = mapInstance.current.getLevel()
      if (currentLevel < 14) {
        setIsZooming(true)

        // 부드러운 줌 애니메이션
        const targetLevel = currentLevel + 1
        mapInstance.current.setLevel(targetLevel, { animate: { duration: 350 } })

        // 줌 완료 후 상태 리셋
        setTimeout(() => {
          setIsZooming(false)
        }, 400)
      }
    }
  }, [isZooming])

  const getCurrentZoomLevel = useCallback(() => {
    return mapInstance.current ? mapInstance.current.getLevel() : level
  }, [level])

  // 사용자 위치 가져오기
  useEffect(() => {
    if (mapInstance.current && showUserLocation && !userLocation && !locationLoading) {
      getCurrentLocation()
    }
  }, [mapInstance.current, showUserLocation, userLocation, locationLoading, getCurrentLocation])

  // 디바운스된 이벤트 핸들러
  const debouncedZoomHandler = useCallback(
    debounce((level) => {
      if (isUnmountedRef.current || lastZoomLevelRef.current === level) return
      lastZoomLevelRef.current = level

      // 줌 변경 완료 시 상태 업데이트
      setIsZooming(false)

      // 줌 변경 시 뷰포트 마커 업데이트
      updateViewportMarkers()

      if (onZoomChanged) onZoomChanged(level)
    }, 250),
    [onZoomChanged, updateViewportMarkers]
  )

  const debouncedCenterHandler = useCallback(
    debounce((center) => {
      if (isUnmountedRef.current) return

      // 지도 중심 이동 시 뷰포트 마커 업데이트
      updateViewportMarkers()

      if (onCenterChanged) onCenterChanged(center)
    }, 300),
    [onCenterChanged, updateViewportMarkers]
  )

  const debouncedBoundsHandler = useCallback(
    debounce((bounds) => {
      if (isUnmountedRef.current || !onBoundsChanged) return
      onBoundsChanged(bounds)
    }, 200),
    [onBoundsChanged]
  )

  // 이벤트 리스너 정리
  const removeEventListeners = useCallback(() => {
    eventListenersRef.current.forEach(listener => {
      if (listener?.remove) listener.remove()
    })
    eventListenersRef.current = []
  }, [])

  // 지도 이벤트 리스너 설정
  const setupMapEventListeners = useCallback((map) => {
    if (!window.kakao?.maps || isUnmountedRef.current) return

    removeEventListeners()

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

    const zoomListener = window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
      if (isUnmountedRef.current) return
      debouncedZoomHandler(map.getLevel())
    })
    eventListenersRef.current.push(zoomListener)

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

    if (onBoundsChanged) {
      const boundsListener = window.kakao.maps.event.addListener(map, 'bounds_changed', () => {
        if (isUnmountedRef.current) return
        const bounds = map.getBounds()
        const sw = bounds.getSouthWest()
        const ne = bounds.getNorthEast()

        debouncedBoundsHandler({
          southWest: { lat: sw.getLat(), lng: sw.getLng() },
          northEast: { lat: ne.getLat(), lng: ne.getLng() }
        })
      })
      eventListenersRef.current.push(boundsListener)
    }
  }, [onMapClick, debouncedZoomHandler, debouncedCenterHandler, debouncedBoundsHandler, removeEventListeners])

  // 뷰포트 기반 마커 업데이트 효과
  useEffect(() => {
    if (isMapReady && mapInstance.current && allGymsRef.current.length > 0) {
      updateViewportMarkers()
    }
  }, [isMapReady, updateViewportMarkers])

  // 체육관 데이터 변경 시 뷰포트 마커 다시 계산
  useEffect(() => {
    if (isMapReady && mapInstance.current) {
      // 기존 마커 모두 제거
      visibleMarkersRef.current.forEach(marker => {
        try {
          marker.setMap(null)
        } catch (e) {
          console.warn('마커 제거 오류:', e)
        }
      })
      visibleMarkersRef.current.clear()

      // 새로운 데이터로 마커 업데이트
      updateViewportMarkers()
    }
  }, [gyms, isMapReady, updateViewportMarkers])

  // 컴포넌트 정리
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true

      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
        errorTimeoutRef.current = null
      }

      removeEventListeners()

      if (userLocationMarker.current) {
        userLocationMarker.current.setMap(null)
        userLocationMarker.current = null
      }

      // 기존 마커 시스템 정리
      cleanupMarkers()
      gymMarkersRef.current = []

      // 뷰포트 마커 시스템 정리
      visibleMarkersRef.current.forEach(marker => {
        try {
          marker.setMap(null)
        } catch (e) {
          console.warn('가시 마커 정리 오류:', e)
        }
      })
      visibleMarkersRef.current.clear()

      if (mapInstance.current) {
        try {
          window.kakao?.maps?.event?.removeListener(mapInstance.current)
        } catch (e) {
          console.warn('Error removing map listeners:', e)
        }
        mapInstance.current = null
      }

      if (window.gc && typeof window.gc === 'function') {
        setTimeout(() => window.gc(), 100)
      }
    }
  }, [removeEventListeners])

  // 치명적 오류 UI
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
          <Typography variant="h3" sx={{ color: 'error.main', fontWeight: 'bold' }}>
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
          sx={{ color: 'text.disabled', mt: 3, fontSize: '12px' }}
        >
          문제가 지속되면 관리자에게 문의해주세요.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        '& > div': { borderRadius: 1, overflow: 'hidden' },
        ...sx
      }}
    >
      {/* 지도 컨테이너 */}
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}
        role="application"
        aria-label="Kakao 지도"
      />

      {/* 로딩 오버레이 */}
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

      {/* 오류 오버레이 */}
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
            sx={{ width: '100%', maxWidth: 400, mx: 2 }}
          >
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        </Box>
      )}

      {/* 위치 오류 알림 */}
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

      {/* 서킷 브레이커 경고 */}
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

      {/* 줌 컨트롤 */}
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
            disabled={getCurrentZoomLevel() <= 1 || isZooming}
            sx={{
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': { bgcolor: 'grey.50' },
              '&:disabled': { bgcolor: 'grey.100' },
              transition: 'all 0.3s ease',
              opacity: isZooming ? 0.7 : 1
            }}
          >
            {isZooming ? <CircularProgress size={24} /> : <ZoomIn />}
          </IconButton>
          <IconButton
            onClick={handleZoomOut}
            disabled={getCurrentZoomLevel() >= 14 || isZooming}
            sx={{
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': { bgcolor: 'grey.50' },
              '&:disabled': { bgcolor: 'grey.100' },
              transition: 'all 0.3s ease',
              opacity: isZooming ? 0.7 : 1
            }}
          >
            {isZooming ? <CircularProgress size={24} /> : <ZoomOut />}
          </IconButton>
        </Box>
      )}

      {/* 마커 로딩 인디케이터 */}
      {isMarkersLoading && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: 2,
          padding: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <CircularProgress size={32} />
          <Typography variant="caption" color="text.secondary">
            마커 업데이트 중...
          </Typography>
        </Box>
      )}

      {/* 줌 로딩 오버레이 */}
      {isZooming && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(1px)',
          transition: 'all 0.3s ease',
          pointerEvents: 'none'
        }} />
      )}

      {/* 위치 버튼 */}
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
            '&:hover': { bgcolor: 'grey.50' },
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

      {/* 체육관 정보 팝업 */}
      <GymInfoPopup
        gym={popup.gym}
        isOpen={popup.isOpen}
        onClose={handleClosePopup}
        position={popup.position}
        placement="center"
        onNavigateToGymDetail={onNavigateToGymDetail}
      />
    </Box>
  )
}

export default memo(KakaoMap)