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
import { toggleLikeAsync, bookmarkPost, unbookmarkPost } from '../../../store/slices/communitySlice'

// categoryName별 색상 매핑
const CATEGORY_COLORS = {
  '자유게시판': '#10b981',
  '후기': '#f59e0b',
  '팁&노하우': '#8b5cf6',
  '중고거래': '#06b6d4',
  '메이트 모집': '#ec4899',
  '메이트모집': '#ec4899'
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
    categoryName,
    tags = [],
    likeCount = 0,
    commentsCount = 0,
    views = 0,
    images = [],
    avatarUrl,
    isLiked = false,
    isBookmarked = false
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
  const handleLikeToggle = async (e) => {
    e.stopPropagation()
    try {
      await dispatch(toggleLikeAsync(id))
    } catch (error) {
      console.error('좋아요 처리 실패:', error)
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
            src={avatarUrl}
            alt={typeof author === 'string' ? author : author?.name}
            sx={{
              bgcolor: '#667eea',
              width: 40,
              height: 40
            }}
          >
            {typeof author === 'string'
              ? author?.charAt(0)?.toUpperCase()
              : author?.name?.charAt(0)?.toUpperCase() || 'U'}
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
              {typeof author === 'string' ? author : author?.name || '익명'}
            </Typography>
            {categoryName && (
              <Chip
                label={categoryName}
                size="small"
                sx={{
                  bgcolor: CATEGORY_COLORS[categoryName] || '#667eea',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                  fontWeight: 500,
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

        {/* 이미지 갤러리 (인스타그램 스타일) */}
        {images && images.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {images.length === 1 ? (
              // 단일 이미지
              <Box
                component="img"
                src={images[0]}
                alt="Post image"
                sx={{
                  width: '100%',
                  maxHeight: 350,
                  borderRadius: 2,
                  objectFit: 'cover',
                  bgcolor: '#f5f5f5'
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : images.length === 2 ? (
              // 2개 이미지 - 좌우 배치
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0.5,
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    alt={`Image ${idx + 1}`}
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      bgcolor: '#f5f5f5'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ))}
              </Box>
            ) : (
              // 3개 이상 이미지 - 인스타그램 스타일 (첫 번째 크게, 나머지 작게)
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: 0.5,
                height: 280,
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                {/* 첫 번째 이미지 - 왼쪽 전체 */}
                <Box
                  component="img"
                  src={images[0]}
                  alt="Image 1"
                  sx={{
                    gridRow: '1 / 3',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    bgcolor: '#f5f5f5'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />

                {/* 두 번째 이미지 - 오른쪽 위 */}
                <Box
                  component="img"
                  src={images[1]}
                  alt="Image 2"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    bgcolor: '#f5f5f5'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />

                {/* 세 번째 이미지 - 오른쪽 아래 */}
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={images[2]}
                    alt="Image 3"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      bgcolor: '#f5f5f5'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />

                  {/* 3개 이상일 때 +N 오버레이 */}
                  {images.length > 3 && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        +{images.length - 3}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}

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
                  },
                  '&:focus': {
                    outline: 'none'
                  },
                  '&:focus-visible': {
                    outline: '2px solid #667eea',
                    outlineOffset: '2px'
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
              },
              '&:focus': {
                outline: 'none'
              },
              '&:focus-visible': {
                outline: '2px solid #667eea',
                outlineOffset: '2px'
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
            {likeCount}
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
              },
              '&:focus': {
                outline: 'none'
              },
              '&:focus-visible': {
                outline: '2px solid #667eea',
                outlineOffset: '2px'
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
            {commentsCount}
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
              },
              '&:focus': {
                outline: 'none'
              },
              '&:focus-visible': {
                outline: '2px solid #667eea',
                outlineOffset: '2px'
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
              },
              '&:focus': {
                outline: 'none'
              },
              '&:focus-visible': {
                outline: '2px solid #667eea',
                outlineOffset: '2px'
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
    likeCount: PropTypes.number,
    commentsCount: PropTypes.number,
    views: PropTypes.number,
    avatarUrl: PropTypes.string,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    images: PropTypes.array
  }).isRequired,
  onCardClick: PropTypes.func,
  onCommentClick: PropTypes.func,
  onShareClick: PropTypes.func
}

export default PostCard