import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material'
import {
  FavoriteBorder,
  ChatBubbleOutline,
  MoreVert,
  DeleteOutline,
  Edit,
  ArrowBack
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import { fetchMyPostsAsync, deletePostAsync } from '../../../store/slices/communitySlice'

// Category configurations with distinct colors
const categories = {
  ALL: { label: '전체', color: '#667eea', bgColor: '#f3f4f6' },
  FREE: { label: '자유게시판', color: '#10b981', bgColor: '#d1fae5' },
  REVIEW: { label: '후기', color: '#f59e0b', bgColor: '#fef3c7' },
  TIP: { label: '팁&노하우', color: '#8b5cf6', bgColor: '#ede9fe' },
  TRADE: { label: '중고거래', color: '#06b6d4', bgColor: '#cffafe' },
  RECRUIT: { label: '메이트모집', color: '#ec4899', bgColor: '#fce7f3' }
}

// categoryName을 boardCode로 매핑
const categoryNameToBoardCode = {
  '자유게시판': 'FREE',
  '후기': 'REVIEW',
  '팁&노하우': 'TIP',
  '중고거래': 'TRADE',
  '메이트 모집': 'RECRUIT',
  '메이트모집': 'RECRUIT'
}

function MyPostsPage({ onNavigateToPost, onNavigateToEdit, onBack }) {
  const dispatch = useDispatch()
  const { myPosts, loading, error } = useSelector(state => state.community)
  const [activeTab, setActiveTab] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const tabs = ['ALL', 'FREE', 'REVIEW', 'TIP', 'TRADE', 'RECRUIT']

  // 내 게시글 목록 로드 (탭 변경 시마다 재요청)
  useEffect(() => {
    const selectedBoardCode = activeTab === 0 ? null : tabs[activeTab]
    dispatch(fetchMyPostsAsync(selectedBoardCode))
  }, [dispatch, activeTab])

  // 서버 사이드 필터링이므로 클라이언트 필터링 불필요
  const posts = Array.isArray(myPosts) ? myPosts : []

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleDeleteClick = (e, post) => {
    e.stopPropagation()
    setSelectedPost(post)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletePostAsync(selectedPost.id))
      setDeleteDialogOpen(false)
      setSelectedPost(null)
      // 삭제 후 목록 새로고침
      const selectedBoardCode = activeTab === 0 ? null : tabs[activeTab]
      dispatch(fetchMyPostsAsync(selectedBoardCode))
    } catch (error) {
      console.error('게시글 삭제 실패:', error)
    }
  }

  const handlePostClick = (post) => {
    if (onNavigateToPost) {
      onNavigateToPost(post)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}월 ${day}일`
  }

  // 로딩 상태
  if (loading && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '393px' }}>
        <CircularProgress />
      </Box>
    )
  }

  // 에러 상태
  if (error && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '393px', p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          게시글을 불러올 수 없습니다
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '393px', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header - Editorial style with large number */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e5e7eb',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#1f2937',
                  letterSpacing: '-0.03em'
                }}
              >
                작성한 글
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: '#667eea',
                  letterSpacing: '-0.04em',
                  lineHeight: 1
                }}
              >
                {posts.length}
              </Typography>
            </Box>
            <IconButton
              onClick={onBack}
              sx={{
                width: 36,
                height: 36,
                color: '#1f2937',
                '&:hover': { bgcolor: '#f3f4f6' }
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              fontWeight: 500
            }}
          >
            내가 작성한 커뮤니티 게시글
          </Typography>
        </Box>

        {/* Tabs with horizontal scroll */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderTop: '1px solid #f3f4f6',
            minHeight: 48,
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 2.5,
              py: 1.5,
              minHeight: 48,
              color: '#6b7280',
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'none',
              letterSpacing: '-0.01em'
            },
            '& .Mui-selected': {
              color: '#667eea !important'
            },
            '& .MuiTabs-indicator': {
              height: 3,
              backgroundColor: '#667eea'
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={categories[tab].label} />
          ))}
        </Tabs>
      </Box>

      {/* Posts List */}
      <Box sx={{ p: 2 }}>
        {posts.length === 0 ? (
          // Empty State - Magazine inspired
          <Paper
            elevation={0}
            sx={{
              mt: 6,
              p: 6,
              textAlign: 'center',
              bgcolor: 'white',
              border: '2px solid #f3f4f6',
              borderRadius: 1,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -100,
                right: -100,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)'
              }
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: 72,
                fontWeight: 900,
                color: '#f3f4f6',
                mb: 2,
                letterSpacing: '-0.05em'
              }}
            >
              0
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#1f2937',
                fontWeight: 700,
                mb: 1,
                letterSpacing: '-0.02em'
              }}
            >
              작성한 글이 없습니다
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                lineHeight: 1.6
              }}
            >
              첫 게시글을 작성하고
              <br />
              다른 클라이머들과 소통해보세요
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {posts.map((post, index) => {
              // categoryName을 boardCode로 변환 (API 응답에 boardCode가 없는 경우)
              const boardCode = post.boardCode || categoryNameToBoardCode[post.categoryName]
              const categoryConfig = categories[boardCode] || categories['ALL']
              return (
                <Paper
                  key={post.id}
                  elevation={0}
                  onClick={() => handlePostClick(post)}
                  sx={{
                    bgcolor: 'white',
                    border: '1px solid #e5e7eb',
                    borderLeft: `4px solid ${categoryConfig.color}`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `slideUp 0.5s ease-out ${index * 0.08}s backwards`,
                    '@keyframes slideUp': {
                      from: {
                        opacity: 0,
                        transform: 'translateY(30px)'
                      },
                      to: {
                        opacity: 1,
                        transform: 'translateY(0)'
                      }
                    },
                    '&:hover': {
                      borderColor: categoryConfig.color,
                      boxShadow: `0 8px 24px ${categoryConfig.color}20`,
                      transform: 'translateY(-4px)',
                      '& .post-actions': {
                        opacity: 1
                      }
                    },
                    '&:active': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ p: 2.5 }}>
                    {/* Category Badge & Date */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1.5
                      }}
                    >
                      <Chip
                        label={categoryConfig.label}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: 12,
                          fontWeight: 700,
                          bgcolor: categoryConfig.bgColor,
                          color: categoryConfig.color,
                          border: 'none',
                          '& .MuiChip-label': {
                            px: 1.5
                          }
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#9ca3af',
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {formatDate(post.createdAt || post.date)}
                      </Typography>
                    </Box>

                    {/* Title - Editorial bold typography */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#1f2937',
                        mb: 1,
                        lineHeight: 1.3,
                        letterSpacing: '-0.02em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {post.title}
                    </Typography>

                    {/* Content Preview */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        mb: 2,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {post.content}
                    </Typography>

                    {/* Engagement Stats & Actions */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Stats */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <FavoriteBorder
                            sx={{
                              fontSize: 18,
                              color: '#ef4444'
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: '#1f2937',
                              fontSize: 14
                            }}
                          >
                            {post.likeCount || post.likes || 0}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <ChatBubbleOutline
                            sx={{
                              fontSize: 18,
                              color: '#667eea'
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: '#1f2937',
                              fontSize: 14
                            }}
                          >
                            {post.commentCount || post.comments || 0}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Action Buttons */}
                      <Box
                        className="post-actions"
                        sx={{
                          display: 'flex',
                          gap: 0.5,
                          opacity: 0.6,
                          transition: 'opacity 0.2s ease'
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            onNavigateToEdit && onNavigateToEdit(post)
                          }}
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#f8f9fa',
                            '&:hover': {
                              bgcolor: '#667eea',
                              color: 'white'
                            }
                          }}
                        >
                          <Edit sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteClick(e, post)}
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#f8f9fa',
                            '&:hover': {
                              bgcolor: '#ef4444',
                              color: 'white'
                            }
                          }}
                        >
                          <DeleteOutline sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              )
            })}
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: 320,
            p: 1
          }
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: '#1f2937',
            fontSize: 18
          }}
        >
          게시글 삭제
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              lineHeight: 1.6
            }}
          >
            이 게시글을 삭제하시겠습니까?
            <br />
            삭제된 게시글은 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: '#6b7280',
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: '#ef4444',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#dc2626'
              }
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

MyPostsPage.propTypes = {
  onNavigateToPost: PropTypes.func,
  onNavigateToEdit: PropTypes.func,
  onBack: PropTypes.func
}

export default MyPostsPage
