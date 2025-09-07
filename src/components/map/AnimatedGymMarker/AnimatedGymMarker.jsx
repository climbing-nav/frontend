import { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import GymInfoPopup from '../GymInfoPopup'
import { useGymMarkers } from '../../../hooks/useGymMarkers'

/**
 * AnimatedGymMarker Component
 * Enhanced GymMarker with Framer Motion animations and Redux integration
 * 
 * @param {Object} props - Component props
 * @param {Object} props.gym - Gym data object
 * @param {Object} props.map - Kakao Map instance
 * @param {Function} props.onClick - External click handler
 * @param {boolean} props.showPopup - Whether to show popup on click
 * @param {boolean} props.animated - Whether to enable animations
 */
function AnimatedGymMarker({
  gym,
  map,
  onClick = null,
  showPopup = true,
  animated = true
}) {
  // Redux integration
  const { 
    selectedGymId, 
    handleGymClick, 
    isGymSelected,
    isLoading,
    hasError
  } = useGymMarkers()

  // Local state
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [bounceAnimation, setBounceAnimation] = useState(false)
  
  // Refs
  const markerRef = useRef(null)
  const animationTimeoutRef = useRef(null)

  // Validate required props
  if (!gym || !map || !window.kakao || !window.kakao.maps) {
    return null
  }

  const isSelected = isGymSelected(gym.id)

  // Enhanced congestion configuration with animations
  const getCongestionConfig = useCallback((congestion) => {
    const configMap = {
      'comfortable': {
        color: '#10b981',
        glowColor: '#10b981',
        label: '쾌적',
        icon: '😊',
        description: '여유로운 상태',
        pulseIntensity: 0.1
      },
      'normal': {
        color: '#f59e0b',
        glowColor: '#f59e0b',
        label: '보통',
        icon: '😐',
        description: '적당한 이용객',
        pulseIntensity: 0.15
      },
      'crowded': {
        color: '#ef4444',
        glowColor: '#ef4444',
        label: '혼잡',
        icon: '😰',
        description: '많은 이용객',
        pulseIntensity: 0.25
      },
      'unknown': {
        color: '#9e9e9e',
        glowColor: '#9e9e9e',
        label: '알 수 없음',
        icon: '❓',
        description: '정보 없음',
        pulseIntensity: 0.05
      }
    }
    return configMap[congestion] || configMap.unknown
  }, [])

  // Create animated marker SVG
  const createAnimatedMarkerSvg = useMemo(() => {
    const congestionConfig = getCongestionConfig(gym.congestion)
    const size = isSelected ? 48 : (isHovered ? 38 : 32)
    const height = isSelected ? 60 : (isHovered ? 47 : 40)
    const strokeWidth = isSelected ? 3 : (isHovered ? 2 : 1.5)
    const strokeColor = isSelected ? '#1976d2' : (isHovered ? '#1976d2' : '#ffffff')
    
    const gradientId = `animated-gradient-${gym.id}-${Date.now()}`
    const glowId = `glow-${gym.id}`
    
    return `
      <svg width="${size}" height="${height}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Animated gradient -->
          <radialGradient id="${gradientId}" cx="50%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:${congestionConfig.color};stop-opacity:0.8" />
            <stop offset="70%" style="stop-color:${congestionConfig.color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${congestionConfig.color};stop-opacity:0.9" />
          </radialGradient>
          
          <!-- Glow effect for hover/selection -->
          <filter id="${glowId}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
          
          <!-- Drop shadow -->
          <filter id="shadow-${gym.id}" x="-20%" y="-20%" width="140%" height="140%">
            <dropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
          </filter>
          
          <!-- Pulse animation for congestion -->
          <circle id="pulse-${gym.id}" cx="16" cy="16" r="20" fill="${congestionConfig.glowColor}" opacity="0">
            <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;${congestionConfig.pulseIntensity};0" dur="2s" repeatCount="indefinite"/>
          </circle>
        </defs>
        
        <!-- Pulse ring (only for crowded gyms) -->
        ${gym.congestion === 'crowded' ? `<use href="#pulse-${gym.id}"/>` : ''}
        
        <!-- Main marker shape -->
        <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40S32 28 32 16C32 7.16 24.84 0 16 0Z" 
              fill="url(#${gradientId})" 
              stroke="${strokeColor}" 
              stroke-width="${strokeWidth}"
              filter="${isHovered || isSelected ? `url(#${glowId})` : `url(#shadow-${gym.id})`}"/>
        
        <!-- Inner circle -->
        <circle cx="16" cy="16" r="8" fill="white" stroke="${congestionConfig.color}" stroke-width="1"/>
        
        <!-- Gym icon -->
        <rect x="12" y="12" width="8" height="8" fill="${congestionConfig.color}" rx="1"/>
        <circle cx="16" cy="16" r="2" fill="white"/>
        
        <!-- Status indicator -->
        <circle cx="25" cy="9" r="4" fill="${congestionConfig.color}" stroke="white" stroke-width="2"/>
        <text x="25" y="9" text-anchor="middle" dominant-baseline="central" 
              font-size="7" fill="white">${congestionConfig.icon}</text>
        
        <!-- Selection indicator -->
        ${isSelected ? `
          <circle cx="16" cy="16" r="12" fill="none" stroke="#1976d2" stroke-width="2" opacity="0.7">
            <animate attributeName="r" values="12;15;12" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1s" repeatCount="indefinite"/>
          </circle>
        ` : ''}
      </svg>
    `
  }, [gym.congestion, gym.id, isSelected, isHovered, getCongestionConfig])

  // Create marker image with animation support
  const markerImage = useMemo(() => {
    if (!window.kakao || !window.kakao.maps) return null

    const size = isSelected ? 48 : (isHovered ? 38 : 32)
    const height = isSelected ? 60 : (isHovered ? 47 : 40)
    
    const imageSrc = 'data:image/svg+xml;base64,' + btoa(createAnimatedMarkerSvg)
    const imageSize = new window.kakao.maps.Size(size, height)
    const imageOption = { 
      offset: new window.kakao.maps.Point(size / 2, height)
    }
    
    return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
  }, [createAnimatedMarkerSvg, isSelected, isHovered])

  // Create marker position
  const markerPosition = useMemo(() => {
    if (!window.kakao || !window.kakao.maps) return null
    return new window.kakao.maps.LatLng(gym.lat, gym.lng)
  }, [gym.lat, gym.lng])

  // Create marker instance with animation support
  const marker = useMemo(() => {
    if (!markerImage || !markerPosition) return null

    const markerInstance = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
      title: gym.name,
      zIndex: isSelected ? 1000 : (isHovered ? 100 : 50),
      clickable: true
    })

    // Store data references
    markerInstance.gymData = gym
    markerInstance.gymId = gym.id
    markerRef.current = markerInstance

    return markerInstance
  }, [markerImage, markerPosition, gym, isSelected, isHovered])

  // Handle marker click with animations
  const handleMarkerClickWithAnimation = useCallback((event) => {
    // Trigger bounce animation
    if (animated) {
      setBounceAnimation(true)
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
      animationTimeoutRef.current = setTimeout(() => {
        setBounceAnimation(false)
      }, 600)
    }

    // Calculate popup position
    if (showPopup && map && markerPosition) {
      const projection = map.getProjection()
      const point = projection.pointFromCoord(markerPosition)
      const mapCenter = map.getCenter()
      const mapCenterPoint = projection.pointFromCoord(mapCenter)
      
      const mapContainer = map.getContainer()
      const mapRect = mapContainer.getBoundingClientRect()
      
      const offsetX = point.x - mapCenterPoint.x
      const offsetY = point.y - mapCenterPoint.y
      
      const screenX = mapRect.left + mapRect.width / 2 + offsetX
      const screenY = mapRect.top + mapRect.height / 2 + offsetY - 20
      
      setPopupPosition({ x: screenX, y: screenY })
      setIsPopupOpen(true)
    }

    // Call Redux handler
    handleGymClick(gym, marker, event)
    
    // Call external handler if provided
    if (onClick) {
      onClick(gym, marker, event)
    }
  }, [animated, showPopup, map, markerPosition, handleGymClick, gym, marker, onClick])

  // Handle mouse enter with hover animations
  const handleMouseEnter = useCallback(() => {
    if (animated) {
      setIsHovered(true)
    }
  }, [animated])

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (animated) {
      setIsHovered(false)
    }
  }, [animated])

  // Close popup handler
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false)
  }, [])

  // Set up event listeners with animation support
  useEffect(() => {
    if (!marker || !window.kakao || !window.kakao.maps || !map) return

    // Enhanced click handler
    window.kakao.maps.event.addListener(marker, 'click', handleMarkerClickWithAnimation)

    // Mouse events for hover animations
    if (animated) {
      window.kakao.maps.event.addListener(marker, 'mouseover', handleMouseEnter)
      window.kakao.maps.event.addListener(marker, 'mouseout', handleMouseLeave)
    }

    // Add marker to map with fade-in animation
    marker.setMap(map)

    return () => {
      // Cleanup
      if (marker) {
        window.kakao.maps.event.removeListener(marker, 'click', handleMarkerClickWithAnimation)
        if (animated) {
          window.kakao.maps.event.removeListener(marker, 'mouseover', handleMouseEnter)
          window.kakao.maps.event.removeListener(marker, 'mouseout', handleMouseLeave)
        }
        marker.setMap(null)
      }
      
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [marker, map, animated, handleMarkerClickWithAnimation, handleMouseEnter, handleMouseLeave])

  // Update marker when states change (for animation)
  useEffect(() => {
    if (marker && markerImage) {
      marker.setImage(markerImage)
      marker.setZIndex(isSelected ? 1000 : (isHovered ? 100 : 50))
    }
  }, [marker, markerImage, isSelected, isHovered])

  // Auto-close popup when gym selection changes
  useEffect(() => {
    if (isPopupOpen && selectedGymId !== gym.id) {
      setIsPopupOpen(false)
    }
  }, [isPopupOpen, selectedGymId, gym.id])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Loading/Error states
  if (isLoading && !marker) {
    return null // Show loading state could be added here
  }

  if (hasError) {
    console.warn(`[AnimatedGymMarker] Error state for gym ${gym.id}:`, hasError)
  }

  // Render animated popup
  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <GymInfoPopup
            gym={gym}
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
            position={popupPosition}
            placement="auto"
          />
        </motion.div>
      )}
      
      {/* Bounce animation effect overlay */}
      {animated && bounceAnimation && (
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0, 0.3, 0] 
          }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut" 
          }}
          style={{
            position: 'fixed',
            left: popupPosition.x - 25,
            top: popupPosition.y - 25,
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: getCongestionConfig(gym.congestion).color,
            pointerEvents: 'none',
            zIndex: 9999
          }}
        />
      )}
    </AnimatePresence>
  )
}

AnimatedGymMarker.propTypes = {
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
  showPopup: PropTypes.bool,
  animated: PropTypes.bool
}

AnimatedGymMarker.defaultProps = {
  onClick: null,
  showPopup: true,
  animated: true
}

export default AnimatedGymMarker