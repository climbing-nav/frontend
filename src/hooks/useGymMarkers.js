import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useMemo, useEffect } from 'react'

/**
 * Custom hook for managing gym markers with Redux integration
 * Provides gym data, loading states, and marker management functions
 */
export const useGymMarkers = () => {
  const dispatch = useDispatch()
  
  // Redux state selectors
  const gymState = useSelector(state => state.gym || {})
  const mapState = useSelector(state => state.map || {})
  
  // Extract gym data and states
  const {
    gyms = [],
    isLoading: isGymsLoading = false,
    error: gymError = null,
    selectedGymId = null,
    searchResults = [],
    filters = {},
    isSearching = false
  } = gymState

  // Extract map states
  const {
    center: mapCenter,
    zoom: mapZoom,
    bounds: mapBounds,
    markers = [],
    isMarkersLoading = false,
    markersError = null
  } = mapState

  // Filter gyms based on current filters and map bounds
  const filteredGyms = useMemo(() => {
    let filtered = gyms

    // Apply search results filter
    if (isSearching && searchResults.length > 0) {
      const searchIds = new Set(searchResults.map(result => result.id))
      filtered = filtered.filter(gym => searchIds.has(gym.id))
    }

    // Apply congestion filter
    if (filters.congestion && filters.congestion.length > 0) {
      filtered = filtered.filter(gym => filters.congestion.includes(gym.congestion))
    }

    // Apply facilities filter
    if (filters.facilities && filters.facilities.length > 0) {
      filtered = filtered.filter(gym => 
        gym.facilities && gym.facilities.some(facility => 
          filters.facilities.includes(facility)
        )
      )
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(gym => 
        gym.tags && gym.tags.some(tag => 
          filters.tags.includes(tag)
        )
      )
    }

    // Apply map bounds filter if available
    if (mapBounds && filtered.length > 0) {
      const { southWest, northEast } = mapBounds
      filtered = filtered.filter(gym => 
        gym.lat >= southWest.lat && 
        gym.lat <= northEast.lat &&
        gym.lng >= southWest.lng && 
        gym.lng <= northEast.lng
      )
    }

    return filtered
  }, [gyms, isSearching, searchResults, filters, mapBounds])

  // Get visible gyms for current map state
  const visibleGyms = useMemo(() => {
    // Apply additional visibility logic if needed
    return filteredGyms.filter(gym => {
      // Could add distance-based filtering here
      return true
    })
  }, [filteredGyms])

  // Gym marker actions
  const selectGym = useCallback((gymId) => {
    dispatch({ type: 'gym/setSelectedGym', payload: gymId })
  }, [dispatch])

  const clearGymSelection = useCallback(() => {
    dispatch({ type: 'gym/clearSelectedGym' })
  }, [dispatch])

  // Update map markers
  const updateMarkers = useCallback((newMarkers) => {
    dispatch({ type: 'map/setMarkers', payload: newMarkers })
  }, [dispatch])

  // Set markers loading state
  const setMarkersLoading = useCallback((loading) => {
    dispatch({ type: 'map/setMarkersLoading', payload: loading })
  }, [dispatch])

  // Set markers error
  const setMarkersError = useCallback((error) => {
    dispatch({ type: 'map/setMarkersError', payload: error })
  }, [dispatch])

  // Handle gym marker click
  const handleGymClick = useCallback((gym, marker, event) => {
    selectGym(gym.id)
    
    // Update map center if needed
    if (mapCenter.lat !== gym.lat || mapCenter.lng !== gym.lng) {
      dispatch({ 
        type: 'map/setCenter', 
        payload: { lat: gym.lat, lng: gym.lng } 
      })
    }

    // Optional: zoom in for better view
    if (mapZoom > 5) {
      dispatch({ type: 'map/setZoom', payload: 3 })
    }
  }, [dispatch, selectGym, mapCenter, mapZoom])

  // Handle cluster click
  const handleClusterClick = useCallback((cluster, marker) => {
    // Calculate bounds for all gyms in cluster
    if (cluster.gyms && cluster.gyms.length > 0) {
      const lats = cluster.gyms.map(gym => gym.lat)
      const lngs = cluster.gyms.map(gym => gym.lng)
      
      const bounds = {
        southWest: {
          lat: Math.min(...lats),
          lng: Math.min(...lngs)
        },
        northEast: {
          lat: Math.max(...lats),
          lng: Math.max(...lngs)
        }
      }
      
      dispatch({ type: 'map/setBounds', payload: bounds })
      
      // Zoom in to show cluster
      const newZoom = Math.max(1, mapZoom - 2)
      dispatch({ type: 'map/setZoom', payload: newZoom })
    }
  }, [dispatch, mapZoom])

  // Get gym by ID
  const getGymById = useCallback((gymId) => {
    return gyms.find(gym => gym.id === gymId)
  }, [gyms])

  // Get selected gym
  const selectedGym = useMemo(() => {
    return selectedGymId ? getGymById(selectedGymId) : null
  }, [selectedGymId, getGymById])

  // Check if gym is selected
  const isGymSelected = useCallback((gymId) => {
    return selectedGymId === gymId
  }, [selectedGymId])

  // Loading states
  const isLoading = useMemo(() => {
    return isGymsLoading || isMarkersLoading || isSearching
  }, [isGymsLoading, isMarkersLoading, isSearching])

  // Error states
  const hasError = useMemo(() => {
    return !!(gymError || markersError)
  }, [gymError, markersError])

  const error = useMemo(() => {
    return gymError || markersError
  }, [gymError, markersError])

  // Stats
  const stats = useMemo(() => {
    return {
      totalGyms: gyms.length,
      filteredGyms: filteredGyms.length,
      visibleGyms: visibleGyms.length,
      congestionBreakdown: visibleGyms.reduce((acc, gym) => {
        acc[gym.congestion] = (acc[gym.congestion] || 0) + 1
        return acc
      }, {}),
      hasFilters: Object.values(filters).some(filter => 
        Array.isArray(filter) ? filter.length > 0 : !!filter
      )
    }
  }, [gyms, filteredGyms, visibleGyms, filters])

  return {
    // Data
    gyms,
    filteredGyms,
    visibleGyms,
    selectedGym,
    selectedGymId,
    
    // States
    isLoading,
    isGymsLoading,
    isMarkersLoading,
    isSearching,
    hasError,
    error,
    gymError,
    markersError,
    
    // Map state
    mapCenter,
    mapZoom,
    mapBounds,
    markers,
    
    // Search & filters
    searchResults,
    filters,
    
    // Actions
    selectGym,
    clearGymSelection,
    updateMarkers,
    setMarkersLoading,
    setMarkersError,
    
    // Event handlers
    handleGymClick,
    handleClusterClick,
    
    // Utilities
    getGymById,
    isGymSelected,
    stats
  }
}