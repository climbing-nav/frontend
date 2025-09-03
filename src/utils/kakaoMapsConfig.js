/**
 * Kakao Maps Configuration utilities
 * Handles API key management and map initialization settings
 */

// Get Kakao Maps API key from environment variables
export const getKakaoMapsApiKey = () => {
  // Try different environment variable names for flexibility
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY || 
                 import.meta.env.REACT_APP_KAKAO_API_KEY ||
                 import.meta.env.VITE_KAKAO_API_KEY ||
                 import.meta.env.VITE_KAKAO_APP_KEY

  if (!apiKey) {
    console.warn('Kakao Maps API key not found in environment variables')
    return null
  }

  return apiKey
}

// Validate API key format (basic validation)
export const isValidKakaoApiKey = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false
  }
  
  // Basic format validation (Kakao keys are typically 32+ characters)
  return apiKey.length >= 10 && !/\s/.test(apiKey)
}

// Default map configuration
export const DEFAULT_MAP_CONFIG = {
  // Seoul City Hall coordinates
  center: {
    lat: 37.5665,
    lng: 126.9780
  },
  level: 3, // Zoom level (1-14)
  draggable: true,
  scrollwheel: true,
  disableDoubleClick: false,
  disableDoubleClickZoom: false,
  projectionId: 'wcong' // World Coordinate System
}

// Map styling presets
export const MAP_STYLES = {
  default: {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  },
  mobile: {
    width: '100%',
    height: '300px',
    borderRadius: '8px'
  },
  fullscreen: {
    width: '100vw',
    height: '100vh',
    borderRadius: 0
  }
}

// Check if we're in development mode for API key warnings
export const isDevelopment = () => {
  return import.meta.env.MODE === 'development'
}

// Create map initialization URL with API key
export const createKakaoMapsScriptUrl = (apiKey, options = {}) => {
  if (!isValidKakaoApiKey(apiKey)) {
    throw new Error('Invalid Kakao Maps API key')
  }

  const baseUrl = '//dapi.kakao.com/v2/maps/sdk.js'
  const params = new URLSearchParams({
    appkey: apiKey,
    autoload: options.autoload !== undefined ? options.autoload.toString() : 'false',
    ...options.libraries && { libraries: options.libraries.join(',') }
  })

  return `${baseUrl}?${params.toString()}`
}

// Error messages
export const KAKAO_MAPS_ERRORS = {
  API_KEY_MISSING: 'Kakao Maps API 키가 설정되지 않았습니다.',
  API_KEY_INVALID: 'Kakao Maps API 키가 유효하지 않습니다.',
  SDK_LOAD_FAILED: 'Kakao Maps SDK 로드에 실패했습니다.',
  INITIALIZATION_FAILED: 'Kakao Maps 초기화에 실패했습니다.',
  NETWORK_ERROR: '네트워크 연결 오류로 인해 지도를 로드할 수 없습니다.',
  CONTAINER_NOT_FOUND: '지도 컨테이너 엘리먼트를 찾을 수 없습니다.'
}

export default {
  getKakaoMapsApiKey,
  isValidKakaoApiKey,
  DEFAULT_MAP_CONFIG,
  MAP_STYLES,
  isDevelopment,
  createKakaoMapsScriptUrl,
  KAKAO_MAPS_ERRORS
}