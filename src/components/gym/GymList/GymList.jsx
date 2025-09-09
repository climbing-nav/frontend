import { useEffect, useCallback } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import GymCard from '../GymCard/GymCard'
import SearchBar from './SearchBar'
import FilterControls from './FilterControls'
import SortControls from './SortControls'
import InfiniteScroll from './InfiniteScroll'
import { 
  selectGym,
  setFilters,
  setSearchQuery,
  setSorting,
  clearFilters,
  loadMoreGyms,
  selectFilteredGyms
} from '../../../store/slices/gymSlice'

function GymList() {
  const dispatch = useDispatch()
  const { 
    loading, 
    error, 
    filters, 
    searchQuery, 
    sortBy, 
    sortOrder,
    pagination 
  } = useSelector(state => state.gym)
  
  const filteredGyms = useSelector(selectFilteredGyms)

  const handleGymClick = useCallback((gym) => {
    dispatch(selectGym(gym))
    // Navigate to gym detail page
    // This would typically use react-router
    console.log('Navigate to gym:', gym)
  }, [dispatch])

  const handleSearchChange = useCallback((query) => {
    dispatch(setSearchQuery(query))
  }, [dispatch])

  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters))
  }, [dispatch])

  const handleSortChange = useCallback((field, order) => {
    dispatch(setSorting({ sortBy: field, sortOrder: order }))
  }, [dispatch])

  const handleLoadMore = useCallback(() => {
    dispatch(loadMoreGyms())
  }, [dispatch])

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            체육관 정보를 불러오는 중 오류가 발생했습니다
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            잠시 후 다시 시도해 주세요
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <SearchBar 
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="체육관 이름이나 위치로 검색"
        />
      </Box>

      {/* Filter and Sort Controls */}
      <Box sx={{ mb: 3 }}>
        <FilterControls 
          filters={filters}
          onChange={handleFilterChange}
        />
        <SortControls 
          sortBy={sortBy}
          sortOrder={sortOrder}
          onChange={handleSortChange}
        />
      </Box>

      {/* Results Summary */}
      {searchQuery || Object.values(filters).some(Boolean) ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredGyms.length}개의 체육관이 검색되었습니다
          </Typography>
        </Box>
      ) : null}

      {/* Gym List with Infinite Scroll */}
      <InfiniteScroll
        items={filteredGyms}
        loading={loading}
        hasMore={pagination.hasMore}
        onLoadMore={handleLoadMore}
        renderItem={(gym, index) => (
          <GymCard 
            key={gym.id || index}
            gym={gym}
            onClick={handleGymClick}
            loading={loading && index >= filteredGyms.length - 5}
          />
        )}
        loadingComponent={
          <Box>
            {Array.from({ length: 3 }).map((_, index) => (
              <GymCard key={`loading-${index}`} loading />
            ))}
          </Box>
        }
        emptyComponent={
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              검색 결과가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              다른 검색어나 필터를 사용해 보세요
            </Typography>
          </Box>
        }
      />
    </Container>
  )
}

export default GymList