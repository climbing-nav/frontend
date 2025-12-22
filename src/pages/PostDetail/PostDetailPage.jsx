import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
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
  ListItemText,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import {
  bookmarkPost,
  unbookmarkPost,
  fetchPostAsync,
  deletePostAsync,
  createCommentAsync,
  deleteCommentAsync,
  toggleLikeAsync
} from '../../store/slices/communitySlice'
import { getBoardName } from '../../constants/boardCodes'
import ImageCarousel from '../../components/common/ImageCarousel'

// boardCode별 색상 (영문 코드 + 한글 이름 지원)
const BOARD_CODE_COLORS = {
  'FREE': '#667eea',
  '자유게시판': '#667eea',
  'REVIEW': '#4facfe',
  '후기': '#4facfe',
  'TIP': '#f093fb',
  '팁&노하우': '#f093fb',
  'TRADE': '#fa709a',
  '중고거래': '#fa709a',
  'RECRUIT': '#43e97b',
  '메이트 모집': '#43e97b',
  '메이트모집': '#43e97b'
}

function PostDetailPage({ postId, onBack, onEdit }) {
  const dispatch = useDispatch()

  // Redux store에서 게시글 데이터 및 현재 사용자 정보 가져오기
  const { selectedPost, loading, error } = useSelector(state => state.community)
  const currentUser = useSelector(state => state.auth.user)

  // Redux의 selectedPost만 사용
  const post = selectedPost

  // 게시글의 댓글 목록 (게시글 상세 조회 시 comments 배열 포함)
  const comments = post?.comments || []

  const [comment, setComment] = useState('')

  // 메뉴 관련 state
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const menuOpen = Boolean(anchorEl)

  // 댓글 삭제 관련 state
  const [commentDeleteDialogOpen, setCommentDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)

  // 게시글 로드 (항상 백엔드에서 최신 데이터 조회)
  useEffect(() => {
    if (postId) {
      dispatch(fetchPostAsync(postId))
    }
  }, [dispatch, postId])

  // 로딩 상태 처리
  if (loading && !post) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // 에러 처리
  if (error && !post) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          게시글을 불러올 수 없습니다
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={onBack}>
          돌아가기
        </Button>
      </Box>
    )
  }

  // 게시글이 없는 경우
  if (!post) {
    return null
  }

  const {
    id,
    title,
    content,
    preview,
    author,
    avatarUrl,
    createdAt,
    time,
    boardCode,
    category,
    tags = [],
    likeCount = 0,
    views = 0,
    isLiked = false,
    isBookmarked = false,
    fileNames = []
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
  const handleLikeToggle = async () => {
    try {
      await dispatch(toggleLikeAsync(id))
    } catch (error) {
      console.error('좋아요 처리 실패:', error)
      // 에러 처리 (필요시 사용자에게 알림)
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
  const handleCommentSubmit = async () => {
    if (comment.trim() && post?.id && currentUser) {
      try {
        await dispatch(createCommentAsync({
          postId: post.id,
          author: currentUser.nickname,
          content: comment.trim()
        }))
        setComment('')
        // 댓글 작성 후 게시글 다시 조회하여 업데이트된 댓글 목록 가져오기
        await dispatch(fetchPostAsync(post.id))
      } catch (error) {
        console.error('댓글 작성 실패:', error)
        // 에러 처리 (필요시 사용자에게 알림)
      }
    }
  }

  // 댓글 키 입력 처리
  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommentSubmit()
    }
  }

  // 댓글 삭제 다이얼로그 열기
  const handleCommentDeleteClick = (commentId) => {
    setCommentToDelete(commentId)
    setCommentDeleteDialogOpen(true)
  }

  // 댓글 삭제 다이얼로그 닫기
  const handleCommentDeleteDialogClose = () => {
    setCommentDeleteDialogOpen(false)
    setCommentToDelete(null)
  }

  // 댓글 삭제 확인
  const handleCommentDeleteConfirm = async () => {

    if (!commentToDelete) {
      return
    }

    try {
      const result = await dispatch(deleteCommentAsync(commentToDelete))

      // 댓글 삭제 후 게시글 다시 조회하여 업데이트된 댓글 목록 가져오기
      await dispatch(fetchPostAsync(post.id))

      handleCommentDeleteDialogClose()

    } catch (error) {
      console.error('❌ 댓글 삭제 실패:', error)
      console.error('❌ 에러 상세:', error.message, error.response)
      // 에러 처리 (필요시 사용자에게 알림)
    }
  }

  // 메뉴 핸들러
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleMenuClose()
    if (onEdit) {
      onEdit(post)
    }
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletePostAsync(id))
      setDeleteDialogOpen(false)
      // 삭제 후 목록으로 돌아가기
      if (onBack) {
        onBack()
      }
    } catch (error) {
      console.error('게시글 삭제 실패:', error)
      // 에러는 Redux에서 처리됨
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  // 작성자 확인 (nickname 비교)
  const isAuthor = currentUser && post?.author && currentUser.nickname === post.author

  const displayContent = content || preview || ''

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '393px',
      minWidth: '393px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f8f9fa',
      margin: '0 auto'
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
            sx={{
              color: '#333',
              '&:focus': {
                outline: 'none'
              },
              '&:focus-visible': {
                outline: '2px solid #667eea',
                outlineOffset: '2px'
              }
            }}
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
          {isAuthor && (
            <IconButton
              sx={{
                color: '#333',
                '&:focus': {
                  outline: 'none'
                },
                '&:focus-visible': {
                  outline: '2px solid #667eea',
                  outlineOffset: '2px'
                }
              }}
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 120,
            mt: 0.5
          }
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ px: 2, py: 1.2 }}>
          <EditIcon sx={{ mr: 1.2, fontSize: 20 }} />
          수정
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: '#f44336', px: 2, py: 1.2 }}>
          <DeleteIcon sx={{ mr: 1.2, fontSize: 20 }} />
          삭제
        </MenuItem>
      </Menu>

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
              src={avatarUrl}
              alt={typeof author === 'string' ? author : author?.name}
              sx={{
                bgcolor: '#667eea',
                width: 44,
                height: 44,
                mr: 1.5
              }}
            >
              {typeof author === 'string'
                ? author?.charAt(0)?.toUpperCase()
                : author?.name?.charAt(0)?.toUpperCase() || 'U'}
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
                  {typeof author === 'string' ? author : author?.name || '익명'}
                </Typography>
                {(boardCode || category) && (
                  <Chip
                    label={getBoardName(boardCode || category)}
                    size="small"
                    sx={{
                      bgcolor: BOARD_CODE_COLORS[boardCode] || BOARD_CODE_COLORS[category] || '#667eea',
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

          {/* 이미지 캐러셀 */}
          {fileNames && fileNames.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <ImageCarousel images={fileNames} />
            </Box>
          )}

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
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {likeCount}
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
                sx={{
                  color: '#666',
                  '&:focus': {
                    outline: 'none'
                  },
                  '&:focus-visible': {
                    outline: '2px solid #667eea',
                    outlineOffset: '2px'
                  }
                }}
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
              {comments.map((commentItem, index) => {

                return (
                <Box key={commentItem.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 0,
                      py: 2,
                      position: 'relative'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={commentItem.avatarUrl}
                        alt={commentItem.author}
                        sx={{
                          bgcolor: '#667eea',
                          width: 36,
                          height: 36
                        }}
                      >
                        {commentItem.author?.charAt(0)?.toUpperCase() || 'U'}
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
                            {commentItem.author || '익명'}
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
                    {currentUser && commentItem.author === currentUser.nickname && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleCommentDeleteClick(commentItem.id)
                        }}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 0,
                          padding: '4px',
                          color: '#999',
                          '&:hover': {
                            color: '#f44336',
                            bgcolor: 'rgba(244, 67, 54, 0.04)'
                          }
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </ListItem>
                  {index < comments.length - 1 && <Divider />}
                </Box>
                )
              })}
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

      {/* 게시글 삭제 확인 Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 340
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          게시글 삭제
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 이 게시글을 삭제하시겠습니까?
            <br />
            삭제된 게시글은 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{ color: '#666' }}
          >
            취소
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: '#f44336',
              '&:hover': {
                bgcolor: '#d32f2f'
              }
            }}
            autoFocus
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      {/* 댓글 삭제 확인 Dialog */}
      <Dialog
        open={commentDeleteDialogOpen}
        onClose={handleCommentDeleteDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 340
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          댓글 삭제
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 이 댓글을 삭제하시겠습니까?
            <br />
            삭제된 댓글은 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              handleCommentDeleteDialogClose()
            }}
            sx={{ color: '#666' }}
          >
            취소
          </Button>
          <Button
            onClick={() => {
              handleCommentDeleteConfirm()
            }}
            variant="contained"
            sx={{
              bgcolor: '#f44336',
              '&:hover': {
                bgcolor: '#d32f2f'
              }
            }}
            autoFocus
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

PostDetailPage.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func
}

export default PostDetailPage
