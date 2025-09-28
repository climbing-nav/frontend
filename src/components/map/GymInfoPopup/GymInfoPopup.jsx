import { useEffect, useRef, useState } from 'react'
import { 
  Box, 
  Typography, 
  IconButton, 
  Chip, 
  Divider,
  Button,
  Stack
} from '@mui/material'
import { 
  Close as CloseIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  FitnessCenter as GymIcon,
  Star as StarIcon
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import CongestionBadge from '../../common/CongestionBadge'

/**
 * GymInfoPopup Component
 * Displays detailed gym information in a popup overlay
 * 
 * @param {Object} props
 * @param {Object} props.gym - Gym data object
 * @param {boolean} props.isOpen - Whether popup is visible
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.position - Popup position {x, y}
 * @param {Object} props.anchor - Anchor element for positioning
 * @param {string} props.placement - Popup placement ('top', 'bottom', 'left', 'right', 'auto')
 * @param {Function} props.onNavigateToGymDetail - Callback to navigate to gym detail page
 */
function GymInfoPopup({
  gym,
  isOpen = false,
  onClose,
  position = { x: 0, y: 0 },
  anchor = null,
  placement = 'auto',
  onNavigateToGymDetail
}) {
  const popupRef = useRef(null)
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 })
  const [actualPlacement, setActualPlacement] = useState('center')

  // Center popup on screen
  useEffect(() => {
    if (!isOpen || !popupRef.current) return

    const popup = popupRef.current
    const rect = popup.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    console.log(`뷰포트 너비: ${viewportWidth}`)   
    if (viewportWidth <= 430) {
    // Always center the popup
    const newPosition = {
      x: (viewportWidth - rect.width) / 3,
      y: (viewportHeight - rect.height) / 10
    }
    setAdjustedPosition(newPosition)
    setActualPlacement('center')
    } else {
      const newPosition = {
        x: (viewportWidth - rect.width) / 2.1,
        y: (viewportHeight - rect.height) / 2.7
      }
      setAdjustedPosition(newPosition)
      setActualPlacement('center')
    }
  }, [isOpen])


  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) && onClose) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && onClose) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!gym) return null

  // Animation variants
  const popupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: actualPlacement === 'top' ? 20 : actualPlacement === 'bottom' ? -20 : 0,
      x: actualPlacement === 'left' ? 20 : actualPlacement === 'right' ? -20 : 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  // Format operating hours
  const formatOperatingHours = (hours) => {
    if (!hours) return '영업시간 정보 없음'
    if (typeof hours === 'string') return hours
    if (hours.weekdays && hours.weekend) {
      return `평일: ${hours.weekdays}, 주말: ${hours.weekend}`
    }
    return '영업시간 정보 없음'
  }

  // Handle phone call
  const handleCall = () => {
    if (gym.phone) {
      window.location.href = `tel:${gym.phone}`
    }
  }

  // Handle direction navigation
  const handleGetDirections = () => {
    const url = `https://map.kakao.com/link/to/${encodeURIComponent(gym.name)},${gym.lat},${gym.lng}`
    window.open(url, '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              zIndex: 9998,
              pointerEvents: 'auto'
            }}
            onClick={onClose}
          />

          {/* Popup container */}
          <motion.div
            ref={popupRef}
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              left: adjustedPosition.x,
              top: adjustedPosition.y,
              zIndex: 9999,
              maxWidth: 320,
              minWidth: 280,
              maxHeight: '80vh' // 화면 높이의 80%로 제한
            }}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100%'
              }}
            >
              {/* Header */}
              <Box sx={{ 
                p: 2, 
                pb: 1,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                position: 'relative'
              }}>
                <IconButton
                  onClick={onClose}
                  sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, pr: 4 }}>
                  {gym.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CongestionBadge 
                    congestion={gym.congestion}
                    variant="chip"
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: 'text.primary'
                    }}
                  />
                  {gym.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon fontSize="small" />
                      <Typography variant="body2">{gym.rating}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{
                p: 2,
                flex: 1,
                overflowY: 'auto',
                minHeight: 0, // flex item이 정상적으로 축소되도록 함
                maxHeight: 'calc(80vh - 140px)', // 헤더+푸터 높이 제외
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#c1c1c1',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#a8a8a8',
                }
              }}>
                {/* Address */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                  <LocationIcon sx={{ color: 'text.secondary', mt: 0.1 }} fontSize="small" />
                  <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                    {gym.address || '주소 정보 없음'}
                  </Typography>
                </Box>

                {/* Phone */}
                {gym.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PhoneIcon sx={{ color: 'text.secondary' }} fontSize="small" />
                    <Typography 
                      variant="body2" 
                      sx={{ color: 'primary.main', cursor: 'pointer', flex: 1 }}
                      onClick={handleCall}
                    >
                      {gym.phone}
                    </Typography>
                  </Box>
                )}

                {/* Operating Hours */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                  <ScheduleIcon sx={{ color: 'text.secondary', mt: 0.1 }} fontSize="small" />
                  <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                    {formatOperatingHours(gym.operatingHours)}
                  </Typography>
                </Box>

                {/* Tags */}
                {gym.tags && gym.tags.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                      {gym.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '11px',
                            height: 20,
                            color: 'text.secondary',
                            borderColor: 'grey.300'
                          }}
                        />
                      ))}
                    </Stack>
                  </>
                )}

                {/* Facilities */}
                {gym.facilities && gym.facilities.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <GymIcon sx={{ color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        시설
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                      {gym.facilities.map((facility, index) => (
                        <Chip
                          key={index}
                          label={facility}
                          size="small"
                          sx={{
                            fontSize: '11px',
                            height: 20,
                            backgroundColor: 'primary.50',
                            color: 'primary.main'
                          }}
                        />
                      ))}
                    </Stack>
                  </>
                )}

                {/* Description */}
                {gym.description && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                      {gym.description}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Footer Actions */}
              <Box sx={{ 
                p: 2, 
                pt: 1.5, 
                display: 'flex', 
                gap: 1,
                flexShrink: 0, // 축소되지 않도록 고정
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper'
              }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleGetDirections}
                  sx={{ borderRadius: 1.5 }}
                >
                  길찾기
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ 
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)'
                  }}
                  onClick={() => {
                    if (onNavigateToGymDetail) {
                      onNavigateToGymDetail(gym)
                    } else {
                      console.log('Navigate to gym detail:', gym.id)
                    }
                    onClose()
                  }}
                >
                  자세히 보기
                </Button>
              </Box>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

GymInfoPopup.propTypes = {
  gym: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string,
    phone: PropTypes.string,
    congestion: PropTypes.string.isRequired,
    rating: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    facilities: PropTypes.arrayOf(PropTypes.string),
    operatingHours: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    description: PropTypes.string,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  anchor: PropTypes.object,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'auto', 'center']),
  onNavigateToGymDetail: PropTypes.func
}

export default GymInfoPopup