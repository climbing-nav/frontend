import { useState } from 'react'
import { Box, Typography, Alert } from '@mui/material'
import KakaoMap from '../../components/map/KakaoMap'
import { mockGyms } from '../../data/mockGyms'

function MapPage() {
  const [mapInstance, setMapInstance] = useState(null)
  const [error, setError] = useState(null)
  const [mapLevel, setMapLevel] = useState(3)
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }) // 서울시청
  const [userLocation, setUserLocation] = useState(null)

  const handleMapReady = (map) => {
    console.log('Map is ready:', map)
    setMapInstance(map)
    setError(null)
  }

  const handleMapError = (error) => {
    console.error('Map error:', error)
    setError('지도를 불러올 수 없습니다. 네트워크 연결을 확인해주세요.')
  }

  const handleLocationFound = (location) => {
    console.log('User location found:', location)
    setUserLocation(location)
  }

  const handleLocationError = (error) => {
    console.error('Location error:', error)
  }

  const handleGymClick = (gym) => {
    console.log('Gym clicked:', gym)
    // TODO: Show gym detail modal or navigate to gym detail page
    alert(`${gym.name} 클릭됨!\n혼잡도: ${gym.congestion}\n평점: ${gym.rating}`)
  }

  const handleMapClick = (position) => {
    console.log('Map clicked at:', position)
  }

  const handleZoomChanged = (level) => {
    console.log('Zoom changed to:', level)
    setMapLevel(level)
  }

  const handleCenterChanged = (center) => {
    console.log('Center changed to:', center)
    setMapCenter(center)
  }

  const handleBoundsChanged = (bounds) => {
    console.log('Bounds changed:', bounds)
  }


  return (
    <Box sx={{ 
      position: 'relative',
      width: '393px',
      height: 'calc(100vh - 120px)', // Header와 BottomNav 공간 제외
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e0e0e0',
        p: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          클라이밍 짐 지도
        </Typography>
        <Typography variant="caption" color="text.secondary">
          주변 클라이밍 짐을 찾아보세요
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{
          position: 'absolute',
          top: 80,
          left: 16,
          right: 16,
          zIndex: 1000
        }}>
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* Map Container */}
      <Box sx={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }}>
        <KakaoMap
          width="100%"
          height="100%"
          center={mapCenter}
          level={mapLevel}
          showUserLocation={true}
          showLocationButton={true}
          showZoomControls={true}
          gyms={mockGyms}
          onMapReady={handleMapReady}
          onLocationFound={handleLocationFound}
          onLocationError={handleLocationError}
          onGymClick={handleGymClick}
          onMapClick={handleMapClick}
          onZoomChanged={handleZoomChanged}
          onCenterChanged={handleCenterChanged}
          onBoundsChanged={handleBoundsChanged}
          onError={handleMapError}
        />
      </Box>


      {/* Map Level Indicator */}
      <Box sx={{
        position: 'absolute',
        bottom: 50
        ,
        left: 16,
        zIndex: 1000,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        px: 2,
        py: 1,
        borderRadius: 2,
        fontSize: '0.75rem'
      }}>
        줌 레벨: {mapLevel}
      </Box>
    </Box>
  )
}

export default MapPage