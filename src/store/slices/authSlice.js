import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

// httpOnly 쿠키 사용 시:
// - document.cookie로 쿠키 읽기 불가능 (XSS 방어)
// - 모든 인증은 서버 API를 통해 확인
// - 쿠키는 withCredentials: true로 자동 전송됨

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
      // 서버가 Set-Cookie로 쿠키 설정 (자동 로그인)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || '회원가입에 실패했습니다.')
    }
  }
)

// httpOnly 쿠키 기반 인증 상태 확인을 위한 thunk
// ⚠️ httpOnly 쿠키는 JavaScript로 읽을 수 없음
// 서버 API(/auth/me)를 호출하여 인증 상태 확인
export const checkCookieAuthAsync = createAsyncThunk(
  'auth/checkCookieAuthAsync',
  async (_, { rejectWithValue }) => {
    try {
      // 서버가 httpOnly 쿠키를 확인하고 사용자 정보 반환
      // withCredentials: true로 쿠키가 자동 전송됨
      const user = await authService.getCurrentUser()

      if (user && user.id) {
        // 서버에서 인증 성공
        const provider = user.provider || 'email'

        return {
          user,
          token: null, // httpOnly 쿠키 사용 시 클라이언트에 토큰 노출 안 함
          provider
        }
      }

      // 사용자 정보가 없으면 미인증 상태
      return { user: null, token: null, provider: null }
    } catch (error) {
      // 401 또는 서버 에러: 쿠키가 없거나 만료됨
      if (error.response?.status === 401) {
        return { user: null, token: null, provider: null }
      }
      return rejectWithValue('인증 상태 확인에 실패했습니다.')
    }
  }
)

// httpOnly 쿠키 기반 인증에서는 localStorage 불필요
// 모든 인증 상태는 서버 API로 확인
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null, // httpOnly 쿠키 사용 시 항상 null
  authProvider: null,
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
      state.token = null // httpOnly 쿠키 사용
      state.authProvider = action.payload.provider || 'email'
      state.error = null
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
    },
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
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
        state.token = null // httpOnly 쿠키 사용
        state.authProvider = 'email'
        state.error = null
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
        state.token = null // httpOnly 쿠키 사용
        state.authProvider = 'google'
        state.error = null
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
        state.token = null // httpOnly 쿠키 사용
        state.authProvider = 'email'
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