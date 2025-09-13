import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Box,
  Collapse
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import { likePost, unlikePost, bookmarkPost, unbookmarkPost } from '../../../store/slices/communitySlice'

// Category labels mapping
const CATEGORY_LABELS = {
  'general': '일반',
  'climbing-tips': '클라이밍 팁',
  'gear-review': '장비 리뷰',
  'route-info': '루트 정보',
  'gym-review': '짐 리뷰',
  'technique': '기술 공유',
  'safety': '안전 수칙',
  'community': '커뮤니티'
}

// Category colors
const CATEGORY_COLORS = {
  'general': '#667eea',
  'climbing-tips': '#f093fb',
  'gear-review': '#4facfe',
  'route-info': '#43e97b',
  'gym-review': '#fa709a',
  'technique': '#ffecd2',
  'safety': '#ff9a9e',
  'community': '#a8edea'
}

function PostCard({ 
  post,
  onCardClick = () => {},
  onCommentClick = () => {},
  onShareClick = () => {}
}) {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)

  const {
    id,
    title,
    content,
    preview,
    author,
    createdAt,
    time,
    category,
    tags = [],
    likes = 0,
    comments = 0,
    views = 0,
    isLiked = false,
    isBookmarked = false,
    images = []
  } = post

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return time || '방금 전'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return diffInMinutes < 1 ? '방금 전' : `${diffInMinutes}분 전`
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `${diffInDays}일 전`
      } else {
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    }
  }

  // Truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Handle like toggle
  const handleLikeToggle = (e) => {
    e.stopPropagation()
    if (isLiked) {
      dispatch(unlikePost(id))
    } else {
      dispatch(likePost(id))
    }
  }

  // Handle bookmark toggle
  const handleBookmarkToggle = (e) => {
    e.stopPropagation()
    if (isBookmarked) {
      dispatch(unbookmarkPost(id))
    } else {
      dispatch(bookmarkPost(id))
    }
  }

  // Handle comment click
  const handleCommentClick = (e) => {
    e.stopPropagation()
    onCommentClick(post)
  }

  // Handle share click
  const handleShareClick = (e) => {
    e.stopPropagation()
    onShareClick(post)
  }

  // Handle expand toggle
  const handleExpandClick = (e) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  // Handle card click
  const handleCardClick = () => {
    onCardClick(post)
  }

  const displayContent = content || preview || ''
  const shouldShowExpandButton = displayContent && displayContent.length > 200

  return (
    <Card
      sx={{
        width: '100%',
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)'
        }
      }}
      onClick={handleCardClick}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar
            src={author?.avatar}
            alt={author?.name}
            sx={{
              bgcolor: '#667eea',
              width: 40,
              height: 40
            }}
          >
            {author?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#333'
              }}
            >
              {author?.name || '익명'}
            </Typography>
            {category && (
              <Chip
                label={CATEGORY_LABELS[category] || category}
                size="small"
                sx={{
                  bgcolor: CATEGORY_COLORS[category] || '#667eea',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            )}
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              {formatDate(createdAt)}
            </Typography>
            {views > 0 && (
              <>
                <Typography variant="caption" color="text.secondary">•</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <VisibilityIcon sx={{ fontSize: 12 }} />
                  <Typography variant="caption" color="text.secondary">
                    {views}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        }
        sx={{ pb: 1 }}
      />

      {/* Content */}
      <CardContent sx={{ pt: 0, pb: 1 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#333',
            mb: 1,
            fontSize: '1rem',
            lineHeight: 1.3,
            wordBreak: 'break-word'
          }}
        >
          {truncateText(title, 60)}
        </Typography>

        {/* Content */}
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.5,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {expanded 
              ? displayContent 
              : truncateText(displayContent, shouldShowExpandButton ? 150 : 200)
            }
          </Typography>

          {/* Expand/Collapse Button */}
          {shouldShowExpandButton && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <IconButton
                onClick={handleExpandClick}
                size="small"
                sx={{
                  color: '#667eea',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.04)'
                  }
                }}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {expanded ? '접기' : '더보기'}
                </Typography>
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 0.5, 
            mt: 2 
          }}>
            {tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 24,
                  borderColor: '#e0e0e0',
                  color: '#666',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.04)',
                    borderColor: '#667eea'
                  }
                }}
              />
            ))}
            {tags.length > 3 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ 
                  alignSelf: 'center',
                  ml: 0.5
                }}
              >
                +{tags.length - 3}개
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          px: 2,
          py: 1,
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Left Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Like Button */}
          <IconButton
            onClick={handleLikeToggle}
            size="small"
            sx={{
              color: isLiked ? '#f44336' : '#666',
              '&:hover': {
                bgcolor: isLiked 
                  ? 'rgba(244, 67, 54, 0.04)' 
                  : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ minWidth: 20 }}
          >
            {likes}
          </Typography>

          {/* Comment Button */}
          <IconButton
            onClick={handleCommentClick}
            size="small"
            sx={{
              color: '#666',
              ml: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <CommentIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ minWidth: 20 }}
          >
            {comments}
          </Typography>
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Share Button */}
          <IconButton
            onClick={handleShareClick}
            size="small"
            sx={{
              color: '#666',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>

          {/* Bookmark Button */}
          <IconButton
            onClick={handleBookmarkToggle}
            size="small"
            sx={{
              color: isBookmarked ? '#667eea' : '#666',
              '&:hover': {
                bgcolor: isBookmarked 
                  ? 'rgba(102, 126, 234, 0.04)' 
                  : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  )
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    preview: PropTypes.string,
    author: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      avatar: PropTypes.string
    }),
    createdAt: PropTypes.string,
    time: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    likes: PropTypes.number,
    comments: PropTypes.number,
    views: PropTypes.number,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    images: PropTypes.array
  }).isRequired,
  onCardClick: PropTypes.func,
  onCommentClick: PropTypes.func,
  onShareClick: PropTypes.func
}

export default PostCard