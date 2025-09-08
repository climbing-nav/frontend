import { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Rating,
  LinearProgress,
  Avatar,
  Divider,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  Stack,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import {
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  Sort as SortIcon,
  Star as StarIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * ReviewSection Component
 * Displays gym reviews with rating breakdown, sorting, and individual review cards
 */
function ReviewSection({ 
  reviews = [], 
  overallRating = 0, 
  reviewCount = 0,
  onReviewHelpful = null,
  showLoadMore = false,
  onLoadMore = null
}) {
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, highest, lowest, helpful
  const [visibleReviews, setVisibleReviews] = useState(5)

  // Calculate rating breakdown
  const ratingBreakdown = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        breakdown[Math.floor(review.rating)]++
      }
    })

    return breakdown
  }, [reviews])

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews]
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating)
      case 'helpful':
        return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount)
      default:
        return sorted
    }
  }, [reviews, sortBy])

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value)
  }

  // Handle helpful click
  const handleHelpfulClick = (reviewId) => {
    if (onReviewHelpful) {
      onReviewHelpful(reviewId)
    }
  }

  // Handle load more
  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore()
    } else {
      setVisibleReviews(prev => prev + 5)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // No reviews state
  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          리뷰 및 평점
        </Typography>
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 4,
            bgcolor: 'grey.50',
            borderRadius: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            아직 리뷰가 없습니다.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            첫 번째 리뷰를 작성해보세요!
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        리뷰 및 평점
      </Typography>

      {/* Overall Rating Summary */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {overallRating.toFixed(1)}
          </Typography>
          <Box>
            <Rating 
              value={overallRating} 
              precision={0.1} 
              readOnly 
              size="medium"
              sx={{ color: 'warning.main', mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {reviewCount}개의 리뷰
            </Typography>
          </Box>
        </Box>

        {/* Rating Breakdown */}
        <Box sx={{ maxWidth: 300 }}>
          {[5, 4, 3, 2, 1].map((star) => (
            <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ minWidth: 20 }}>
                {star}
              </Typography>
              <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              <LinearProgress
                variant="determinate"
                value={(ratingBreakdown[star] / reviewCount) * 100}
                sx={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'warning.main',
                    borderRadius: 3
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30 }}>
                {ratingBreakdown[star]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Sort Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          리뷰 ({reviews.length})
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            displayEmpty
            startAdornment={<SortIcon sx={{ mr: 1, fontSize: 16 }} />}
            sx={{ fontSize: '14px' }}
          >
            <MenuItem value="newest">최신순</MenuItem>
            <MenuItem value="oldest">오래된순</MenuItem>
            <MenuItem value="highest">높은 평점순</MenuItem>
            <MenuItem value="lowest">낮은 평점순</MenuItem>
            <MenuItem value="helpful">도움순</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Review List */}
      <Stack spacing={2}>
        {sortedReviews.slice(0, visibleReviews).map((review, index) => (
          <Card
            key={review.id}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            elevation={0}
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Review Header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Avatar 
                  src={review.userAvatar}
                  alt={review.userName}
                  sx={{ width: 40, height: 40 }}
                >
                  {review.userName.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {review.userName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Rating 
                      value={review.rating} 
                      readOnly 
                      size="small"
                      sx={{ color: 'warning.main' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(review.date)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Review Content */}
              <Typography 
                variant="body2" 
                sx={{ 
                  lineHeight: 1.6,
                  mb: 2,
                  color: 'text.primary'
                }}
              >
                {review.content}
              </Typography>

              {/* Review Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  startIcon={review.isHelpful ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  onClick={() => handleHelpfulClick(review.id)}
                  sx={{ 
                    color: review.isHelpful ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: 'primary.50'
                    }
                  }}
                >
                  도움됨 {review.helpfulCount}
                </Button>
                
                {review.rating >= 4.5 && (
                  <Chip
                    label="추천 리뷰"
                    size="small"
                    sx={{
                      fontSize: '11px',
                      height: 20,
                      backgroundColor: 'success.50',
                      color: 'success.main'
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Load More Button */}
      {(visibleReviews < sortedReviews.length || showLoadMore) && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            sx={{ 
              minWidth: 120,
              borderRadius: 2
            }}
          >
            더 보기
          </Button>
        </Box>
      )}
    </Box>
  )
}

ReviewSection.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userAvatar: PropTypes.string,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    helpfulCount: PropTypes.number,
    isHelpful: PropTypes.bool
  })),
  overallRating: PropTypes.number,
  reviewCount: PropTypes.number,
  onReviewHelpful: PropTypes.func,
  showLoadMore: PropTypes.bool,
  onLoadMore: PropTypes.func
}

export default ReviewSection