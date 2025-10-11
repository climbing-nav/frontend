import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import PropTypes from 'prop-types'
import PostCard from '../../components/community/PostCard/PostCard'

const mockPosts = [
  {
    id: 1,
    category: '자유게시판',
    time: '1시간 전',
    title: '강남 클라이밍장 추천해주세요!',
    preview: '직장이 강남이라 퇴근 후에 갈 수 있는 클라이밍장 찾고 있습니다. 볼더링 위주로 하는데...',
    likes: 12,
    comments: 8,
    views: 156
  },
  {
    id: 2,
    category: '팁&노하우',
    time: '3시간 전',
    title: 'V5 문제 도전을 위한 핵심 트레이닝',
    preview: 'V4에서 V5로 넘어가는 단계에서 가장 중요한 것은 코어와 손가락 힘입니다...',
    likes: 24,
    comments: 15,
    views: 432
  },
  {
    id: 3,
    category: '메이트모집',
    time: '5시간 전',
    title: '이번 주말 클라이밍 메이트 구해요',
    preview: '주말에 성수 클라임플러스에서 함께 볼더링 하실 분 구합니다. V3-V4 정도...',
    likes: 6,
    comments: 12,
    views: 89
  },
  {
    id: 4,
    category: '중고거래',
    time: '1일 전',
    title: '라 스포르티바 클라이밍화 230mm 판매',
    preview: '3개월 정도 사용한 라 스포르티바 파이썬 클라이밍화 판매합니다. 사이즈 230mm...',
    likes: 8,
    comments: 5,
    views: 234
  }
]

const tabs = ['전체', '자유게시판', '후기', '팁&노하우', '중고거래', '메이트모집']

function CommunityPage({ onNavigateToPostDetail }) {
  const [activeTab, setActiveTab] = useState(0)

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
  const filteredPosts = activeTab === 0
    ? mockPosts // '전체' 탭인 경우 모든 게시물 표시
    : mockPosts.filter(post => post.category === tabs[activeTab])

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
          <Tab key={index} label={tab} />
        ))}
      </Tabs>

      <Box sx={{ py: 2, px: 2.5 }}>
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onCardClick={handlePostClick}
          />
        ))}
      </Box>
    </Box>
  )
}

CommunityPage.propTypes = {
  onNavigateToPostDetail: PropTypes.func
}

export default CommunityPage