import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { 
  fetchGymsStart, 
  fetchGymsSuccess, 
  fetchGymsFailure, 
  selectGym 
} from '../store/slices/gymSlice'
import { gymService } from '../services/gymService'

export const useGyms = () => {
  const dispatch = useDispatch()
  const { gyms, selectedGym, loading, error } = useSelector(state => state.gym)

  const fetchGyms = useCallback(async () => {
    try {
      dispatch(fetchGymsStart())
      const response = await gymService.getAllGyms()
      dispatch(fetchGymsSuccess(response.gyms || response))
      return { success: true, gyms: response.gyms || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '암장 정보를 불러오는데 실패했습니다.'
      dispatch(fetchGymsFailure(errorMessage))
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const fetchNearbyGyms = useCallback(async (lat, lng, radius = 5) => {
    try {
      dispatch(fetchGymsStart())
      const response = await gymService.getGymsByLocation(lat, lng, radius)
      dispatch(fetchGymsSuccess(response.gyms || response))
      return { success: true, gyms: response.gyms || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '주변 암장을 찾는데 실패했습니다.'
      dispatch(fetchGymsFailure(errorMessage))
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const getGymById = useCallback(async (id) => {
    try {
      const response = await gymService.getGymById(id)
      return { success: true, gym: response.gym || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '암장 정보를 불러오는데 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }, [])

  const getCongestion = useCallback(async (gymId) => {
    try {
      const response = await gymService.getGymCongestion(gymId)
      return { success: true, congestion: response.congestion || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '혼잡도 정보를 불러오는데 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }, [])

  const updateCongestion = useCallback(async (gymId, congestionLevel) => {
    try {
      const response = await gymService.updateGymCongestion(gymId, congestionLevel)
      return { success: true, congestion: response.congestion || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '혼잡도 업데이트에 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }, [])

  const selectGymById = useCallback((gym) => {
    dispatch(selectGym(gym))
  }, [dispatch])

  return {
    gyms,
    selectedGym,
    loading,
    error,
    fetchGyms,
    fetchNearbyGyms,
    getGymById,
    getCongestion,
    updateCongestion,
    selectGym: selectGymById
  }
}