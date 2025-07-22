import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import {
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
} from '../store/slices/mapSlice'

export const useMap = () => {
  const dispatch = useDispatch()
  const { 
    center, 
    zoom, 
    selectedGymId, 
    userLocation, 
    isLocationLoading, 
    locationError, 
    markers 
  } = useSelector(state => state.map)

  const updateCenter = useCallback((newCenter) => {
    dispatch(setCenter(newCenter))
  }, [dispatch])

  const updateZoom = useCallback((newZoom) => {
    dispatch(setZoom(newZoom))
  }, [dispatch])

  const selectGym = useCallback((gymId) => {
    dispatch(setSelectedGymId(gymId))
  }, [dispatch])

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch(setUserLocationFailure('위치 서비스가 지원되지 않습니다.'))
      return
    }

    dispatch(setUserLocationStart())

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        dispatch(setUserLocationSuccess(location))
      },
      (error) => {
        let errorMessage = '위치를 가져올 수 없습니다.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 권한이 거부되었습니다.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            break
          case error.TIMEOUT:
            errorMessage = '위치 요청 시간이 초과되었습니다.'
            break
          default:
            errorMessage = '알 수 없는 오류가 발생했습니다.'
            break
        }
        
        dispatch(setUserLocationFailure(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }, [dispatch])

  const updateMarkers = useCallback((newMarkers) => {
    dispatch(setMarkers(newMarkers))
  }, [dispatch])

  const addNewMarker = useCallback((marker) => {
    dispatch(addMarker(marker))
  }, [dispatch])

  const removeMarkerById = useCallback((markerId) => {
    dispatch(removeMarker(markerId))
  }, [dispatch])

  const clearAllMarkers = useCallback(() => {
    dispatch(clearMap())
  }, [dispatch])

  const moveToUserLocation = useCallback(() => {
    if (userLocation) {
      dispatch(setCenter(userLocation))
      dispatch(setZoom(15))
    } else {
      getUserLocation()
    }
  }, [userLocation, dispatch, getUserLocation])

  // Auto-get user location on mount
  useEffect(() => {
    if (!userLocation && !isLocationLoading && !locationError) {
      getUserLocation()
    }
  }, [])

  return {
    center,
    zoom,
    selectedGymId,
    userLocation,
    isLocationLoading,
    locationError,
    markers,
    updateCenter,
    updateZoom,
    selectGym,
    getUserLocation,
    updateMarkers,
    addNewMarker,
    removeMarkerById,
    clearAllMarkers,
    moveToUserLocation
  }
}