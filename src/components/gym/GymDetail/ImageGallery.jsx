import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Skeleton,
  Alert
} from '@mui/material'
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * ImageGallery Component
 * Interactive image gallery with swipe support, thumbnails, and fullscreen modal
 */
function ImageGallery({ images = [], gymName = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [imageLoading, setImageLoading] = useState({})
  const [imageErrors, setImageErrors] = useState({})
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const galleryRef = useRef(null)

  // Handle touch events for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return
    
    const distance = touchStart.x - touchEnd.x
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : prev))
  }

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index)
  }

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true)
    setZoom(1)
  }

  const handleFullscreenClose = () => {
    setFullscreenOpen(false)
    setZoom(1)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 1))
  }

  // Image loading handlers
  const handleImageLoad = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: false }))
  }

  const handleImageError = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: false }))
    setImageErrors(prev => ({ ...prev, [index]: true }))
  }

  const handleImageLoadStart = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: true }))
  }

  // Initialize loading state
  useEffect(() => {
    const initialLoadingState = {}
    images.forEach((_, index) => {
      initialLoadingState[index] = true
    })
    setImageLoading(initialLoadingState)
  }, [images])

  // Handle keyboard navigation in fullscreen
  useEffect(() => {
    const handleKeydown = (e) => {
      if (!fullscreenOpen) return
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          handleNext()
          break
        case 'Escape':
          handleFullscreenClose()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [fullscreenOpen])

  // No images state
  if (!images || images.length === 0) {
    return (
      <Box 
        sx={{ 
          height: 250, 
          bgcolor: 'grey.100', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          mb: 2
        }}
      >
        <Typography variant="body2" color="text.secondary">
          이미지가 없습니다
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* Main Gallery */}
      <Box
        ref={galleryRef}
        sx={{
          position: 'relative',
          height: 250,
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          bgcolor: 'black'
        }}
        onClick={handleFullscreenOpen}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
            {imageLoading[currentIndex] && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ position: 'absolute', top: 0, left: 0 }}
              />
            )}
            
            {imageErrors[currentIndex] ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.200'
                }}
              >
                <Alert severity="error" variant="outlined">
                  이미지를 불러올 수 없습니다
                </Alert>
              </Box>
            ) : (
              <img
                src={images[currentIndex]}
                alt={`${gymName} 이미지 ${currentIndex + 1}`}
                onLoad={() => handleImageLoad(currentIndex)}
                onError={() => handleImageError(currentIndex)}
                onLoadStart={() => handleImageLoadStart(currentIndex)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: imageLoading[currentIndex] ? 'none' : 'block'
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              disabled={currentIndex === 0}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                },
                '&:disabled': {
                  bgcolor: 'rgba(0,0,0,0.3)',
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              disabled={currentIndex === images.length - 1}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                },
                '&:disabled': {
                  bgcolor: 'rgba(0,0,0,0.3)',
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}

        {/* Image Counter */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: '12px',
            fontWeight: 500
          }}
        >
          {currentIndex + 1} / {images.length}
        </Box>
      </Box>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 2,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 4
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'grey.200',
              borderRadius: 2
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.400',
              borderRadius: 2
            }
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                minWidth: 60,
                height: 40,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: 2,
                borderColor: currentIndex === index ? 'primary.main' : 'transparent',
                opacity: currentIndex === index ? 1 : 0.7,
                transition: 'all 0.2s ease',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              <img
                src={image}
                alt={`썸네일 ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Fullscreen Modal */}
      <Modal
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { bgcolor: 'rgba(0,0,0,0.9)' }
        }}
      >
        <Fade in={fullscreenOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none'
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={handleFullscreenClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 1,
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Zoom Controls */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                display: 'flex',
                gap: 1,
                zIndex: 1
              }}
            >
              <IconButton
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <ZoomOutIcon />
              </IconButton>
              <IconButton
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <ZoomInIcon />
              </IconButton>
            </Box>

            {/* Fullscreen Image */}
            <Box
              sx={{
                maxWidth: '90%',
                maxHeight: '90%',
                transform: `scale(${zoom})`,
                transition: 'transform 0.3s ease',
                overflow: 'hidden'
              }}
            >
              <img
                src={images[currentIndex]}
                alt={`${gymName} 이미지 ${currentIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>

            {/* Navigation in Fullscreen */}
            {images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                
                <IconButton
                  onClick={handleNext}
                  disabled={currentIndex === images.length - 1}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  gymName: PropTypes.string
}

export default ImageGallery