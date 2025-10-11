import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Divider,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Send as SendIcon
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import { likePost, unlikePost, bookmarkPost, unbookmarkPost } from '../../store/slices/communitySlice'

// 카테고리 라벨 매핑
const CATEGORY_LABELS = {
  'general': '일반',
  'climbing-tips': '클라이밍 팁',
  'gear-review': '장비 리뷰',
  'route-info': '루트 정보',
  'gym-review': '짐 리뷰',
  'technique': '기술 공유',
  'safety': '안전 수칙',
  'community': '커뮤니티',
  '자유게시판': '자유게시판',
  '팁&노하우': '팁&노하우',
  '메이트모집': '메이트모집',
  '중고거래': '중고거래',
  '후기': '후기'
}

// 카테고리 색상
const CATEGORY_COLORS = {
  'general': '#667eea',
  'climbing-tips': '#f093fb',
  'gear-review': '#4facfe',
  'route-info': '#43e97b',
  'gym-review': '#fa709a',
  'technique': '#ffecd2',
  'safety': '#ff9a9e',
  'community': '#a8edea',
  '자유게시판': '#667eea',
  '팁&노하우': '#f093fb',
  '메이트모집': '#43e97b',
  '중고거래': '#fa709a',
  '후기': '#4facfe'
}

function PostDetailPage({ post, onBack }) {
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([
    {
      id: 1,
      author: { name: '클라이머A', avatar: '' },
      content: '좋은 정보 감사합니다!',
      createdAt: '2024-01-10T10:30:00'
    },
    {
      id: 2,
      author: { name: '클라이머B', avatar: '' },
      content: '저도 이 암장 다녀왔는데 정말 좋더라구요.',
      createdAt: '2024-01-10T11:15:00'
    }
  ])

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
    views = 0,
    isLiked = false,
    isBookmarked = false
  } = post

  // 날짜 포맷팅
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

  // 좋아요 토글 처리
  const handleLikeToggle = () => {
    if (isLiked) {
      dispatch(unlikePost(id))
    } else {
      dispatch(likePost(id))
    }
  }

  // 북마크 토글 처리
  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      dispatch(unbookmarkPost(id))
    } else {
      dispatch(bookmarkPost(id))
    }
  }

  // 공유 처리
  const handleShare = () => {
    // 공유 기능
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content || preview,
        url: window.location.href
      }).catch(() => {
        // 대체 방법: 클립보드에 복사
        navigator.clipboard.writeText(window.location.href)
      })
    } else {
      // 대체 방법: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // 댓글 전송 처리
  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: { name: '현재 사용자', avatar: '' },
        content: comment,
        createdAt: new Date().toISOString()
      }
      setComments([...comments, newComment])
      setComment('')
    }
  }

  // 댓글 키 입력 처리
  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommentSubmit()
    }
  }

  const displayContent = content || preview || ''

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f8f9fa'
    }}>
      {/* 헤더 */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={onBack}
            sx={{ color: '#333' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              color: '#333',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            게시글
          </Typography>
          <IconButton sx={{ color: '#333' }}>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 본문 컨텐츠 */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        pb: 10
      }}>
        {/* 게시물 헤더 */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 1
          }}
        >
          {/* 작성자 정보 */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2
          }}>
            <Avatar
              src={author?.avatar}
              alt={author?.name}
              sx={{
                bgcolor: '#667eea',
                width: 44,
                height: 44,
                mr: 1.5
              }}
            >
              {author?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="subtitle1"
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
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
                      <VisibilityIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {views}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {/* 제목 */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#333',
              mb: 2,
              fontSize: '1.25rem',
              lineHeight: 1.4,
              wordBreak: 'break-word'
            }}
          >
            {title}
          </Typography>

          {/* 본문 내용 */}
          <Typography
            variant="body1"
            sx={{
              color: '#333',
              lineHeight: 1.7,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              mb: 2
            }}
          >
            {displayContent}
          </Typography>

          {/* 태그 */}
          {tags && tags.length > 0 && (
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
              mb: 2
            }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.75rem',
                    height: 26,
                    borderColor: '#e0e0e0',
                    color: '#666',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.04)',
                      borderColor: '#667eea'
                    }
                  }}
                />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* 액션 버튼들 */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* 좌측 액션 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {likes}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon sx={{ fontSize: 20, color: '#666' }} />
                <Typography variant="body2" color="text.secondary">
                  {comments.length}
                </Typography>
              </Box>
            </Box>

            {/* 우측 액션 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={handleShare}
                size="small"
                sx={{ color: '#666' }}
              >
                <ShareIcon />
              </IconButton>
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
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* 댓글 섹션 */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#333',
              mb: 2,
              fontSize: '1rem'
            }}
          >
            댓글 {comments.length}
          </Typography>

          {comments.length === 0 ? (
            <Box sx={{
              py: 4,
              textAlign: 'center'
            }}>
              <Typography color="text.secondary" variant="body2">
                첫 댓글을 작성해보세요!
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {comments.map((commentItem, index) => (
                <Box key={commentItem.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 0,
                      py: 2
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={commentItem.author?.avatar}
                        alt={commentItem.author?.name}
                        sx={{
                          bgcolor: '#667eea',
                          width: 36,
                          height: 36
                        }}
                      >
                        {commentItem.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ mb: 0.5 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: '#333',
                              display: 'inline',
                              mr: 1
                            }}
                          >
                            {commentItem.author?.name || '익명'}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatDate(commentItem.createdAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#333',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {commentItem.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < comments.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* 댓글 입력창 (하단 고정) */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 393,
          margin: '0 auto',
          p: 2,
          bgcolor: 'white',
          borderTop: '1px solid #e5e7eb',
          zIndex: 1000
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="댓글을 입력하세요..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={handleCommentKeyPress}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#f8f9fa'
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={!comment.trim()}
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 1,
              borderRadius: 3,
              bgcolor: '#667eea',
              '&:hover': {
                bgcolor: '#5568d3'
              }
            }}
          >
            <SendIcon sx={{ fontSize: 20 }} />
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

PostDetailPage.propTypes = {
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
    isBookmarked: PropTypes.bool
  }).isRequired,
  onBack: PropTypes.func.isRequired
}

export default PostDetailPage
