import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_MAP_CENTER } from '../../utils/constants'

const initialState = {
  center: DEFAULT_MAP_CENTER,
  zoom: 13,
  selectedGymId: null,
  userLocation: null,
  isLocationLoading: false,
  locationError: null,
  markers: [],
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