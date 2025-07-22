import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import gymSlice from './slices/gymSlice'
import mapSlice from './slices/mapSlice'
import communitySlice from './slices/communitySlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    gym: gymSlice,
    map: mapSlice,
    community: communitySlice,
  },
})

export default store