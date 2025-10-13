import { Box, Typography, Grid, Paper, Button } from '@mui/material'
import { useEffect, useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import GymCard from '../../components/gym/GymCard/GymCard'

const mockGyms = [
  {
    id: 1,
    name: '어썸클라이밍 강남점',
    address: '서울 강남구 테헤란로',
    tags: ['볼더링', '리드'],
    crowdedness: 'comfortable',
    logo: 'A',
    lat: 37.5012,
    lng: 127.0396
  },
  {
    id: 2,
    name: '볼더링스튜디오 홍대',
    address: '서울 마포구 와우산로',
    tags: ['볼더링', '24시간'],
    crowdedness: 'moderate',
    logo: 'B',
    lat: 37.5563,
    lng: 126.9233
  },
  {
    id: 3,
    name: '클라임플러스 성수',
    address: '서울 성동구 성수일로',
    tags: ['볼더링', '루프톱'],
    crowdedness: 'crowded',
    logo: 'C',
    lat: 37.5443,
    lng: 127.0557
  }
]

// 유틸리티 함수: Haversine 공식으로 거리 계산 (km)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 혼잡도 색상
const getCongestionColor = (congestion) => {
  const colors = {
    comfortable: '#10b981',
    moderate: '#f59e0b',
    crowded: '#ef4444'
  }
  return colors[congestion] || '#9E9E9E'
}

// 암장 마커 SVG 이미지
const createGymMarkerImage = (congestion) => {
  const color = getCongestionColor(congestion)
  const svg = `<svg width="24" height="30" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 30 12 30S24 21 24 12C24 5.4 18.6 0 12 0Z"
          fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="12" cy="12" r="6" fill="white"/>
    <circle cx="12" cy="12" r="3" fill="${color}"/>
  </svg>`
  return 'data:image/svg+xml;base64,' + btoa(svg)
}

// 사용자 위치 마커 SVG
const createUserMarkerImage = () => {
  const svg = `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="12" fill="#2196F3" stroke="white" stroke-width="3"/>
    <circle cx="14" cy="14" r="7" fill="white"/>
    <circle cx="14" cy="14" r="3" fill="#2196F3"/>
  </svg>`
  return 'data:image/svg+xml;base64,' + btoa(svg)
}

function HomePage({ onNavigateToGymList }) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const userMarkerRef = useRef(null)

  const [userLocation, setUserLocation] = useState(null)

  const handleMoreButtonClick = () => {
    if (onNavigateToGymList) {
      onNavigateToGymList()
    }
  }

  // 사용자 위치 가져오기
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        console.warn('위치 정보를 가져올 수 없습니다:', error)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }, [])

  // 가장 가까운 암장 3개 찾기
  const findNearestGyms = useCallback((location, gyms) => {
    if (!location || !gyms || gyms.length === 0) return gyms.slice(0, 3)

    return gyms
      .map(gym => ({
        ...gym,
        distance: calculateDistance(location.lat, location.lng, gym.lat, gym.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
  }, [])

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!window.kakao?.maps) {
      setTimeout(() => {
        if (window.kakao?.maps) {
          initializeMap()
        }
      }, 100)
      return
    }

    initializeMap()

    function initializeMap() {
      if (!mapContainer.current || mapInstance.current) return

      try {
        const defaultCenter = { lat: 37.5665, lng: 126.9780 }
        const options = {
          center: new window.kakao.maps.LatLng(defaultCenter.lat, defaultCenter.lng),
          level: 7,
          draggable: true,
          scrollwheel: false,
          disableDoubleClickZoom: true
        }

        const map = new window.kakao.maps.Map(mapContainer.current, options)
        mapInstance.current = map
      } catch (error) {
        console.error('지도 초기화 실패:', error)
      }
    }
  }, [])

  // 사용자 위치 가져오기
  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current || !window.kakao?.maps) return

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null)
      userMarkerRef.current = null
    }

    const location = userLocation || { lat: 37.5665, lng: 126.9780 }
    const nearestGyms = findNearestGyms(userLocation, mockGyms)

    // 사용자 위치 마커
    if (userLocation) {
      const userPos = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
      const userMarkerImage = new window.kakao.maps.MarkerImage(
        createUserMarkerImage(),
        new window.kakao.maps.Size(28, 28),
        { offset: new window.kakao.maps.Point(14, 14) }
      )

      const userMarker = new window.kakao.maps.Marker({
        position: userPos,
        image: userMarkerImage,
        title: '내 위치',
        zIndex: 100
      })

      userMarker.setMap(mapInstance.current)
      userMarkerRef.current = userMarker
    }

    // 암장 마커들
    nearestGyms.forEach(gym => {
      const position = new window.kakao.maps.LatLng(gym.lat, gym.lng)
      const markerImage = new window.kakao.maps.MarkerImage(
        createGymMarkerImage(gym.crowdedness),
        new window.kakao.maps.Size(24, 30),
        { offset: new window.kakao.maps.Point(12, 30) }
      )

      const marker = new window.kakao.maps.Marker({
        position,
        image: markerImage,
        title: gym.name,
        zIndex: 50
      })

      marker.setMap(mapInstance.current)
      markersRef.current.push(marker)
    })

    // 지도 범위 조정
    const bounds = new window.kakao.maps.LatLngBounds()

    if (userLocation) {
      bounds.extend(new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng))
    }

    nearestGyms.forEach(gym => {
      bounds.extend(new window.kakao.maps.LatLng(gym.lat, gym.lng))
    })

    mapInstance.current.setBounds(bounds, 30, 30, 30, 30)
  }, [userLocation, findNearestGyms])

  // 정리
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker?.setMap(null))
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null)
      }
    }
  }, [])
  
  return (
    <Box sx={{ width: '393px' }}>
      {/* Quick Stats */}
      <Grid container spacing={1.5} sx={{ px: 2, py: 2.5, mt: -1.25, justifyContent: 'space-around'}}>
        <Grid sx={{ width: '45%'}}>
          <Paper sx={{
            p: 2.5,
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: '#667eea',
              mb: 0.5
            }}>
              24
            </Typography>
            <Typography variant="body2" color="text.secondary">
              서울 암장
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ width: '45%'}}>
          <Paper sx={{
            p: 2.5,
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: '#667eea',
              mb: 0.5
            }}>
              12
            </Typography>
            <Typography variant="body2" color="text.secondary">
              쾌적한 곳
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Map Section */}
      <Box sx={{ px: 2, pb: 2.5 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
            내 주변 암장
          </Typography>
          <Button
            variant="text"
            sx={{ color: '#667eea', fontSize: 14, fontWeight: 500 }}
            onClick={handleMoreButtonClick}
          >
            전체보기
          </Button>
        </Box>
        
        <Box sx={{
          height: 200,
          borderRadius: 1.5,
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #e5e7eb'
        }}>
          <div
            ref={mapContainer}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      </Box>

      {/* Gym List */}
      <Box sx={{ px: 2 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
            추천 암장
          </Typography>
          {/* <Button 
            variant="text" 
            sx={{ color: '#667eea', fontSize: 14, fontWeight: 500 }}
            onClick={handleMoreButtonClick}
          >
            더보기
          </Button> */}
        </Box>
        
        {mockGyms.map((gym) => (
          <GymCard key={gym.id} gym={gym} />
        ))}
      </Box>
    </Box>
  )
}

HomePage.propTypes = {
  onNavigateToGymList: PropTypes.func
}

export default HomePage