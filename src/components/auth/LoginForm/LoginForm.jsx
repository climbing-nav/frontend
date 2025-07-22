import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material'
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  Google
} from '@mui/icons-material'
import { 
  loginAsync, 
  clearError, 
  selectAuthLoading, 
  selectAuthError, 
  selectIsAuthenticated 
} from '../../../store/slices/authSlice'

function LoginForm() {
  const dispatch = useDispatch()
  const loading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})

  // 이메일 유효성 검사 정규식 패턴
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasNonalphas = /\W/.test(password)
    
    if (password.length === 0) {
      return '비밀번호를 입력해주세요'
    }
    if (password.length < minLength) {
      return '비밀번호는 8자 이상이어야 합니다'
    }
    if (!hasUpperCase) {
      return '대문자를 포함해야 합니다'
    }
    if (!hasLowerCase) {
      return '소문자를 포함해야 합니다'
    }
    if (!hasNumbers) {
      return '숫자를 포함해야 합니다'
    }
    if (!hasNonalphas) {
      return '특수문자를 포함해야 합니다'
    }
    return null
  }

  // 이메일 유효성 검사 함수
  const validateEmail = (email) => {
    if (!email) {
      return '이메일을 입력해주세요'
    }
    if (!emailPattern.test(email)) {
      return '올바른 이메일 형식을 입력해주세요'
    }
    return null
  }

  // 실시간 유효성 검사
  const validateField = useCallback((name, value) => {
    let error = null
    
    if (name === 'email') {
      error = validateEmail(value)
    } else if (name === 'password') {
      error = validatePassword(value)
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
    
    return error === null
  }, [])

  // 입력 값 변경 처리 및 실시간 유효성 검사
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 필드를 터치됨으로 표시
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }))
    
    // 실시간 유효성 검사 수행
    validateField(name, value)
  }

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 모든 필드 유효성 검사
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    
    setErrors({
      email: emailError,
      password: passwordError
    })
    
    // 모든 필드를 터치됨으로 표시
    setTouchedFields({
      email: true,
      password: true
    })
    
    if (emailError || passwordError) {
      return
    }
    
    // Redux dispatch를 사용한 로그인 처리
    dispatch(loginAsync(formData))
  }

  // 컴포넌트 마운트 시 에러 클리어 및 인증 상태 처리
  useEffect(() => {
    // 컴포넌트 마운트 시 에러 클리어
    if (authError) {
      dispatch(clearError())
    }
  }, [dispatch, authError])

  // 인증 성공 시 처리
  useEffect(() => {
    if (isAuthenticated) {
      console.log('로그인 성공 - 메인 페이지로 이동')
      // 현재 프로젝트에서는 단순 state 기반 네비게이션 사용
      // 실제 프로젝트에서는 React Router를 사용하여 navigate('/dashboard') 등으로 처리
    }
  }, [isAuthenticated])

  // 입력값 변경 시 에러 클리어
  useEffect(() => {
    if (authError) {
      dispatch(clearError())
    }
  }, [formData.email, formData.password, dispatch, authError])

  // 컴포넌트 언마운트 시 클리어
  useEffect(() => {
    return () => {
      if (authError) {
        dispatch(clearError())
      }
    }
  }, [dispatch, authError])

  // 폼이 유효한지 확인
  const isFormValid = !errors.email && !errors.password && formData.email && formData.password

  const handleGoogleLogin = async () => {
    dispatch(clearError())
    try {
      // Google 로그인 로직 구현 예정
      console.log('Google 로그인 시도')
    } catch (error) {
      console.error('Google 로그인 실패:', error)
    }
  }

  const handleKakaoLogin = async () => {
    dispatch(clearError())
    try {
      // Kakao 로그인 로직 구현 예정
      console.log('Kakao 로그인 시도')
    } catch (error) {
      console.error('Kakao 로그인 실패:', error)
    }
  }

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        width: '100%',
        maxWidth: { xs: '100%', sm: '400px' },
        mx: 'auto',
        px: { xs: 2, sm: 0 }
      }}
    >
      {/* 에러 알림 */}
      {(errors.general || authError) && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {errors.general || authError}
        </Alert>
      )}

      {/* 이메일 필드 */}
      <TextField
        name="email"
        type="email"
        placeholder="이메일"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        inputProps={{
          'aria-label': '이메일 입력',
          'aria-describedby': errors.email ? 'email-error' : undefined,
          'aria-invalid': !!errors.email
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: touchedFields.email ? (errors.email ? '#fef2f2' : '#f0f9ff') : '#f9fafb',
            '& fieldset': {
              borderColor: errors.email ? '#ef4444' : (touchedFields.email && !errors.email ? '#10b981' : '#e5e7eb')
            },
            '&:hover fieldset': {
              borderColor: errors.email ? '#ef4444' : '#667eea'
            },
            '&.Mui-focused fieldset': {
              borderColor: errors.email ? '#ef4444' : '#667eea'
            }
          },
          '& .MuiFormHelperText-root': {
            fontWeight: 500,
            color: errors.email ? '#ef4444' : '#10b981'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: errors.email ? '#ef4444' : (touchedFields.email && !errors.email ? '#10b981' : '#6b7280') }} />
            </InputAdornment>
          )
        }}
      />

      {/* 비밀번호 필드 */}
      <TextField
        name="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        inputProps={{
          'aria-label': '비밀번호 입력',
          'aria-describedby': errors.password ? 'password-error' : undefined,
          'aria-invalid': !!errors.password
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: touchedFields.password ? (errors.password ? '#fef2f2' : '#f0f9ff') : '#f9fafb',
            '& fieldset': {
              borderColor: errors.password ? '#ef4444' : (touchedFields.password && !errors.password ? '#10b981' : '#e5e7eb')
            },
            '&:hover fieldset': {
              borderColor: errors.password ? '#ef4444' : '#667eea'
            },
            '&.Mui-focused fieldset': {
              borderColor: errors.password ? '#ef4444' : '#667eea'
            }
          },
          '& .MuiFormHelperText-root': {
            fontWeight: 500,
            color: errors.password ? '#ef4444' : '#10b981'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: errors.password ? '#ef4444' : (touchedFields.password && !errors.password ? '#10b981' : '#6b7280') }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: '#6b7280' }}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {/* 로그인 버튼 */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading || !isFormValid}
        sx={{
          py: 1.5,
          mb: 2,
          borderRadius: 2,
          background: (loading || !isFormValid) ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 600,
          fontSize: 16,
          textTransform: 'none',
          boxShadow: (loading || !isFormValid) ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: (loading || !isFormValid) ? '#d1d5db' : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            boxShadow: (loading || !isFormValid) ? 'none' : '0 6px 16px rgba(102, 126, 234, 0.6)'
          },
          '&:disabled': {
            background: '#d1d5db',
            boxShadow: 'none',
            color: '#9ca3af'
          }
        }}
        aria-label="로그인 버튼"
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
      </Button>

      {/* Forgot Password */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#667eea',
            cursor: 'pointer',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          비밀번호를 잊으셨나요?
        </Typography>
      </Box>

      {/* Divider */}
      <Divider sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#6b7280', px: 2 }}>
          또는
        </Typography>
      </Divider>

      {/* Social Login Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Google Login */}
        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          fullWidth
          disabled={loading}
          sx={{
            py: 1.5,
            borderRadius: 2,
            borderColor: '#e5e7eb',
            color: '#374151',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              borderColor: '#667eea',
              bgcolor: '#f8f9ff'
            }
          }}
          startIcon={<Google />}
        >
          Google로 로그인
        </Button>

        {/* Kakao Login */}
        <Button
          onClick={handleKakaoLogin}
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            py: 1.5,
            borderRadius: 2,
            bgcolor: '#FEE500',
            color: '#000000',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#FDD835'
            },
            '&:disabled': {
              bgcolor: '#d1d5db',
              color: '#6b7280'
            }
          }}
          startIcon={
            <Box sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%',
              bgcolor: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              color: '#FEE500'
            }}>
              K
            </Box>
          }
        >
          Kakao로 로그인
        </Button>
      </Box>
    </Box>
  )
}

export default LoginForm