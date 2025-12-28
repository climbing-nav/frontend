import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
  loginAsync,
  loginSuccess,
  logout,
  clearError
} from '../store/slices/authSlice'
import { authService } from '../services/authService'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth)

  const loginUser = useCallback(async (credentials) => {
    try {
      const result = await dispatch(loginAsync(credentials))
      if (loginAsync.fulfilled.match(result)) {
        return { success: true }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

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
    login: loginUser,
    logout: logoutUser,
    getCurrentUser,
    clearError: clearAuthError
  }
}
