// API URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Congestion levels
export const CONGESTION_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  VERY_HIGH: 'very_high'
}

export const CONGESTION_COLORS = {
  [CONGESTION_LEVELS.LOW]: '#4CAF50',
  [CONGESTION_LEVELS.MEDIUM]: '#FF9800', 
  [CONGESTION_LEVELS.HIGH]: '#FF5722',
  [CONGESTION_LEVELS.VERY_HIGH]: '#F44336'
}

export const CONGESTION_LABELS = {
  [CONGESTION_LEVELS.LOW]: '여유',
  [CONGESTION_LEVELS.MEDIUM]: '보통',
  [CONGESTION_LEVELS.HIGH]: '혼잡',
  [CONGESTION_LEVELS.VERY_HIGH]: '매우혼잡'
}

// Navigation tabs
export const NAVIGATION_TABS = {
  HOME: 'home',
  MAP: 'map',
  COMMUNITY: 'community', 
  PROFILE: 'mypage'
}

// Seoul districts
export const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
  '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
  '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
]

// Default map center (Seoul City Hall)
export const DEFAULT_MAP_CENTER = {
  lat: 37.5665,
  lng: 126.9780
}