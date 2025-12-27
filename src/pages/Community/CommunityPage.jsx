import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Tabs, Tab, CircularProgress, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import PostCard from '../../components/community/PostCard/PostCard'
import { fetchPostsAsync, fetchMorePostsAsync, resetPosts } from '../../store/slices/communitySlice'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
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
  const { posts, loading, error, pagination } = useSelector(state => state.community)
  const [activeTab, setActiveTab] = useState(0)

  // 탭 변경 시 초기화 후 재로드
  useEffect(() => {
    const selectedBoardCode = tabs[activeTab].boardCode
    dispatch(resetPosts()) // 기존 posts 초기화
    dispatch(fetchPostsAsync(selectedBoardCode)) // 첫 20개 로드
  }, [dispatch, activeTab])

  // 더 로드하기 핸들러
  const handleLoadMore = useCallback(() => {
    if (!loading && pagination.hasNextPage) {
      const selectedBoardCode = tabs[activeTab].boardCode
      dispatch(fetchMorePostsAsync(selectedBoardCode))
    }
  }, [dispatch, activeTab, loading, pagination.hasNextPage])

  // 무한 스크롤 훅 사용
  const lastPostRef = useInfiniteScroll(
    handleLoadMore,
    pagination.hasNextPage,
    loading
  )

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // 게시물 카드 클릭 핸들러
  const handlePostClick = (post) => {
    if (onNavigateToPostDetail) {
      onNavigateToPostDetail(post)
    }
  }

  // posts가 배열인지 확인 (방어적 코드)
  const postsArray = Array.isArray(posts) ? posts : []
  // 서버 사이드 필터링이므로 클라이언트 필터링 불필요

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
        {postsArray.length > 0 ? (
          <>
            {postsArray.map((post, index) => {
              // 마지막 요소에 ref 추가
              const isLast = index === postsArray.length - 1
              return (
                <div key={post.id} ref={isLast ? lastPostRef : null}>
                  <PostCard
                    post={post}
                    onCardClick={handlePostClick}
                  />
                </div>
              )
            })}

            {/* 추가 로딩 인디케이터 */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={32} />
              </Box>
            )}

            {/* 더 이상 데이터 없음 표시 */}
            {!pagination.hasNextPage && postsArray.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  모든 게시글을 불러왔습니다
                </Typography>
              </Box>
            )}
          </>
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