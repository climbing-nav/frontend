/**
 * 간단한 모바일 디버깅 유틸리티
 * 모바일 크롬에서 콘솔로 확인 가능한 디버깅 도구
 */

// 디버그 상태
let isDebugging = false
let debugInterval = null

// 메모리 및 성능 정보 출력
export const logSystemInfo = () => {
  console.group('🔍 시스템 정보')

  // 메모리 정보
  if (performance.memory) {
    const used = Math.round(performance.memory.usedJSHeapSize / 1048576)
    const total = Math.round(performance.memory.totalJSHeapSize / 1048576)
    const limit = Math.round(performance.memory.jsHeapSizeLimit / 1048576)
    const usage = Math.round((used / limit) * 100)

    console.log(`💾 메모리: ${used}MB / ${limit}MB (${usage}%)`)

    // 메모리 경고
    if (usage > 80) {
      console.warn('⚠️ 메모리 사용량이 높습니다!')
    }
  }

  // 디바이스 정보
  console.log(`📱 디바이스: ${navigator.userAgent}`)
  console.log(`🖥️ 화면: ${window.innerWidth}x${window.innerHeight}`)
  console.log(`🔧 CPU 코어: ${navigator.hardwareConcurrency || '알 수 없음'}`)

  if (navigator.deviceMemory) {
    console.log(`💿 디바이스 메모리: ${navigator.deviceMemory}GB`)
  }

  // 네트워크 정보
  if (navigator.connection) {
    const conn = navigator.connection
    console.log(`📶 연결: ${conn.effectiveType}, ${conn.downlink}Mbps`)
  }

  console.groupEnd()
}

// 카카오맵 관련 정보 출력
export const logKakaoMapInfo = () => {
  console.group('🗺️ 카카오맵 상태')

  console.log('Kakao 로드 상태:', !!window.kakao)
  console.log('Kakao Maps 로드 상태:', !!(window.kakao && window.kakao.maps))

  if (window.kakao && window.kakao.maps) {
    console.log('✅ 카카오맵 API 정상 로드됨')
  } else {
    console.error('❌ 카카오맵 API 로드 실패')
  }

  // DOM에서 지도 컨테이너 찾기
  const mapContainers = document.querySelectorAll('[role="application"][aria-label*="지도"], div[style*="kakao"]')
  console.log(`🎯 지도 컨테이너 개수: ${mapContainers.length}`)

  mapContainers.forEach((container, index) => {
    const rect = container.getBoundingClientRect()
    console.log(`지도 ${index + 1}: ${rect.width}x${rect.height}`)
  })

  console.groupEnd()
}

// 에러 감지 및 로깅
export const setupErrorTracking = () => {
  // JavaScript 에러 추적
  window.addEventListener('error', (event) => {
    console.group('🚨 JavaScript 에러')
    console.error('메시지:', event.message)
    console.error('파일:', event.filename)
    console.error('라인:', event.lineno, '컬럼:', event.colno)
    console.error('에러 객체:', event.error)
    console.groupEnd()

    // 메모리 정보도 함께 출력
    logSystemInfo()
  })

  // Promise rejection 추적
  window.addEventListener('unhandledrejection', (event) => {
    console.group('🚨 Promise Rejection')
    console.error('이유:', event.reason)
    console.groupEnd()
  })

  console.log('✅ 에러 추적 활성화됨')
}

// 실시간 모니터링 시작
export const startRealTimeMonitoring = (interval = 5000) => {
  if (isDebugging) {
    console.log('⚠️ 이미 모니터링 중입니다.')
    return
  }

  isDebugging = true
  console.log('🔍 실시간 모니터링 시작')

  debugInterval = setInterval(() => {
    console.clear() // 콘솔 정리 (선택사항)
    console.log(`⏰ ${new Date().toLocaleTimeString()}`)
    logSystemInfo()
    logKakaoMapInfo()

    // 메모리 임계값 확인
    if (performance.memory) {
      const usage = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
      if (usage > 90) {
        console.warn('🚨 메모리 위험 수준!')
        console.warn('페이지 새로고침을 권장합니다.')
      }
    }
  }, interval)
}

// 모니터링 중지
export const stopRealTimeMonitoring = () => {
  if (debugInterval) {
    clearInterval(debugInterval)
    debugInterval = null
    isDebugging = false
    console.log('✅ 실시간 모니터링 중지됨')
  }
}

// 모든 디버깅 시작
export const startMobileDebugging = () => {
  console.log('🔍 모바일 디버깅 시작')
  setupErrorTracking()
  startRealTimeMonitoring()

  // 전역에서 사용 가능하도록 설정
  window.mobileDebug = {
    logSystemInfo,
    logKakaoMapInfo,
    startRealTimeMonitoring,
    stopRealTimeMonitoring
  }

  console.log('💡 사용법:')
  console.log('- window.mobileDebug.logSystemInfo() : 시스템 정보')
  console.log('- window.mobileDebug.logKakaoMapInfo() : 카카오맵 정보')
  console.log('- window.mobileDebug.stopRealTimeMonitoring() : 모니터링 중지')
}

export default { startMobileDebugging }