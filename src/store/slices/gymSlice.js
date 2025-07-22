import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  gyms: [],
  selectedGym: null,
  loading: false,
  error: null,
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
      state.gyms = action.payload
    },
    fetchGymsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    selectGym: (state, action) => {
      state.selectedGym = action.payload
    },
  },
})

export const { fetchGymsStart, fetchGymsSuccess, fetchGymsFailure, selectGym } = gymSlice.actions
export default gymSlice.reducer