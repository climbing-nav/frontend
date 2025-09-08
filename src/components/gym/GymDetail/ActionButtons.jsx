import { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider
} from '@mui/material'
import {
  Directions as DirectionsIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  Language as WebsiteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Map as MapIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * ActionButtons Component
 * Interactive action buttons for gym details (directions, contact, booking, etc.)
 */
function ActionButtons({ 
  gym,
  isFavorite = false,
  onToggleFavorite = null,
  onShare = null,
  showBooking = true,
  isAuthenticated = false
}) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', title: '', message: '' })
  const [isSharing, setIsSharing] = useState(false)

  // Handle directions
  const handleDirections = () => {
    if (!gym.lat || !gym.lng) {
      showSnackbar('위치 정보가 없어 길찾기를 할 수 없습니다.', 'warning')
      return
    }

    // Try to detect if user is on mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Try to open native maps app first
      const nativeMapUrl = `maps://maps.google.com/maps?daddr=${gym.lat},${gym.lng}&dirflg=d`
      const googleMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${gym.lat},${gym.lng}`
      
      try {
        // Try native maps app first
        window.location.href = nativeMapUrl
        // Fallback to Google Maps after a short delay
        setTimeout(() => {
          window.open(googleMapUrl, '_blank')
        }, 500)
      } catch (error) {
        // Fallback to Google Maps
        window.open(googleMapUrl, '_blank')
      }
    } else {
      // Desktop: Open Google Maps in new tab
      const googleMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${gym.lat},${gym.lng}`
      window.open(googleMapUrl, '_blank')
    }

    showSnackbar('길찾기 앱을 여는 중...', 'info')
  }

  // Handle phone call
  const handleCall = () => {
    if (!gym.phone) {
      showSnackbar('전화번호가 없습니다.', 'warning')
      return
    }

    setConfirmDialog({
      open: true,
      type: 'call',
      title: '전화 걸기',
      message: `${gym.phone}로 전화를 걸까요?`
    })
  }

  // Handle website visit
  const handleWebsite = () => {
    if (!gym.website) {
      showSnackbar('웹사이트 정보가 없습니다.', 'warning')
      return
    }

    window.open(gym.website, '_blank', 'noopener,noreferrer')
    showSnackbar('웹사이트를 새 창에서 열었습니다.', 'info')
  }

  // Handle booking
  const handleBooking = () => {
    if (!isAuthenticated) {
      showSnackbar('예약하려면 로그인이 필요합니다.', 'warning')
      return
    }

    // This could navigate to a booking page or open a booking modal
    showSnackbar('예약 기능은 준비 중입니다.', 'info')
    console.log('Navigate to booking page for gym:', gym.id)
  }

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      showSnackbar('즐겨찾기를 사용하려면 로그인이 필요합니다.', 'warning')
      return
    }

    if (onToggleFavorite) {
      onToggleFavorite(gym.id)
      showSnackbar(
        isFavorite ? '즐겨찾기에서 제거되었습니다.' : '즐겨찾기에 추가되었습니다.',
        'success'
      )
    }
  }

  // Handle share
  const handleShare = async () => {
    setIsSharing(true)
    
    try {
      const shareData = {
        title: gym.name,
        text: `${gym.name} - ${gym.address || '클라이밍 짐'}`,
        url: window.location.href
      }

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        showSnackbar('공유되었습니다.', 'success')
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        showSnackbar('링크가 클립보드에 복사되었습니다.', 'success')
      }

      if (onShare) {
        onShare(gym.id)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        showSnackbar('공유에 실패했습니다.', 'error')
        console.error('Share failed:', error)
      }
    } finally {
      setIsSharing(false)
    }
  }

  // Handle confirm dialog
  const handleConfirm = () => {
    if (confirmDialog.type === 'call') {
      window.location.href = `tel:${gym.phone}`
      showSnackbar('전화 앱을 여는 중...', 'info')
    }
    setConfirmDialog({ ...confirmDialog, open: false })
  }

  // Show snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity })
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        액션
      </Typography>

      {/* Primary Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          variant="contained"
          fullWidth
          startIcon={<DirectionsIcon />}
          onClick={handleDirections}
          sx={{
            py: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
            }
          }}
        >
          길찾기
        </Button>

        {showBooking && (
          <Button
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variant="outlined"
            fullWidth
            startIcon={<EventIcon />}
            onClick={handleBooking}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                bgcolor: 'primary.50'
              }
            }}
          >
            예약하기
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Secondary Action Buttons */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
        {/* Phone */}
        {gym.phone && (
          <IconButton
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCall}
            sx={{
              flexDirection: 'column',
              gap: 0.5,
              py: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'primary.50',
                borderColor: 'primary.main'
              }
            }}
          >
            <PhoneIcon sx={{ fontSize: 20 }} />
            <Typography variant="caption" sx={{ fontSize: '10px' }}>
              전화
            </Typography>
          </IconButton>
        )}

        {/* Website */}
        {gym.website && (
          <IconButton
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWebsite}
            sx={{
              flexDirection: 'column',
              gap: 0.5,
              py: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'primary.50',
                borderColor: 'primary.main'
              }
            }}
          >
            <WebsiteIcon sx={{ fontSize: 20 }} />
            <Typography variant="caption" sx={{ fontSize: '10px' }}>
              웹사이트
            </Typography>
          </IconButton>
        )}

        {/* Favorite */}
        <IconButton
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteToggle}
          sx={{
            flexDirection: 'column',
            gap: 0.5,
            py: 2,
            border: '1px solid',
            borderColor: isFavorite ? 'error.main' : 'divider',
            borderRadius: 2,
            color: isFavorite ? 'error.main' : 'text.secondary',
            '&:hover': {
              bgcolor: isFavorite ? 'error.50' : 'primary.50',
              borderColor: isFavorite ? 'error.main' : 'primary.main'
            }
          }}
        >
          {isFavorite ? <FavoriteIcon sx={{ fontSize: 20 }} /> : <FavoriteBorderIcon sx={{ fontSize: 20 }} />}
          <Typography variant="caption" sx={{ fontSize: '10px' }}>
            즐겨찾기
          </Typography>
        </IconButton>

        {/* Share */}
        <IconButton
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          disabled={isSharing}
          sx={{
            flexDirection: 'column',
            gap: 0.5,
            py: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'primary.50',
              borderColor: 'primary.main'
            }
          }}
        >
          <ShareIcon sx={{ fontSize: 20 }} />
          <Typography variant="caption" sx={{ fontSize: '10px' }}>
            공유
          </Typography>
        </IconButton>
      </Box>

      {/* Map Integration Button (Optional) */}
      {gym.lat && gym.lng && (
        <>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="text"
            fullWidth
            startIcon={<MapIcon />}
            onClick={() => {
              // This could open an embedded map or navigate to map view
              console.log('Show on map:', gym.lat, gym.lng)
              showSnackbar('지도에서 보기 기능은 준비 중입니다.', 'info')
            }}
            sx={{
              py: 1,
              borderRadius: 2,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'grey.50'
              }
            }}
          >
            지도에서 보기
          </Button>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        PaperProps={{
          sx: { borderRadius: 2, maxWidth: 320 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {confirmDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            sx={{ borderRadius: 1.5 }}
          >
            취소
          </Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained"
            sx={{ borderRadius: 1.5 }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

ActionButtons.propTypes = {
  gym: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string,
    website: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    address: PropTypes.string
  }).isRequired,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
  onShare: PropTypes.func,
  showBooking: PropTypes.bool,
  isAuthenticated: PropTypes.bool
}

export default ActionButtons