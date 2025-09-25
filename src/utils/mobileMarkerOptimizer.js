/**
 * 카카오맵 모바일 최적화 마커 유틸리티
 * 모바일 디바이스에서 메모리 사용량을 줄이고 성능을 향상시킵니다
 */

// 동일한 마커를 재생성하지 않기 위한 간단한 마커 캐시
const markerImageCache = new Map()

// 디바이스 감지
export const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768 ||
         ('ontouchstart' in window && navigator.maxTouchPoints > 0)
}

// 혼잡도 색상 가져오기 (단순화)
const getCongestionColor = (congestion) => {
  const colors = {
    'comfortable': '#10b981',
    'normal': '#f59e0b',
    'crowded': '#ef4444'
  }
  return colors[congestion] || '#9e9e9e'
}

// 모바일용 최적화된 SVG 생성 (훨씬 단순함)
const createMobileFriendlySvg = (congestion, isSelected = false) => {
  const color = getCongestionColor(congestion)
  const size = isSelected ? 28 : 24
  const strokeWidth = isSelected ? 2 : 1

  return `<svg width="${size}" height="${size + 8}" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 32 12 32S24 21 24 12C24 5.4 18.6 0 12 0Z"
          fill="${color}" stroke="white" stroke-width="${strokeWidth}"/>
    <circle cx="12" cy="12" r="6" fill="white"/>
    <circle cx="12" cy="12" r="3" fill="${color}"/>
  </svg>`
}

// 캐싱을 통한 최적화된 마커 이미지 생성
export const createOptimizedMarkerImage = (congestion, isSelected = false) => {
  if (!window.kakao?.maps) return null

  const cacheKey = `${congestion}-${isSelected}`

  if (markerImageCache.has(cacheKey)) {
    return markerImageCache.get(cacheKey)
  }

  const isMobile = isMobileDevice()
  const size = isMobile ? (isSelected ? 28 : 24) : (isSelected ? 32 : 28)
  const height = size + 8

  const svg = isMobile ?
    createMobileFriendlySvg(congestion, isSelected) :
    createMobileFriendlySvg(congestion, isSelected) // 일관성을 위해 동일하게 사용

  const imageSrc = 'data:image/svg+xml;base64,' + btoa(svg)
  const imageSize = new window.kakao.maps.Size(size, height)
  const imageOption = { offset: new window.kakao.maps.Point(size / 2, height) }

  const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

  // 이미지 캐싱 (캐시 크기 제한)
  if (markerImageCache.size < 20) {
    markerImageCache.set(cacheKey, markerImage)
  }

  return markerImage
}

// 마커 재사용을 위한 마커 풀
class MarkerPool {
  constructor(maxSize = 50) {
    this.pool = []
    this.maxSize = maxSize
    this.active = new Set()
  }

  acquire(position, image, title, gymId) {
    let marker

    if (this.pool.length > 0) {
      marker = this.pool.pop()
      marker.setPosition(position)
      marker.setImage(image)
      marker.setTitle(title)
    } else {
      marker = new window.kakao.maps.Marker({
        position,
        image,
        title,
        clickable: true
      })
    }

    marker.gymId = gymId
    this.active.add(marker)
    return marker
  }

  release(marker) {
    if (!marker || !this.active.has(marker)) return

    // 이벤트 리스너 정리
    try {
      window.kakao.maps.event.removeListener(marker, 'click')
      window.kakao.maps.event.removeListener(marker, 'mouseover')
      window.kakao.maps.event.removeListener(marker, 'mouseout')
    } catch (e) {
      console.warn('마커 리스너 제거 오류:', e)
    }

    marker.setMap(null)
    marker.gymId = null
    this.active.delete(marker)

    // 풀이 가득 차지 않았다면 풀로 반환
    if (this.pool.length < this.maxSize) {
      this.pool.push(marker)
    }
  }

  clear() {
    // 모든 활성 마커 해제
    this.active.forEach(marker => this.release(marker))
    this.active.clear()

    // 풀 정리
    this.pool.forEach(marker => {
      try {
        marker.setMap(null)
      } catch (e) {
        console.warn('풀링된 마커 정리 오류:', e)
      }
    })
    this.pool = []
  }
}

// 전역 마커 풀 인스턴스
export const markerPool = new MarkerPool()

// 최적화된 마커 업데이트 함수
export const updateMarkersOptimized = (map, gyms, onGymClick, selectedGymId) => {
  if (!map || !window.kakao?.maps) return []

  const isMobile = isMobileDevice()
  const maxMarkers = isMobile ? 30 : 100 // 모바일에서 마커 수 제한

  // 기존 마커 정리
  markerPool.clear()

  // 모바일 성능을 위해 체육관 수 제한
  const limitedGyms = gyms.slice(0, maxMarkers)

  const markers = limitedGyms.map(gym => {
    if (!gym?.lat || !gym?.lng) return null

    try {
      const position = new window.kakao.maps.LatLng(gym.lat, gym.lng)
      const isSelected = selectedGymId === gym.id
      const markerImage = createOptimizedMarkerImage(gym.congestion, isSelected)

      if (!markerImage) return null

      const marker = markerPool.acquire(position, markerImage, gym.name, gym.id)

      // 간단한 클릭 핸들러 추가 (복잡한 팝업 위치 계산 없음)
      const clickHandler = () => {
        if (onGymClick) {
          onGymClick(gym, marker)
        }
      }

      window.kakao.maps.event.addListener(marker, 'click', clickHandler)
      marker.setMap(map)

      return marker
    } catch (error) {
      console.warn(`체육관 ${gym.name} 마커 생성 오류:`, error)
      return null
    }
  }).filter(Boolean)

  return markers
}

// 컴포넌트 언마운트를 위한 정리 함수
export const cleanupMarkers = () => {
  markerPool.clear()
  markerImageCache.clear()
}

// 메모리 모니터링 (개발용)
export const logMemoryUsage = () => {
  if (performance.memory) {
    console.log('[마커최적화] 메모리 사용량:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB',
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + 'MB',
      cacheSize: markerImageCache.size,
      activeMarkers: markerPool.active.size,
      pooledMarkers: markerPool.pool.length
    })
  }
}