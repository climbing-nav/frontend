import { useState } from 'react'
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
  Button
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

// Category configurations with distinct colors
const categories = {
  ALL: { label: '전체', color: '#667eea', bgColor: '#f3f4f6' },
  FREE: { label: '자유게시판', color: '#10b981', bgColor: '#d1fae5' },
  REVIEW: { label: '후기', color: '#f59e0b', bgColor: '#fef3c7' },
  TIP: { label: '팁&노하우', color: '#8b5cf6', bgColor: '#ede9fe' },
  TRADE: { label: '중고거래', color: '#06b6d4', bgColor: '#cffafe' },
  RECRUIT: { label: '메이트모집', color: '#ec4899', bgColor: '#fce7f3' }
}

// Mock data
const mockPosts = [
  {
    id: 1,
    category: 'REVIEW',
    title: '더클라임 강남점 후기 - 초보자도 즐기기 좋아요!',
    content: '오늘 처음으로 더클라임 강남점에 다녀왔는데요, 시설도 깨끗하고 난이도별로 잘 구성되어 있어서 초보자인 저도 재밌게 즐겼습니다. 특히 직원분들이...',
    date: '2024-01-15',
    likes: 24,
    comments: 12
  },
  {
    id: 2,
    category: 'TIP',
    title: '볼더링 초보 탈출 팁 5가지',
    content: '6개월간 꾸준히 볼더링을 하면서 느낀 점들을 공유합니다. 1. 발 사용법이 가장 중요 2. 과도한 악력 사용 자제...',
    date: '2024-01-12',
    likes: 156,
    comments: 43
  },
  {
    id: 3,
    category: 'RECRUIT',
    title: '주말 아침 클라이밍 메이트 구해요 (성수/홍대)',
    content: '매주 토요일 오전 10시에 클라이밍 하실 분 구합니다. 현재 V4-V5 정도 등반 중이고, 같이 즐겁게...',
    date: '2024-01-10',
    likes: 8,
    comments: 5
  },
  {
    id: 4,
    category: 'FREE',
    title: '오늘 첫 V6 완등했어요!',
    content: '1년간의 노력 끝에 드디어 V6를 완등했습니다 🎉 너무 기쁘네요. 다들 포기하지 말고 화이팅!',
    date: '2024-01-08',
    likes: 89,
    comments: 28
  }
]

function MyPostsPage({ onNavigateToPost, onNavigateToEdit, onBack }) {
  const [activeTab, setActiveTab] = useState(0)
  const [posts, setPosts] = useState(mockPosts)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const tabs = ['ALL', 'FREE', 'REVIEW', 'TIP', 'TRADE', 'RECRUIT']

  const filteredPosts = activeTab === 0
    ? posts
    : posts.filter(post => post.category === tabs[activeTab])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleDeleteClick = (e, post) => {
    e.stopPropagation()
    setSelectedPost(post)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setPosts(prev => prev.filter(p => p.id !== selectedPost.id))
    setDeleteDialogOpen(false)
    setSelectedPost(null)
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
        {filteredPosts.length === 0 ? (
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
            {filteredPosts.map((post, index) => {
              const categoryConfig = categories[post.category]
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
                        {formatDate(post.date)}
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
                            {post.likes}
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
                            {post.comments}
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
