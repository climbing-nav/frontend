import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import { authStorage } from '../../utils/authStorage'

// 쿠키에서 JWT 토큰을 읽는 유틸리티 함수
const getCookieValue = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// JWT 토큰 디코딩 함수 (간단한 payload 추출)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('JWT 디코딩 실패:', error)
    return null
  }
}

// Async thunk for login
export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || '로그인에 실패했습니다.')
    }
  }
)

// Async thunk for logout
export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || '로그아웃에 실패했습니다.')
    }
  }
)

// Async thunk for getting current user
export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUserAsync',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser()
      return user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || '사용자 정보를 가져올 수 없습니다.')
    }
  }
)

// Async thunk for Google login
export const googleLoginAsync = createAsyncThunk(
  'auth/googleLoginAsync',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(credential)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || '구글 로그인에 실패했습니다.')
    }
  }
)


// Async thunk for registration
export const registerAsync = createAsyncThunk(
  'auth/registerAsync',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      // 회원가입 성공 후 토큰을 로컬 스토리지에 저장
      if (response.token) {
        authStorage.setToken(response.token)
        authStorage.setUserData(response.user)
        authStorage.setAuthProvider('email')
        if (response.refresh_token) {
          authStorage.setRefreshToken(response.refresh_token)
        }
      }
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || '회원가입에 실패했습니다.')
    }
  }
)

// 쿠키 기반 인증 상태 확인을 위한 thunk
export const checkCookieAuthAsync = createAsyncThunk(
  'auth/checkCookieAuthAsync',
  async (_, { rejectWithValue }) => {
    try {
      // 쿠키에서 ACCESS 토큰 확인 (보안: HttpOnly 쿠키 권장)
      const accessToken = getCookieValue('ACCESS')
      const refreshToken = getCookieValue('REFRESH')

      if (accessToken) {
        // JWT 토큰 디코딩하여 사용자 정보 추출
        const decoded = decodeJWT(accessToken)

        if (decoded && decoded.exp && Date.now() < decoded.exp * 1000) {
          // 토큰이 유효한 경우 사용자 정보 구성
          const user = {
            id: decoded.sub || decoded.id || decoded.user_id,
            email: decoded.email || '',
            nickname: decoded.nickname || decoded.name || '',
            avatar: decoded.avatar || decoded.picture || '',
          }

          // 카카오 로그인인지 확인 (provider 필드 또는 토큰 내용으로 판단)
          const provider = decoded.provider || decoded.kp || 'kakao'

          // [보안] 쿠키 기반 인증 사용 시 LocalStorage 저장 불필요
          // 쿠키는 HttpOnly로 설정하여 XSS 공격으로부터 보호 가능
          // LocalStorage는 JavaScript로 접근 가능하여 XSS에 취약
          // authStorage.setToken(accessToken)
          // authStorage.setUserData(user)
          // authStorage.setAuthProvider(provider)
          // if (refreshToken) {
          //   authStorage.setRefreshToken(refreshToken)
          // }

          return {
            user,
            token: accessToken,
            provider
          }
        }
      }

      // 로컬 스토리지에서 fallback 체크 (이메일 로그인 등 쿠키를 사용하지 않는 경우)
      const token = authStorage.getToken()
      const userData = authStorage.getUserData()
      const provider = authStorage.getAuthProvider()

      if (!token || !userData) {
        return { user: null, token: null, provider: null }
      }

      // 토큰이 만료되었는지 확인
      if (authStorage.isTokenExpired(token)) {
        const refreshToken = authStorage.getRefreshToken()
        if (refreshToken) {
          try {
            // 토큰 갱신 시도
            const refreshResponse = await authService.refreshToken()
            authStorage.setToken(refreshResponse.token)
            if (refreshResponse.refresh_token) {
              authStorage.setRefreshToken(refreshResponse.refresh_token)
            }
            return {
              user: userData,
              token: refreshResponse.token,
              provider
            }
          } catch (refreshError) {
            // 토큰 갱신 실패시 로그아웃 처리
            authStorage.clearAuthData()
            return { user: null, token: null, provider: null }
          }
        } else {
          // Refresh token이 없으면 로그아웃 처리
          authStorage.clearAuthData()
          return { user: null, token: null, provider: null }
        }
      }

      return {
        user: userData,
        token,
        provider
      }
    } catch (error) {
      authStorage.clearAuthData()
      return rejectWithValue('인증 상태 초기화에 실패했습니다.')
    }
  }
)

