import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import GymInfoPopup from '../GymInfoPopup'

/**
 * GymMarker Component
 * Creates and manages individual gym markers for Kakao Maps
 * 
 * @param {Object} props
 * @param {Object} props.gym - Gym data object
 * @param {number} props.gym.id - Unique gym identifier
 * @param {string} props.gym.name - Gym name
 * @param {number} props.gym.lat - Latitude coordinate
 * @param {number} props.gym.lng - Longitude coordinate
 * @param {string} props.gym.congestion - Congestion status ('comfortable', 'normal', 'crowded')
 * @param {string} props.gym.address - Gym address
 * @param {Array} props.gym.tags - Array of gym feature tags
 * @param {string} props.gym.phone - Gym phone number
 * @param {Object} props.map - Kakao Map instance
 * @param {Function} props.onClick - Click event handler
 * @param {Function} props.onMouseEnter - Mouse enter event handler
 * @param {Function} props.onMouseLeave - Mouse leave event handler
 * @param {boolean} props.isSelected - Whether this marker is currently selected
 * @param {boolean} props.showLabel - Whether to show gym name label
 * @param {number} props.zIndex - Marker z-index (higher values appear on top)
 */
function GymMarker({
  gym,
  map,
  onClick = null,
  onMouseEnter = null,
  onMouseLeave = null,
  isSelected = false,
  showLabel = false,
  showPopup = true,
  zIndex = 0
}) {
  // Popup state management
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  // Validate required props
  if (!gym || !map || !window.kakao || !window.kakao.maps) {
    return null
  }

  // Validate gym data structure
  const requiredGymFields = ['id', 'name', 'lat', 'lng', 'congestion']
  const missingFields = requiredGymFields.filter(field => !(field in gym))
  
  if (missingFields.length > 0) {
    console.warn(`[GymMarker] Missing required gym fields: ${missingFields.join(', ')}`)
    return null
  }

  // Enhanced congestion configuration with accessibility
  const getCongestionConfig = useCallback((congestion) => {
    const configMap = {
      'comfortable': {
        color: '#10b981',
        label: '쾌적',
        icon: '😊',
        description: '여유로운 상태'
      },
      'normal': {
        color: '#f59e0b',
        label: '보통',
        icon: '😐',
        description: '적당한 이용객'
      },
      'crowded': {
        color: '#ef4444',
        label: '혼잡',
        icon: '😰',
        description: '많은 이용객'
      },
      'unknown': {
        color: '#9e9e9e',
        label: '알 수 없음',
        icon: '❓',
        description: '정보 없음'
      }
    }
    return configMap[congestion] || configMap.unknown
  }, [])

  // Get congestion color (backward compatibility)
  const getCongestionColor = useCallback((congestion) => {
    return getCongestionConfig(congestion).color
  }, [getCongestionConfig])

  // Create marker SVG with enhanced congestion visualization
  const markerSvg = useMemo(() => {
    const congestionConfig = getCongestionConfig(gym.congestion)
    const size = isSelected ? 40 : 32
    const height = isSelected ? 50 : 40
    const strokeWidth = isSelected ? 3 : 1.5
    const strokeColor = isSelected ? '#1976d2' : '#ffffff'
    
    // Add subtle gradient for depth
    const gradientId = `gradient-${gym.id}-${Date.now()}`
    
    return `
      <svg width="${size}" height="${height}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="${gradientId}" cx="50%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:${congestionConfig.color};stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:${congestionConfig.color};stop-opacity:1" />
          </radialGradient>
          <filter id="shadow-${gym.id}" x="-20%" y="-20%" width="140%" height="140%">
            <dropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.2"/>
          </filter>
        </defs>
        
        <!-- Main marker shape with gradient -->
        <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40S32 28 32 16C32 7.16 24.84 0 16 0Z" 
              fill="url(#${gradientId})" 
              stroke="${strokeColor}" 
              stroke-width="${strokeWidth}"
              filter="url(#shadow-${gym.id})"/>
        
        <!-- Inner circle (white background for icon) -->
        <circle cx="16" cy="16" r="8" fill="white" stroke="${congestionConfig.color}" stroke-width="0.5"/>
        
        <!-- Gym icon (simplified climbing hold) -->
        <path d="M12 12L20 12L20 20L12 20Z" fill="${congestionConfig.color}" rx="1"/>
        <circle cx="16" cy="16" r="2" fill="white"/>
        
        <!-- Status indicator dot -->
        <circle cx="24" cy="8" r="4" fill="${congestionConfig.color}" stroke="white" stroke-width="1.5"/>
        <text x="24" y="8" text-anchor="middle" dominant-baseline="central" 
              font-size="8" fill="white">${congestionConfig.icon}</text>
      </svg>
    `
  }, [gym.congestion, gym.id, isSelected, getCongestionConfig])

  // Create marker image
  const markerImage = useMemo(() => {
    if (!window.kakao || !window.kakao.maps) return null

    const size = isSelected ? 40 : 32
    const height = isSelected ? 50 : 40
    const imageSrc = 'data:image/svg+xml;base64,' + btoa(markerSvg)
    const imageSize = new window.kakao.maps.Size(size, height)
    const imageOption = { 
      offset: new window.kakao.maps.Point(size / 2, height)
    }
    
    return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
  }, [markerSvg, isSelected])

  // Create marker position
  const markerPosition = useMemo(() => {
    if (!window.kakao || !window.kakao.maps) return null
    return new window.kakao.maps.LatLng(gym.lat, gym.lng)
  }, [gym.lat, gym.lng])

  // Create marker instance
  const marker = useMemo(() => {
    if (!markerImage || !markerPosition) return null

    const markerInstance = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
      title: gym.name,
      zIndex: isSelected ? 100 + zIndex : zIndex,
      clickable: true
    })

    // Store gym data reference
    markerInstance.gymData = gym
    markerInstance.gymId = gym.id

    return markerInstance
  }, [markerImage, markerPosition, gym, isSelected, zIndex])

  // Handle marker click with popup positioning
  const handleMarkerClick = useCallback((event) => {
    // Calculate popup position from marker position
    const projection = map.getProjection()
    const point = projection.pointFromCoord(markerPosition)
    const mapCenter = map.getCenter()
    const mapCenterPoint = projection.pointFromCoord(mapCenter)
    
    // Get map container position
    const mapContainer = map.getContainer()
    const mapRect = mapContainer.getBoundingClientRect()
    
    // Calculate screen position
    const offsetX = point.x - mapCenterPoint.x
    const offsetY = point.y - mapCenterPoint.y
    
    const screenX = mapRect.left + mapRect.width / 2 + offsetX
    const screenY = mapRect.top + mapRect.height / 2 + offsetY
    
    setPopupPosition({ x: screenX, y: screenY })
    setIsPopupOpen(true)
    
    // Call external onClick handler if provided
    if (onClick) {
      onClick(gym, marker, event)
    }
  }, [map, markerPosition, gym, marker, onClick])

  // Close popup handler
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false)
  }, [])

  // Set up event listeners
  useMemo(() => {
    if (!marker || !window.kakao || !window.kakao.maps) return

    // Enhanced click event with popup handling
    const clickHandler = showPopup ? handleMarkerClick : () => {
      if (onClick) {
        onClick(gym, marker)
      }
    }
    
    window.kakao.maps.event.addListener(marker, 'click', clickHandler)

    // Mouse events for hover effects
    if (onMouseEnter) {
      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        onMouseEnter(gym, marker)
      })
    }

    if (onMouseLeave) {
      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        onMouseLeave(gym, marker)
      })
    }

    // Add marker to map
    marker.setMap(map)

    // Cleanup function
    return () => {
      if (marker) {
        window.kakao.maps.event.removeListener(marker, 'click', clickHandler)
        window.kakao.maps.event.removeListener(marker, 'mouseover')
        window.kakao.maps.event.removeListener(marker, 'mouseout')
        marker.setMap(null)
      }
    }
  }, [marker, map, gym, showPopup, handleMarkerClick, onClick, onMouseEnter, onMouseLeave])

  // Create label if needed
  const label = useMemo(() => {
    if (!showLabel || !marker || !window.kakao || !window.kakao.maps) return null

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: markerPosition,
      content: `
        <div style="
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          color: #333;
          border: 1px solid #ddd;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          white-space: nowrap;
          margin-top: -50px;
          text-align: center;
        ">
          ${gym.name}
        </div>
      `,
      yAnchor: 1,
      xAnchor: 0.5,
      zIndex: 1000
    })

    customOverlay.setMap(map)
    return customOverlay
  }, [showLabel, marker, markerPosition, gym.name, map])

  // Cleanup on unmount
  useMemo(() => {
    return () => {
      if (marker) {
        marker.setMap(null)
      }
      if (label) {
        label.setMap(null)
      }
    }
  }, [marker, label])

  // Render popup if enabled
  return showPopup ? (
    <GymInfoPopup
      gym={gym}
      isOpen={isPopupOpen}
      onClose={handleClosePopup}
      position={popupPosition}
      placement="auto"
    />
  ) : null
}

// Gym data shape validation
GymMarker.propTypes = {
  gym: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    congestion: PropTypes.oneOf(['comfortable', 'normal', 'crowded']).isRequired,
    address: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    phone: PropTypes.string,
    description: PropTypes.string,
    operatingHours: PropTypes.object,
    facilities: PropTypes.arrayOf(PropTypes.string),
    pricing: PropTypes.object
  }).isRequired,
  map: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  isSelected: PropTypes.bool,
  showLabel: PropTypes.bool,
  showPopup: PropTypes.bool,
  zIndex: PropTypes.number
}

// Default props
GymMarker.defaultProps = {
  onClick: null,
  onMouseEnter: null,
  onMouseLeave: null,
  isSelected: false,
  showLabel: false,
  showPopup: true,
  zIndex: 0
}

export default GymMarker