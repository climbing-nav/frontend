import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError,
  registerAsync 
} from '../store/slices/authSlice'
import { authService } from '../services/authService'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth)

  const login = useCallback(async (credentials) => {
    try {
      dispatch(loginStart())
      const response = await authService.login(credentials)
      
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
      
      dispatch(loginSuccess(response.user))
      return { success: true, user: response.user }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.'
      dispatch(loginFailure(errorMessage))
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const register = useCallback(async (userData) => {
    try {
      const result = await dispatch(registerAsync(userData)).unwrap()
      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: error }
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
    login,
    register,
    logout: logoutUser,
    getCurrentUser,
    clearError: clearAuthError
  }
}