// 기존 로컬 스토리지 기반 초기화 (호환성을 위해 유지)
export const initializeAuthAsync = createAsyncThunk(
  'auth/initializeAuthAsync',
  async (_, { rejectWithValue }) => {
    try {
      const token = authStorage.getToken()
      const userData = authStorage.getUserData()
      const provider = authStorage.getAuthProvider()

      if (!token || !userData) {
        return { user: null, token: null, provider: null }
      }

      // 토큰이 만료되었는지 확인
      if (authStorage.isTokenExpired(token)) {
        const refreshToken = authStorage.getRefreshToken()
        if (refreshToken) {
          try {
            // 토큰 갱신 시도
            const refreshResponse = await authService.refreshToken()
            authStorage.setToken(refreshResponse.token)
            if (refreshResponse.refresh_token) {
              authStorage.setRefreshToken(refreshResponse.refresh_token)
            }
            return {
              user: userData,
              token: refreshResponse.token,
              provider
            }
          } catch (refreshError) {
            // 토큰 갱신 실패시 로그아웃 처리
            authStorage.clearAuthData()
            return { user: null, token: null, provider: null }
          }
        } else {
          // Refresh token이 없으면 로그아웃 처리
          authStorage.clearAuthData()
          return { user: null, token: null, provider: null }
        }
      }

      return {
        user: userData,
        token,
        provider
      }
    } catch (error) {
      authStorage.clearAuthData()
      return rejectWithValue('인증 상태 초기화에 실패했습니다.')
    }
  }
)

const initialState = {
  user: authStorage.getUserData(),
  isAuthenticated: authStorage.hasValidAuth(),
  loading: false,
  error: null,
  token: authStorage.getToken(),
  authProvider: authStorage.getAuthProvider(),
  isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.authProvider = action.payload.provider || 'email'
      state.error = null
      
      // 로컬 스토리지에 저장
      authStorage.setToken(action.payload.token)
      authStorage.setUserData(action.payload.user)
      authStorage.setAuthProvider(action.payload.provider || 'email')
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.authProvider = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.token = null
      state.authProvider = null
      state.loading = false
      
      // 로컬 스토리지 정리
      authStorage.clearAuthData()
    },
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      authStorage.setUserData(state.user)
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.authProvider = 'email'
        state.error = null
        
        // 로컬 스토리지에 저장
        authStorage.setToken(action.payload.token)
        authStorage.setUserData(action.payload.user)
        authStorage.setAuthProvider('email')
        if (action.payload.refresh_token) {
          authStorage.setRefreshToken(action.payload.refresh_token)
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Logout cases
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
        state.token = null
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        // Still logout locally even if server request fails
        state.user = null
        state.isAuthenticated = false
        state.token = null
      })
      // Get current user cases
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Google login cases
      .addCase(googleLoginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(googleLoginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.authProvider = 'google'
        state.error = null
        
        // 로컬 스토리지에 저장
        authStorage.setToken(action.payload.token)
        authStorage.setUserData(action.payload.user)
        authStorage.setAuthProvider('google')
        if (action.payload.refresh_token) {
          authStorage.setRefreshToken(action.payload.refresh_token)
        }
      })
      .addCase(googleLoginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Registration cases
      .addCase(registerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.authProvider = null
      })
      // Check cookie auth cases
      .addCase(checkCookieAuthAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(checkCookieAuthAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isInitialized = true

        if (action.payload.user && action.payload.token) {
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
          state.authProvider = action.payload.provider

          // [보안] 쿠키 기반 인증 사용 시 LocalStorage 저장 불필요
          // 쿠키(HttpOnly)가 XSS 공격으로부터 더 안전함
          // if (action.payload.provider === 'kakao') {
          //   authStorage.setToken(action.payload.token)
          //   authStorage.setUserData(action.payload.user)
          //   authStorage.setAuthProvider('kakao')
          // }
        } else {
          state.isAuthenticated = false
          state.user = null
          state.token = null
          state.authProvider = null
        }
        state.error = null
      })
      .addCase(checkCookieAuthAsync.rejected, (state, action) => {
        state.loading = false
        state.isInitialized = true
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.authProvider = null
        state.error = action.payload
      })
      // Initialize auth cases (기존 로컬 스토리지 기반)
      .addCase(initializeAuthAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(initializeAuthAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isInitialized = true

        if (action.payload.user && action.payload.token) {
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
          state.authProvider = action.payload.provider
        } else {
          state.isAuthenticated = false
          state.user = null
          state.token = null
          state.authProvider = null
        }
        state.error = null
      })
      .addCase(initializeAuthAsync.rejected, (state, action) => {
        state.loading = false
        state.isInitialized = true
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.authProvider = null
        state.error = action.payload
      })
  },
})

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError, 
  setLoading,
  updateUserProfile
} = authSlice.actions

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectToken = (state) => state.auth.token
export const selectAuthProvider = (state) => state.auth.authProvider
export const selectIsAuthInitialized = (state) => state.auth.isInitialized

// Combined selectors
export const selectAuthStatus = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isInitialized: state.auth.isInitialized,
  loading: state.auth.loading,
  user: state.auth.user,
  provider: state.auth.authProvider
})

export default authSlice.reducer