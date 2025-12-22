import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material'
import PropTypes from 'prop-types'

/**
 * ImageCarousel Component
 * 게시글 상세 페이지에서 여러 이미지를 슬라이드로 표시하는 컴포넌트
 *
 * @param {Object} props
 * @param {string[]} props.images - 이미지 URL 배열
 */
function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  const handlePrev = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
      {/* Main Image */}
      <Box
        component="img"
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        sx={{
          width: '100%',
          maxHeight: 450,
          objectFit: 'contain',
          bgcolor: '#000',
          display: 'block'
        }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/450x450?text=Image+Not+Found'
        }}
      />

      {/* Navigation Arrows (only if multiple images) */}
      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.95)'
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Right Arrow */}
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.95)'
              }
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Dot Indicators */}
          <Box sx={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            px: 1.5,
            py: 0.5,
            borderRadius: 10
          }}>
            {images.map((_, idx) => (
              <Box
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                sx={{
                  width: idx === currentIndex ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: idx === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>

          {/* Counter */}
          <Box sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 10,
            fontSize: '0.875rem'
          }}>
            {currentIndex + 1} / {images.length}
          </Box>
        </>
      )}
    </Box>
  )
}

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default ImageCarousel
