import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_MAP_CENTER } from '../../utils/constants'

// Helper functions for localStorage
const loadMapStateFromStorage = () => {
  try {
    const savedState = localStorage.getItem('kakaoMapState')
    if (savedState) {
      const parsed = JSON.parse(savedState)
      return {
        center: parsed.center || DEFAULT_MAP_CENTER,
        zoom: parsed.zoom || 13,
        viewport: parsed.viewport || { width: '100%', height: 400 },
        userLocation: parsed.userLocation || null
      }
    }
  } catch (error) {
    console.error('Error loading map state from storage:', error)
  }
  return {}
}

const saveMapStateToStorage = (state) => {
  try {
    const stateToSave = {
      center: state.center,
      zoom: state.zoom,
      viewport: state.viewport,
      userLocation: state.userLocation,
      timestamp: Date.now()
    }
    localStorage.setItem('kakaoMapState', JSON.stringify(stateToSave))
  } catch (error) {
    console.error('Error saving map state to storage:', error)
  }
}

const persistedState = loadMapStateFromStorage()

const initialState = {
  center: persistedState.center || DEFAULT_MAP_CENTER,
  zoom: persistedState.zoom || 13,
  selectedGymId: null,
  userLocation: persistedState.userLocation || null,
  isLocationLoading: false,
  locationError: null,
  markers: [],
  // Map loading states
  isMapLoading: false,
  mapError: null,
  isKakaoLoaded: false,
  // Marker loading states
  isMarkersLoading: false,
  markersError: null,
  // Bounds and viewport
  bounds: null,
  viewport: persistedState.viewport || {
    width: '100%',
    height: 400
  }
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state, action) => {
      state.center = action.payload
    },
    setZoom: (state, action) => {
      state.zoom = action.payload
    },
    setSelectedGymId: (state, action) => {
      state.selectedGymId = action.payload
    },
    setUserLocationStart: (state) => {
      state.isLocationLoading = true
      state.locationError = null
    },
    setUserLocationSuccess: (state, action) => {
      state.isLocationLoading = false
      state.userLocation = action.payload
    },
    setUserLocationFailure: (state, action) => {
      state.isLocationLoading = false
      state.locationError = action.payload
    },
    setMarkers: (state, action) => {
      state.markers = action.payload
    },
    addMarker: (state, action) => {
      state.markers.push(action.payload)
    },
    removeMarker: (state, action) => {
      state.markers = state.markers.filter(marker => marker.id !== action.payload)
    },
    clearMap: (state) => {
      state.selectedGymId = null
      state.markers = []
    }
  },
})

export const {
  setCenter,
  setZoom,
  setSelectedGymId,
  setUserLocationStart,
  setUserLocationSuccess,
  setUserLocationFailure,
  setMarkers,
  addMarker,
  removeMarker,
  clearMap
} = mapSlice.actions

export default mapSlice.reducer