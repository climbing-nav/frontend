import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import { authStorage } from '../../utils/authStorage'

// Async thunk for email login (관리자용)
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
  async ({ code, redirectUri }, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(code, redirectUri)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || '구글 로그인에 실패했습니다.')
    }
  }
)

// Async thunk for Kakao login
export const kakaoLoginAsync = createAsyncThunk(
  'auth/kakaoLoginAsync',
  async ({ code, redirectUri }, { rejectWithValue }) => {
    try {
      const response = await authService.kakaoLogin(code, redirectUri)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || '카카오 로그인에 실패했습니다.')
    }
  }
)

// localStorage 기반 인증 상태 초기화
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

      // 토큰 유효성은 첫 API 요청 시 응답 인터셉터가 자동으로 검증
      // 만료된 경우 인터셉터가 자동으로 갱신
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
    setAuthError: (state, action) => {
      state.error = action.payload
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
      // Email login cases (관리자용)
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
        // 백엔드 응답이 { data: { email, nickname, avatar }, token, ... } 형태
        state.user = {
          email: action.payload.data.email,
          nickname: action.payload.data.nickname,
          avatar: action.payload.data.avatar
        }
        state.token = action.payload.token
        state.authProvider = 'google'
        state.error = null

        // localStorage에 ACCESS 토큰 및 사용자 정보 저장 (REFRESH 토큰은 HttpOnly 쿠키로 관리)
        authStorage.setToken(action.payload.token)
        authStorage.setUserData({
          email: action.payload.data.email,
          nickname: action.payload.data.nickname,
          avatar: action.payload.data.avatar
        })
        authStorage.setAuthProvider('google')
      })
      .addCase(googleLoginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Kakao login cases
      .addCase(kakaoLoginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(kakaoLoginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        // 백엔드 응답이 { data: { email, nickname, avatar }, token, ... } 형태
        state.user = {
          email: action.payload.data.email,
          nickname: action.payload.data.nickname,
          avatar: action.payload.data.avatar
        }
        state.token = action.payload.token
        state.authProvider = 'kakao'
        state.error = null

        // localStorage에 ACCESS 토큰 및 사용자 정보 저장 (REFRESH 토큰은 HttpOnly 쿠키로 관리)
        authStorage.setToken(action.payload.token)
        authStorage.setUserData({
          email: action.payload.data.email,
          nickname: action.payload.data.nickname,
          avatar: action.payload.data.avatar
        })
        authStorage.setAuthProvider('kakao')
      })
      .addCase(kakaoLoginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Initialize auth cases (localStorage 기반)
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
  setAuthError,
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