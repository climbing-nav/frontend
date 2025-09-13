import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Container,
  CircularProgress,
  Typography,
  Fab,
  Slide,
  Skeleton,
  Alert
} from '@mui/material'
import {
  KeyboardArrowUp as ArrowUpIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import PropTypes from 'prop-types'

// Import components
import SearchBar from '../../common/SearchBar'
import CategoryFilter from '../CategoryFilter'
import PostCard from '../PostCard/PostCard'
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } from '../../../store/slices/communitySlice'

/**
 * PostList Component
 * Main component for displaying filterable post list with infinite scroll, search, and interaction features
 * 
 * @param {Object} props
 * @param {Function} props.onPostClick - Handler for post card click
 * @param {Function} props.onCommentClick - Handler for comment button click
 * @param {Function} props.onShareClick - Handler for share button click
 * @param {number} props.postsPerPage - Number of posts to load per page
 */

function PostList({
  onPostClick = () => {},
  onCommentClick = () => {},
  onShareClick = () => {},
  postsPerPage = 20
}) {
  const dispatch = useDispatch()
  const { posts, loading, error, pagination } = useSelector(state => state.community)
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [displayedPosts, setDisplayedPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Refs
  const observerRef = useRef()
  const lastPostElementRef = useRef()
  const containerRef = useRef()

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.preview?.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    return filtered
  }, [posts, selectedCategory, searchTerm])

  // Paginated posts for infinite scroll
  const paginatedPosts = useMemo(() => {
    return filteredPosts.slice(0, page * postsPerPage)
  }, [filteredPosts, page, postsPerPage])

  // Update displayed posts
  useEffect(() => {
    setDisplayedPosts(paginatedPosts)
    setHasMore(paginatedPosts.length < filteredPosts.length)
  }, [paginatedPosts, filteredPosts])

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1)
    setHasMore(true)
  }, [searchTerm, selectedCategory])

  // Intersection Observer for infinite scroll
  const lastPostRef = useCallback(node => {
    if (isLoadingMore) return
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setIsLoadingMore(true)
        setPage(prevPage => prevPage + 1)
        
        // Simulate loading delay
        setTimeout(() => {
          setIsLoadingMore(false)
        }, 500)
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    })
    
    if (node) observerRef.current.observe(node)
  }, [isLoadingMore, hasMore, loading])

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowScrollTop(scrollTop > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchTerm(value)
  }

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      dispatch(fetchPostsStart())
      // Simulate API call
      setTimeout(() => {
        dispatch(fetchPostsSuccess(posts)) // In real app, fetch fresh data
        setIsRefreshing(false)
        setPage(1)
      }, 1000)
    } catch (error) {
      dispatch(fetchPostsFailure(error.message))
      setIsRefreshing(false)
    }
  }

  // Pull to refresh handler
  const handlePullToRefresh = useCallback(() => {
    if (!isRefreshing && !loading) {
      handleRefresh()
    }
  }, [isRefreshing, loading])

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    <Box sx={{ px: 2 }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Box>
      ))}
    </Box>
  )

  // Empty state
  const renderEmptyState = () => {
    const isSearchActive = searchTerm.trim() || selectedCategory !== 'all'
    
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 3,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#666',
            mb: 1,
            fontWeight: 500
          }}
        >
          {isSearchActive ? '검색 결과가 없습니다' : '아직 게시글이 없습니다'}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {isSearchActive 
            ? '다른 검색어나 카테고리를 시도해보세요'
            : '첫 번째 게시글을 작성해보세요!'
          }
        </Typography>
      </Box>
    )
  }

  // Error state
  const renderErrorState = () => (
    <Box sx={{ p: 2 }}>
      <Alert 
        severity="error" 
        action={
          <Fab
            size="small"
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{ ml: 1 }}
          >
            <RefreshIcon />
          </Fab>
        }
      >
        게시글을 불러오는 중 오류가 발생했습니다.
      </Alert>
    </Box>
  )

  return (
    <Container
      maxWidth={false}
      sx={{
        width: '393px',
        px: 0,
        minHeight: '100vh',
        bgcolor: '#fafafa',
        position: 'relative'
      }}
      ref={containerRef}
    >
      {/* Search Bar */}
      <SearchBar
        variant="community"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="게시글 검색..."
        resultCount={filteredPosts.length}
        isSearching={loading}
        showResults={true}
      />

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        posts={posts}
        showCounts={true}
      />

      {/* Content */}
      <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>
        {/* Error State */}
        {error && renderErrorState()}

        {/* Loading State */}
        {loading && displayedPosts.length === 0 && renderLoadingSkeleton()}

        {/* Empty State */}
        {!loading && !error && displayedPosts.length === 0 && renderEmptyState()}

        {/* Posts List */}
        {displayedPosts.length > 0 && (
          <Box sx={{ px: 2, py: 2 }}>
            {displayedPosts.map((post, index) => {
              const isLast = index === displayedPosts.length - 1
              return (
                <div
                  key={post.id}
                  ref={isLast ? lastPostRef : null}
                >
                  <PostCard
                    post={post}
                    onCardClick={onPostClick}
                    onCommentClick={onCommentClick}
                    onShareClick={onShareClick}
                  />
                </div>
              )
            })}

            {/* Loading more indicator */}
            {isLoadingMore && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  py: 3
                }}
              >
                <CircularProgress size={24} sx={{ color: '#667eea' }} />
              </Box>
            )}

            {/* End of results */}
            {!hasMore && displayedPosts.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  py: 3
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    bgcolor: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  모든 게시글을 확인했습니다
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Scroll to Top FAB */}
      <Slide direction="up" in={showScrollTop} mountOnEnter unmountOnExit>
        <Fab
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#667eea',
            color: 'white',
            '&:hover': {
              bgcolor: '#5a6fd8'
            },
            zIndex: 1000
          }}
          size="medium"
        >
          <ArrowUpIcon />
        </Fab>
      </Slide>

      {/* Refresh FAB */}
      <Fab
        onClick={handleRefresh}
        disabled={isRefreshing || loading}
        sx={{
          position: 'fixed',
          bottom: showScrollTop ? 88 : 24,
          right: 24,
          bgcolor: 'white',
          color: '#667eea',
          border: '1px solid #e0e0e0',
          '&:hover': {
            bgcolor: '#f5f5f5'
          },
          transition: 'bottom 0.3s ease',
          zIndex: 999
        }}
        size="small"
      >
        {isRefreshing ? (
          <CircularProgress size={20} sx={{ color: '#667eea' }} />
        ) : (
          <RefreshIcon />
        )}
      </Fab>
    </Container>
  )
}

PostList.propTypes = {
  onPostClick: PropTypes.func,
  onCommentClick: PropTypes.func,
  onShareClick: PropTypes.func,
  postsPerPage: PropTypes.number
}

export default PostList