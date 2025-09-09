import { useEffect, useRef, useCallback, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'

function InfiniteScroll({
  items = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  renderItem,
  loadingComponent,
  emptyComponent,
  threshold = 100,
  itemsPerPage = 20
}) {
  const [displayedItems, setDisplayedItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const loadingRef = useRef()
  const observerRef = useRef()

  // Initialize displayed items
  useEffect(() => {
    const initialItems = items.slice(0, itemsPerPage)
    setDisplayedItems(initialItems)
    setCurrentPage(1)
  }, [items, itemsPerPage])

  // Load more items for client-side pagination
  const loadMoreItems = useCallback(() => {
    if (loading) return

    const nextPage = currentPage + 1
    const startIndex = (nextPage - 1) * itemsPerPage
    const endIndex = nextPage * itemsPerPage
    const newItems = items.slice(startIndex, endIndex)

    if (newItems.length > 0) {
      setDisplayedItems(prev => [...prev, ...newItems])
      setCurrentPage(nextPage)
    }

    // Also call external onLoadMore if provided (for server-side pagination)
    if (onLoadMore && hasMore) {
      onLoadMore()
    }
  }, [currentPage, itemsPerPage, items, loading, onLoadMore, hasMore])

  // Intersection Observer setup
  useEffect(() => {
    const currentLoadingRef = loadingRef.current
    
    if (!currentLoadingRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting) {
          loadMoreItems()
        }
      },
      {
        threshold: 0.1,
        rootMargin: `${threshold}px`
      }
    )

    observer.observe(currentLoadingRef)
    observerRef.current = observer

    return () => {
      if (observerRef.current && currentLoadingRef) {
        observerRef.current.unobserve(currentLoadingRef)
      }
    }
  }, [loadMoreItems, threshold])

  // Show empty state
  if (!loading && items.length === 0) {
    return emptyComponent || (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={40} />
      </Box>
    )
  }

  const hasMoreItems = displayedItems.length < items.length || hasMore

  return (
    <Box>
      {/* Render displayed items */}
      {displayedItems.map((item, index) => renderItem(item, index))}
      
      {/* Loading indicator / Load more trigger */}
      {hasMoreItems && (
        <Box
          ref={loadingRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 3,
            minHeight: 60
          }}
        >
          {loading ? (
            loadingComponent || (
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            )
          ) : (
            <Box sx={{ 
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: 14,
              fontWeight: 500
            }}>
              스크롤하여 더 보기
            </Box>
          )}
        </Box>
      )}
      
      {/* End of list indicator */}
      {!hasMoreItems && displayedItems.length > 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 2,
          color: '#9ca3af',
          fontSize: 12
        }}>
          모든 결과를 확인했습니다
        </Box>
      )}
    </Box>
  )
}

export default InfiniteScroll