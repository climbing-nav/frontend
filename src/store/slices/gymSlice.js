import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  gyms: [],
  filteredGyms: [],
  selectedGym: null,
  loading: false,
  error: null,
  filters: {
    location: '',
    type: '',
    congestion: ''
  },
  searchQuery: '',
  sortBy: 'distance',
  sortOrder: 'asc',
  pagination: {
    page: 1,
    limit: 20,
    hasMore: true
  }
}

const gymSlice = createSlice({
  name: 'gym',
  initialState,
  reducers: {
    fetchGymsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchGymsSuccess: (state, action) => {
      state.loading = false
      const { gyms, hasMore, page } = action.payload
      
      if (page === 1) {
        state.gyms = gyms
      } else {
        state.gyms = [...state.gyms, ...gyms]
      }
      
      state.pagination.page = page
      state.pagination.hasMore = hasMore || false
      state.filteredGyms = state.gyms
    },
    fetchGymsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    selectGym: (state, action) => {
      state.selectedGym = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.pagination.page = 1
    },
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload
      state.sortBy = sortBy
      state.sortOrder = sortOrder
    },
    clearFilters: (state) => {
      state.filters = {
        location: '',
        type: '',
        congestion: ''
      }
      state.searchQuery = ''
      state.pagination.page = 1
    },
    loadMoreGyms: (state) => {
      if (state.pagination.hasMore && !state.loading) {
        state.pagination.page += 1
      }
    },
    resetPagination: (state) => {
      state.pagination.page = 1
      state.pagination.hasMore = true
    }
  },
})

export const { 
  fetchGymsStart, 
  fetchGymsSuccess, 
  fetchGymsFailure, 
  selectGym,
  setFilters,
  setSearchQuery,
  setSorting,
  clearFilters,
  loadMoreGyms,
  resetPagination
} = gymSlice.actions

// Selectors
export const selectFilteredGyms = (state) => {
  let result = [...state.gym.gyms]
  const { filters, searchQuery, sortBy, sortOrder } = state.gym

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim()
    result = result.filter(gym => 
      gym.name.toLowerCase().includes(query) ||
      gym.address.toLowerCase().includes(query) ||
      (gym.tags && gym.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }

  // Apply filters
  if (filters.location) {
    result = result.filter(gym => 
      gym.address.toLowerCase().includes(filters.location.toLowerCase())
    )
  }

  if (filters.type) {
    result = result.filter(gym => 
      gym.tags && gym.tags.some(tag => 
        tag.toLowerCase().includes(filters.type.toLowerCase())
      )
    )
  }

  if (filters.congestion) {
    result = result.filter(gym => gym.crowdedness === filters.congestion)
  }

  // Apply sorting
  result.sort((a, b) => {
    let valueA, valueB

    switch (sortBy) {
      case 'distance':
        valueA = a.distance || 0
        valueB = b.distance || 0
        break
      case 'rating':
        valueA = a.rating || 0
        valueB = b.rating || 0
        break
      case 'name':
        valueA = a.name.toLowerCase()
        valueB = b.name.toLowerCase()
        break
      default:
        return 0
    }

    if (typeof valueA === 'string') {
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    }

    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA
  })

  return result
}

export default gymSlice.reducer