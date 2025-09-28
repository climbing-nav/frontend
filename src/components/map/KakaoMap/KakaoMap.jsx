import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { Box, CircularProgress, Alert, Typography, Fab, IconButton } from '@mui/material'
import { MyLocation, ZoomIn, ZoomOut } from '@mui/icons-material'
import GymInfoPopup from '../GymInfoPopup'
import { cleanupMarkers, isMobileDevice } from '../../../utils/mobileMarkerOptimizer'

// 유틸리티 함수들
const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

const getCongestionColor = (congestion) => {
  const colors = {
    comfortable: '#4CAF50',
    normal: '#FF9800',
    crowded: '#F44336'
  }
  return colors[congestion] || '#9E9E9E'
}

const createUserMarkerImage = () => {
  const svg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#FF0000" stroke="white" stroke-width="3"/>
    <circle cx="16" cy="16" r="8" fill="white"/>
    <circle cx="16" cy="16" r="4" fill="#FF0000"/>
  </svg>`
  return 'data:image/svg+xml;base64,' + btoa(svg)
}

const createGymMarkerImage = (congestion) => {
  const color = getCongestionColor(congestion)
  const svg = `<svg width="24" height="30" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 30 12 30S24 21 24 12C24 5.4 18.6 0 12 0Z"
          fill="${color}" stroke="white" stroke-width="1"/>
    <circle cx="12" cy="12" r="6" fill="white"/>
    <circle cx="12" cy="12" r="3" fill="${color}"/>
  </svg>`
  return 'data:image/svg+xml;base64,' + btoa(svg)
}

/**
 * KakaoMap 컴포넌트 - 카카오 지도 API를 사용한 뷰포트 기반 마커 시스템
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
  // Refs
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const userLocationMarker = useRef(null)
  const eventListenersRef = useRef([])
  const isUnmountedRef = useRef(false)
  const lastZoomLevelRef = useRef(level)
  const markerUpdateMutex = useRef(false)
  const errorCountRef = useRef(0)
  const errorTimeoutRef = useRef(null)
  const visibleMarkersRef = useRef(new Map())

  // 상수
  const MAX_ERRORS = 3
  const ERROR_RESET_TIME = 30000
  const CRITICAL_ERROR_THRESHOLD = 5

  // 상태 (통합 및 최적화)
  const [state, setState] = useState({
    isLoading: true,
    error: null,
    isKakaoLoaded: false,
    userLocation: null,
    locationLoading: false,
    locationError: null,
    isCriticalError: false,
    circuitBreakerOpen: false,
    isMapReady: false,
    isZooming: false,
    isMarkersLoading: false
  })

  const [popup, setPopup] = useState({
    gym: null,
    isOpen: false,
    position: { x: 0, y: 0 }
  })

  // 상태 업데이트 헬퍼
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // 콜백 refs (최신 값 유지)
  const callbacksRef = useRef({})

  // 체육관 데이터 저장
  useEffect(() => {
    isUnmountedRef.current = false
  }, [gyms])

  // 에러 추적
  const trackError = useCallback((errorType = 'general') => {
    errorCountRef.current += 1

    if (errorCountRef.current >= CRITICAL_ERROR_THRESHOLD) {
      updateState({ isCriticalError: true, circuitBreakerOpen: true })
      if (!window.kakaoMapAlertShown) {
        window.kakaoMapAlertShown = true
        alert('지도 서비스에 문제가 발생했습니다.\n페이지를 새로고침해주세요.')
      }
      return true
    }

    if (errorCountRef.current >= MAX_ERRORS) {
      updateState({ circuitBreakerOpen: true })
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)

      errorTimeoutRef.current = setTimeout(() => {
        errorCountRef.current = 0
        updateState({ circuitBreakerOpen: false })
      }, ERROR_RESET_TIME)
      return true
    }
    return false
  }, [updateState])

  // 뷰포트 기반 마커 관리
  const isMarkerInBounds = useCallback((lat, lng, bounds) => {
    if (!bounds) return false
    return bounds.contain(new window.kakao.maps.LatLng(lat, lng))
  }, [])

  const removeInvisibleMarkers = useCallback((bounds) => {
    const toRemove = []
    visibleMarkersRef.current.forEach((marker, gymId) => {
      const gym = gyms.find(g => g.id === gymId)
      if (!gym || !isMarkerInBounds(gym.lat, gym.lng, bounds)) {
        try {
          marker.setMap(null)
        } catch (e) {
          console.warn('마커 제거 오류:', e)
        }
        toRemove.push(gymId)
      }
    })
    toRemove.forEach(id => visibleMarkersRef.current.delete(id))
  }, [gyms, isMarkerInBounds])

  const addVisibleMarkers = useCallback((bounds) => {
    if (!mapInstance.current || !bounds) return

    gyms.forEach(gym => {
      if (visibleMarkersRef.current.has(gym.id) ||
          !gym?.lat || !gym?.lng ||
          !isMarkerInBounds(gym.lat, gym.lng, bounds)) return

      try {
        const position = new window.kakao.maps.LatLng(gym.lat, gym.lng)
        const markerImage = new window.kakao.maps.MarkerImage(
          createGymMarkerImage(gym.congestion),
          new window.kakao.maps.Size(24, 30),
          { offset: new window.kakao.maps.Point(12, 30) }
        )

        const marker = new window.kakao.maps.Marker({
          position,
          image: markerImage,
          title: gym.name,
          zIndex: popup.gym?.id === gym.id ? 100 : 50
        })

        window.kakao.maps.event.addListener(marker, 'click', () => {
          if (isUnmountedRef.current) return
          setPopup({
            gym,
            isOpen: true,
            position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
          })
          if (onGymClick) onGymClick(gym)
        })

        marker.setMap(mapInstance.current)
        visibleMarkersRef.current.set(gym.id, marker)
      } catch (error) {
        console.warn(`마커 생성 실패: ${gym.name}`, error)
      }
    })
  }, [gyms, isMarkerInBounds, popup.gym?.id, onGymClick])

  // 뷰포트 마커 업데이트
  const updateViewportMarkers = useCallback(() => {
    if (!mapInstance.current || isUnmountedRef.current ||
        !window.kakao?.maps || markerUpdateMutex.current) return

    markerUpdateMutex.current = true
    updateState({ isMarkersLoading: true })

    try {
      const bounds = mapInstance.current.getBounds()
      if (!bounds) return

      removeInvisibleMarkers(bounds)
      addVisibleMarkers(bounds)

      // 사용자 위치 마커 보호
      if (userLocationMarker.current) {
        const markerMap = userLocationMarker.current.getMap()
        if (!markerMap && mapInstance.current) {
          userLocationMarker.current.setMap(mapInstance.current)
        }
        userLocationMarker.current.setZIndex(9999)

        // 강제 재추가
        try {
          userLocationMarker.current.setMap(null)
          userLocationMarker.current.setMap(mapInstance.current)
        } catch (e) {
          console.warn('사용자 마커 재추가 오류:', e)
        }
      }
    } catch (error) {
      console.error('뷰포트 마커 업데이트 오류:', error)
      trackError('viewport-marker-update-failed')
    } finally {
      markerUpdateMutex.current = false
      setTimeout(() => updateState({ isMarkersLoading: false }), 150)
    }
  }, [removeInvisibleMarkers, addVisibleMarkers, trackError, updateState])

  // 콜백 refs 업데이트 (모든 함수 정의 후)
  callbacksRef.current = {
    onMapClick,
    onZoomChanged,
    onCenterChanged,
    onBoundsChanged,
    updateViewportMarkers,
    updateState
  }

  // 사용자 위치 마커 업데이트
  const updateUserLocationMarker = useCallback((location) => {
    if (!mapInstance.current || !window.kakao?.maps || isUnmountedRef.current) return

    try {
      const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng)

      if (userLocationMarker.current) {
        userLocationMarker.current.setPosition(markerPosition)
        mapInstance.current.setCenter(markerPosition)
        return
      }

      const markerImage = new window.kakao.maps.MarkerImage(
        createUserMarkerImage(),
        new window.kakao.maps.Size(32, 32),
        { offset: new window.kakao.maps.Point(16, 16) }
      )

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
        title: '내 위치'
      })

      marker.setMap(mapInstance.current)
      marker.setZIndex(9999)
      userLocationMarker.current = marker
      mapInstance.current.setCenter(markerPosition)
    } catch (error) {
      console.error('사용자 위치 마커 생성 오류:', error)
    }
  }, [])

  // 카카오 API 로드 확인
  useEffect(() => {
    if (state.isCriticalError || state.isKakaoLoaded) return

    let intervalId = null
    let attempts = 0
    const maxAttempts = 20

    const checkKakaoMaps = () => {
      attempts++
      if (window.kakao?.maps?.LatLng) {
        updateState({ isKakaoLoaded: true })
        if (intervalId) clearInterval(intervalId)
        return
      }

      if (attempts >= maxAttempts) {
        const errorMessage = 'Kakao Maps를 로드할 수 없습니다. 페이지를 새로고침해주세요.'
        const shouldStop = trackError('kakao-maps-load-failed')
        if (!shouldStop) {
          updateState({ error: errorMessage, isLoading: false })
          if (onError) onError(new Error(errorMessage))
        }
        if (intervalId) clearInterval(intervalId)
      }
    }

    checkKakaoMaps()
    intervalId = setInterval(checkKakaoMaps, 500)
    return () => { if (intervalId) clearInterval(intervalId) }
  }, [trackError, onError, state.isCriticalError, state.isKakaoLoaded, updateState])

  // 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (state.isCriticalError || !state.isKakaoLoaded || !mapContainer.current || mapInstance.current) return

    try {
      updateState({ isLoading: true, error: null })

      if (mapContainer.current.offsetWidth === 0) {
        setTimeout(() => {
          if (mapContainer.current?.offsetWidth > 0 && !mapInstance.current) {
            try {
              const options = {
                center: new window.kakao.maps.LatLng(center.lat, center.lng),
                level: level
              }
              const map = new window.kakao.maps.Map(mapContainer.current, options)
              mapInstance.current = map
              updateState({ isLoading: false, isMapReady: true })
              if (onMapReady) onMapReady(map)
            } catch (retryError) {
              updateState({ error: `지도 초기화 재시도 실패: ${retryError.message}`, isLoading: false })
            }
          }
        }, 100)
        return
      }

      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: level
      }

      const map = new window.kakao.maps.Map(mapContainer.current, options)
      mapInstance.current = map
      updateState({ isLoading: false, isMapReady: true })

      if (onMapReady) onMapReady(map)

    } catch (error) {
      const errorMessage = `Kakao Map 초기화 실패: ${error.message}`
      const shouldStop = trackError('kakao-map-init-failed')
      if (!shouldStop) {
        updateState({ error: errorMessage, isLoading: false })
        if (onError) onError(error)
      }
    }
  }, [state.isKakaoLoaded, state.isCriticalError]) // 의존성 배열 최소화

  // 이벤트 리스너 설정 (지도 준비 완료 후)
  useEffect(() => {
    if (!state.isMapReady || !mapInstance.current) return

    // 디바운스된 핸들러들
    const debouncedZoomHandler = debounce((level) => {
      if (isUnmountedRef.current || lastZoomLevelRef.current === level) return
      lastZoomLevelRef.current = level
      callbacksRef.current.updateState({ isZooming: false })
      callbacksRef.current.updateViewportMarkers()
      if (callbacksRef.current.onZoomChanged) callbacksRef.current.onZoomChanged(level)
    }, 250)

    const debouncedCenterHandler = debounce((center) => {
      if (isUnmountedRef.current) return
      callbacksRef.current.updateViewportMarkers()
      if (callbacksRef.current.onCenterChanged) callbacksRef.current.onCenterChanged(center)
    }, 300)

    const debouncedBoundsHandler = debounce((bounds) => {
      if (isUnmountedRef.current || !callbacksRef.current.onBoundsChanged) return
      callbacksRef.current.onBoundsChanged(bounds)
    }, 200)

    // 이벤트 리스너 등록
    const listeners = [
      callbacksRef.current.onMapClick && window.kakao.maps.event.addListener(mapInstance.current, 'click', callbacksRef.current.onMapClick),
      window.kakao.maps.event.addListener(mapInstance.current, 'zoom_changed', () => {
        if (!isUnmountedRef.current) debouncedZoomHandler(mapInstance.current.getLevel())
      }),
      window.kakao.maps.event.addListener(mapInstance.current, 'center_changed', () => {
        if (!isUnmountedRef.current) {
          const center = mapInstance.current.getCenter()
          debouncedCenterHandler({ lat: center.getLat(), lng: center.getLng() })
        }
      }),
      window.kakao.maps.event.addListener(mapInstance.current, 'bounds_changed', () => {
        if (!isUnmountedRef.current) debouncedBoundsHandler(mapInstance.current.getBounds())
      })
    ].filter(Boolean)

    eventListenersRef.current = listeners

    return () => {
      listeners.forEach(listener => {
        if (listener?.remove) listener.remove()
      })
    }
  }, [state.isMapReady]) // 의존성 최소화로 무한 루프 방지

  // 지도 중심/레벨 업데이트
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng))
    }
  }, [center.lat, center.lng])

  useEffect(() => {
    if (mapInstance.current) mapInstance.current.setLevel(level)
  }, [level])

  // 위치 정보 기능 (통합 및 최적화)
  const getCurrentLocation = useCallback(() => {
    if (state.circuitBreakerOpen || state.isCriticalError || !navigator.geolocation) {
      if (!navigator.geolocation) {
        const error = new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.')
        updateState({ locationError: error.message })
        trackError('geolocation-not-supported')
        if (onLocationError) onLocationError(error)
      }
      return
    }

    updateState({ locationLoading: true, locationError: null })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const location = { lat: latitude, lng: longitude }

        const hasSignificantChange = !state.userLocation ||
          Math.abs(state.userLocation.lat - location.lat) > 0.0001 ||
          Math.abs(state.userLocation.lng - location.lng) > 0.0001

        if (hasSignificantChange) {
          updateState({ userLocation: location })
          if (onLocationFound) onLocationFound(location)
          if (mapInstance.current && showUserLocation) {
            updateUserLocationMarker(location)
          }
        }
        updateState({ locationLoading: false, locationError: null })
      },
      (error) => {
        updateState({ locationLoading: false })
        const shouldStop = trackError('geolocation-error')
        if (shouldStop) return

        const errorMessages = {
          [error.PERMISSION_DENIED]: '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.',
          [error.POSITION_UNAVAILABLE]: '위치 정보를 사용할 수 없습니다.',
          [error.TIMEOUT]: '위치 요청 시간이 초과되었습니다.'
        }

        const errorMessage = errorMessages[error.code] || `위치 오류: ${error.message}`
        updateState({ locationError: errorMessage })
        if (onLocationError) onLocationError(error)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [showUserLocation, onLocationFound, onLocationError, state.circuitBreakerOpen, state.isCriticalError, state.userLocation, trackError, updateUserLocationMarker, updateState])

  // 사용자 위치 가져오기
  useEffect(() => {
    if (mapInstance.current && showUserLocation && !state.userLocation && !state.locationLoading) {
      getCurrentLocation()
    }
  }, [mapInstance.current, showUserLocation, state.userLocation, state.locationLoading, getCurrentLocation])

  // 줌 컨트롤 (최적화)
  const centerToUserLocation = useCallback(() => {
    if (state.userLocation && mapInstance.current) {
      const position = new window.kakao.maps.LatLng(state.userLocation.lat, state.userLocation.lng)
      mapInstance.current.setCenter(position)
    } else {
      getCurrentLocation()
    }
  }, [state.userLocation, getCurrentLocation])

  const handleZoom = useCallback((direction) => {
    if (!mapInstance.current || state.isZooming) return

    const currentLevel = mapInstance.current.getLevel()
    const newLevel = direction === 'in' ? currentLevel - 1 : currentLevel + 1

    if ((direction === 'in' && currentLevel <= 1) || (direction === 'out' && currentLevel >= 14)) return

    updateState({ isZooming: true })
    mapInstance.current.setLevel(newLevel, { animate: { duration: 350 } })
    setTimeout(() => updateState({ isZooming: false }), 400)
  }, [state.isZooming, updateState])

  const getCurrentZoomLevel = useCallback(() => {
    return mapInstance.current ? mapInstance.current.getLevel() : level
  }, [level])

  // 뷰포트 마커 업데이트 효과
  useEffect(() => {
    if (state.isMapReady && mapInstance.current && gyms.length > 0) {
      updateViewportMarkers()
    }
  }, [state.isMapReady, updateViewportMarkers])

  useEffect(() => {
    if (state.isMapReady && mapInstance.current) {
      visibleMarkersRef.current.forEach(marker => {
        try { marker.setMap(null) } catch (e) { console.warn('마커 제거 오류:', e) }
      })
      visibleMarkersRef.current.clear()
      updateViewportMarkers()
    }
  }, [gyms, state.isMapReady, updateViewportMarkers])

  // 컴포넌트 정리
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)

      eventListenersRef.current.forEach(listener => {
        if (listener?.remove) listener.remove()
      })

      if (userLocationMarker.current) {
        userLocationMarker.current.setMap(null)
        userLocationMarker.current = null
      }

      cleanupMarkers()
      visibleMarkersRef.current.forEach(marker => {
        try { marker.setMap(null) } catch (e) { console.warn('가시 마커 정리 오류:', e) }
      })
      visibleMarkersRef.current.clear()

      if (mapInstance.current) {
        try {
          window.kakao?.maps?.event?.removeListener(mapInstance.current)
        } catch (e) {
          console.warn('맵 리스너 제거 오류:', e)
        }
        mapInstance.current = null
      }
    }
  }, [])

  // 치명적 오류 UI
  if (state.isCriticalError) {
    return (
      <Box sx={{ width, height, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}>
        <Alert severity="error" sx={{ maxWidth: '400px' }}>
          <Typography variant="h6">지도 서비스 오류</Typography>
          <Typography variant="body2">페이지를 새로고침해주세요.</Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ width, height, position: 'relative', borderRadius: 1, overflow: 'hidden', ...sx }}>
      {/* 지도 컨테이너 */}
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%', borderRadius: '4px', position: 'relative', transition: 'all 0.3s ease' }}
        role="application"
        aria-label="Kakao 지도"
      />

      {/* 로딩 오버레이 */}
      {state.isLoading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255, 255, 255, 0.9)', zIndex: 1000 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">지도를 불러오는 중...</Typography>
          </Box>
        </Box>
      )}

      {/* 에러 표시 */}
      {state.error && !state.isLoading && (
        <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 1001 }}>
          <Alert severity="error" onClose={() => updateState({ error: null })}>
            {state.error}
          </Alert>
        </Box>
      )}

      {/* 줌 컨트롤 */}
      {showZoomControls && !state.isLoading && !state.error && (
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <IconButton
            onClick={() => handleZoom('in')}
            disabled={getCurrentZoomLevel() <= 1 || state.isZooming}
            sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', '&:hover': { bgcolor: 'grey.50' }, '&:disabled': { bgcolor: 'grey.100' }, transition: 'all 0.3s ease', opacity: state.isZooming ? 0.7 : 1 }}
          >
            {state.isZooming ? <CircularProgress size={24} /> : <ZoomIn />}
          </IconButton>
          <IconButton
            onClick={() => handleZoom('out')}
            disabled={getCurrentZoomLevel() >= 14 || state.isZooming}
            sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', '&:hover': { bgcolor: 'grey.50' }, '&:disabled': { bgcolor: 'grey.100' }, transition: 'all 0.3s ease', opacity: state.isZooming ? 0.7 : 1 }}
          >
            {state.isZooming ? <CircularProgress size={24} /> : <ZoomOut />}
          </IconButton>
        </Box>
      )}

      {/* 마커 로딩 인디케이터 */}
      {state.isMarkersLoading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1001, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: 2, padding: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <CircularProgress size={32} />
          <Typography variant="caption" color="text.secondary">마커 업데이트 중...</Typography>
        </Box>
      )}

      {/* 줌 로딩 오버레이 */}
      {state.isZooming && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(1px)', transition: 'all 0.3s ease', pointerEvents: 'none' }} />
      )}

      {/* 위치 버튼 */}
      {showLocationButton && !state.isLoading && !state.error && (
        <Fab
          size="small"
          color="primary"
          onClick={centerToUserLocation}
          disabled={state.locationLoading}
          sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000 }}
        >
          {state.locationLoading ? <CircularProgress size={24} color="inherit" /> : <MyLocation />}
        </Fab>
      )}

      {/* 체육관 정보 팝업 */}
      {popup.isOpen && popup.gym && (
        <GymInfoPopup
          gym={popup.gym}
          isOpen={popup.isOpen}
          onClose={() => setPopup({ gym: null, isOpen: false, position: { x: 0, y: 0 } })}
          position={popup.position}
          onNavigateToGymDetail={onNavigateToGymDetail}
        />
      )}
    </Box>
  )
}

export default memo(KakaoMap)