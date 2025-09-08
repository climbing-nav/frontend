import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Container,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Skeleton,
  Alert,
  Grid,
  Paper
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import GymInfo from './GymInfo'
import ImageGallery from './ImageGallery'
import ReviewSection from './ReviewSection'
import ActionButtons from './ActionButtons'

/**
 * GymDetail Component
 * Displays comprehensive gym information with image gallery, reviews, and actions
 * 
 * @param {Object} props
 * @param {Object} props.gym - Gym data object (optional, can be fetched from Redux)
 * @param {Function} props.onBack - Custom back handler (optional)
 * @param {boolean} props.showHeader - Whether to show navigation header
 */
function GymDetail({ 
  gym: propGym = null, 
  onBack = null,
  showHeader = true 
}) {
  const dispatch = useDispatch()
  
  // Redux state
  const {
    gyms,
    selectedGymId,
    isLoading,
    error
  } = useSelector(state => state.gym || {})
  
  const {
    favorites = []
  } = useSelector(state => state.user || {})

  // Local state
  const [isShareLoading, setIsShareLoading] = useState(false)

  // Get gym data (from props or Redux)
  const gym = propGym || gyms.find(g => g.id === selectedGymId)
  const isFavorite = gym ? favorites.includes(gym.id) : false

  // Effects
  useEffect(() => {
    // If no gym data and we have selectedGymId, fetch it
    if (!gym && selectedGymId && !isLoading) {
      // Dispatch action to load gym details
      // dispatch(fetchGymById(selectedGymId))
    }
  }, [gym, selectedGymId, isLoading, dispatch])

  // Handlers
  const handleBack = () => {
    if (onBack) {
      onBack()
    }
  }

  const handleShare = async () => {
    if (!gym) return
    
    setIsShareLoading(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: gym.name,
          text: `${gym.name} - ${gym.address || '클라이밍 짐'}`,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        // Could show a toast notification here
        console.log('링크가 클립보드에 복사되었습니다')
      }
    } catch (error) {
      console.error('공유 실패:', error)
    } finally {
      setIsShareLoading(false)
    }
  }

  const handleToggleFavorite = () => {
    if (!gym) return
    
    if (isFavorite) {
      // dispatch(removeFavorite(gym.id))
    } else {
      // dispatch(addFavorite(gym.id))
    }
  }

  // Loading state
  if (isLoading && !gym) {
    return (
      <Box sx={{ width: '100%', maxWidth: 393, mx: 'auto' }}>
        {showHeader && (
          <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
            <Toolbar sx={{ minHeight: '56px !important', px: 2 }}>
              <IconButton edge="start" onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Skeleton variant="text" width={120} height={24} />
              <Box sx={{ flexGrow: 1 }} />
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={40} height={40} />
            </Toolbar>
          </AppBar>
        )}
        
        <Container maxWidth="sm" sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2, borderRadius: 2 }} />
            <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={20} />
          </Box>
        </Container>
      </Box>
    )
  }

  // Error state
  if (error && !gym) {
    return (
      <Box sx={{ width: '100%', maxWidth: 393, mx: 'auto' }}>
        {showHeader && (
          <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
            <Toolbar sx={{ minHeight: '56px !important', px: 2 }}>
              <IconButton edge="start" onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                오류 발생
              </Typography>
            </Toolbar>
          </AppBar>
        )}
        
        <Container maxWidth="sm" sx={{ p: 2 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            짐 정보를 불러올 수 없습니다. 다시 시도해주세요.
          </Alert>
        </Container>
      </Box>
    )
  }

  // No gym data state
  if (!gym) {
    return (
      <Box sx={{ width: '100%', maxWidth: 393, mx: 'auto' }}>
        {showHeader && (
          <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
            <Toolbar sx={{ minHeight: '56px !important', px: 2 }}>
              <IconButton edge="start" onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                짐을 찾을 수 없음
              </Typography>
            </Toolbar>
          </AppBar>
        )}
        
        <Container maxWidth="sm" sx={{ p: 2 }}>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            요청하신 짐을 찾을 수 없습니다.
          </Alert>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 393, 
      mx: 'auto',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* Navigation Header */}
      {showHeader && (
        <AppBar 
          position="sticky" 
          sx={{ 
            bgcolor: 'white', 
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderBottom: '1px solid',
            borderBottomColor: 'divider'
          }}
        >
          <Toolbar sx={{ minHeight: '56px !important', px: 2 }}>
            <IconButton 
              edge="start" 
              onClick={handleBack} 
              sx={{ mr: 1 }}
              aria-label="뒤로가기"
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600,
                fontSize: '18px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {gym.name}
            </Typography>
            
            <IconButton 
              onClick={handleShare}
              disabled={isShareLoading}
              sx={{ mr: 1 }}
              aria-label="공유하기"
            >
              <ShareIcon />
            </IconButton>
            
            <IconButton 
              onClick={handleToggleFavorite}
              sx={{ 
                color: isFavorite ? 'error.main' : 'text.secondary'
              }}
              aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ p: 0 }}>
        <Box sx={{ pb: 3 }}>
          {/* Placeholder sections - will be implemented in subsequent tasks */}
          
          {/* Image Gallery Section - Task 7.3 */}
          <ImageGallery 
            images={gym.images} 
            gymName={gym.name}
          />

          {/* Gym Information Section - Task 7.2 */}
          <Paper 
            elevation={0} 
            sx={{ 
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <GymInfo gym={gym} />
          </Paper>

          {/* Review Section - Task 7.4 */}
          <Paper 
            elevation={0} 
            sx={{ 
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <ReviewSection 
              reviews={gym.reviews || []}
              overallRating={gym.rating || 0}
              reviewCount={gym.reviewCount || (gym.reviews ? gym.reviews.length : 0)}
              onReviewHelpful={(reviewId) => {
                // Handle review helpful action
                console.log('Review helpful:', reviewId)
                // Could dispatch Redux action here
              }}
            />
          </Paper>

          {/* Action Buttons Section - Task 7.5 */}
          <Paper 
            elevation={0} 
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <ActionButtons
              gym={gym}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
              showBooking={true}
              isAuthenticated={true} // This should come from Redux auth state
            />
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

GymDetail.propTypes = {
  gym: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string,
    phone: PropTypes.string,
    congestion: PropTypes.string,
    rating: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
    reviews: PropTypes.arrayOf(PropTypes.object),
    operatingHours: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    facilities: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  onBack: PropTypes.func,
  showHeader: PropTypes.bool
}

export default GymDetail