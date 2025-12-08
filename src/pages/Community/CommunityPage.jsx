import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Tabs, Tab, CircularProgress, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import PostCard from '../../components/community/PostCard/PostCard'
import { fetchPostsAsync } from '../../store/slices/communitySlice'
import { getBoardName } from '../../constants/boardCodes'

const tabs = [
  { label: '전체', boardCode: null },
  { label: '자유게시판', boardCode: 'FREE' },
  { label: '후기', boardCode: 'REVIEW' },
  { label: '팁&노하우', boardCode: 'TIP' },
  { label: '중고거래', boardCode: 'TRADE' },
  { label: '메이트모집', boardCode: 'RECRUIT' }
]

function CommunityPage({ onNavigateToPostDetail }) {
  const dispatch = useDispatch()
  const { posts, loading, error } = useSelector(state => state.community)
  const [activeTab, setActiveTab] = useState(0)

  // 게시글 목록 로드
  useEffect(() => {
    dispatch(fetchPostsAsync())
  }, [dispatch])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // 게시물 카드 클릭 핸들러
  const handlePostClick = (post) => {
    if (onNavigateToPostDetail) {
      onNavigateToPostDetail(post)
    }
  }

  // 선택된 탭에 따라 게시물 필터링
  const selectedBoardCode = tabs[activeTab].boardCode
  // posts가 배열인지 확인 (방어적 코드)
  const postsArray = Array.isArray(posts) ? posts : []
  const filteredPosts = selectedBoardCode === null
    ? postsArray // '전체' 탭인 경우 모든 게시물 표시
    : postsArray.filter(post => post.boardCode === selectedBoardCode)

  // 로딩 상태
  if (loading && postsArray.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', width: '100%', minWidth: '393px' }}>
        <CircularProgress />
      </Box>
    )
  }

  // 에러 상태
  if (error && postsArray.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', width: '100%', minWidth: '393px', p: 3 }}>
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
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e5e7eb',
          '& .MuiTab-root': {
            minWidth: 'auto',
            px: 2.5,
            py: 2,
            color: '#6b7280',
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'none'
          },
          '& .Mui-selected': {
            color: '#667eea !important'
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#667eea'
          }
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      <Box sx={{ py: 2, px: 2.5 }}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onCardClick={handlePostClick}
            />
          ))
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              게시글이 없습니다
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

CommunityPage.propTypes = {
  onNavigateToPostDetail: PropTypes.func
}

export default CommunityPage