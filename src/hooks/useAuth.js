import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
  loginSuccess,
  logout,
  clearError
} from '../store/slices/authSlice'
import { authService } from '../services/authService'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth)

  const logoutUser = useCallback(async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch(logout())
    }
  }, [dispatch])

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser()
      dispatch(loginSuccess(response.user))
      return response.user
    } catch (error) {
      dispatch(logout())
      return null
    }
  }, [dispatch])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout: logoutUser,
    getCurrentUser,
    clearError: clearAuthError
  }
}
