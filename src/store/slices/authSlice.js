import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import { authStorage } from '../../utils/authStorage'

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
// 쿠키에서 ACCESS 토큰을 읽어 Authorization 헤더에 추가하여 /api/user/me 호출
export const checkCookieAuthAsync = createAsyncThunk(
  'auth/checkCookieAuthAsync',
  async (_, { rejectWithValue }) => {
    try {
      // api.js 인터셉터가 쿠키에서 토큰을 읽어 Authorization 헤더에 추가함
      const user = await authService.getCurrentUser()

      // 서버에서 유효한 사용자 정보를 반환한 경우
      if (user) {
        return {
          user,
          token: null, // 토큰은 쿠키에 저장되어 있음
          provider: user.provider || 'unknown'
        }
      }

      // 사용자 정보가 없는 경우
      return { user: null, token: null, provider: null }
    } catch (error) {
      // 인증 실패 (401, 403 등) - api.js에서 자동으로 토큰 갱신 시도
      console.log('인증 상태 확인 실패:', error.message)
      return { user: null, token: null, provider: null }
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

// 서버 사이드 렌더링 환경에서는 기본값 사용
const isBrowser = typeof window !== 'undefined'

const initialState = {
  user: isBrowser ? authStorage.getUserData() : null,
  isAuthenticated: isBrowser ? authStorage.hasValidAuth() : false,
  loading: false,
  error: null,
  token: isBrowser ? authStorage.getToken() : null,
  authProvider: isBrowser ? authStorage.getAuthProvider() : null,
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
        state.token = null // 쿠키 기반 인증에서는 클라이언트가 토큰을 직접 관리하지 않음
        state.authProvider = 'google'
        state.error = null

        // 쿠키 기반 인증 사용 - localStorage 저장 불필요
        // 서버가 HttpOnly 쿠키로 토큰 관리
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

        if (action.payload.user) {
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = null // 쿠키 기반 인증에서는 토큰을 클라이언트에서 관리하지 않음
          state.authProvider = action.payload.provider
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