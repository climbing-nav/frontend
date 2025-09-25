import { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { createOptimizedMarkerImage, isMobileDevice } from '../../../utils/mobileMarkerOptimizer'

/**
 * SimpleMobileMarker 컴포넌트
 * 모바일 환경에서 최적화된 간단한 체육관 마커
 * 복잡한 애니메이션과 SVG를 피하고 성능을 우선시합니다
 */
function SimpleMobileMarker({
  gym,
  map,
  onClick = null,
  isSelected = false,
  showPopup = false
}) {
  // 필수 props 검증
  if (!gym || !map || !window.kakao || !window.kakao.maps) {
    return null
  }

  // 체육관 데이터 구조 검증
  const requiredFields = ['id', 'name', 'lat', 'lng', 'congestion']
  const missingFields = requiredFields.filter(field => !(field in gym))

  if (missingFields.length > 0) {
    console.warn(`[SimpleMobileMarker] 필수 체육관 필드 누락: ${missingFields.join(', ')}`)
    return null
  }

  // 마커 위치 생성
  const markerPosition = useMemo(() => {
    return new window.kakao.maps.LatLng(gym.lat, gym.lng)
  }, [gym.lat, gym.lng])

  // 최적화된 마커 이미지 생성
  const markerImage = useMemo(() => {
    return createOptimizedMarkerImage(gym.congestion, isSelected)
  }, [gym.congestion, isSelected])

  // 마커 인스턴스 생성
  const marker = useMemo(() => {
    if (!markerImage || !markerPosition) return null

    const markerInstance = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
      title: gym.name,
      zIndex: isSelected ? 100 : 50,
      clickable: true
    })

    // 체육관 데이터 참조 저장
    markerInstance.gymData = gym
    markerInstance.gymId = gym.id

    return markerInstance
  }, [markerImage, markerPosition, gym, isSelected])

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(() => {
    if (onClick) {
      onClick(gym, marker)
    }
  }, [gym, marker, onClick])

  // 이벤트 리스너 설정 (간단함)
  useMemo(() => {
    if (!marker) return

    // 클릭 이벤트만 추가 (마우스 오버/아웃 없음으로 성능 향상)
    window.kakao.maps.event.addListener(marker, 'click', handleMarkerClick)

    // 지도에 마커 추가
    marker.setMap(map)

    // 정리 함수
    return () => {
      if (marker) {
        window.kakao.maps.event.removeListener(marker, 'click', handleMarkerClick)
        marker.setMap(null)
      }
    }
  }, [marker, map, handleMarkerClick])

  // 언마운트 시 정리
  useMemo(() => {
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  // 모바일용 간단한 마커는 팝업을 렌더링하지 않음
  // 팝업은 상위 컴포넌트에서 처리
  return null
}

SimpleMobileMarker.propTypes = {
  gym: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    congestion: PropTypes.oneOf(['comfortable', 'normal', 'crowded']).isRequired
  }).isRequired,
  map: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  showPopup: PropTypes.bool
}

SimpleMobileMarker.defaultProps = {
  onClick: null,
  isSelected: false,
  showPopup: false
}

export default SimpleMobileMarker