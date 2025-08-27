import { useState, useCallback, useEffect, useRef } from 'react'
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
import { useGoogleAuth } from '../../../hooks/useGoogleAuth'
import { useKakaoAuth } from '../../../hooks/useKakaoAuth'

function LoginForm() {
  const dispatch = useDispatch()
  const loading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  // 소셜 로그인 Hooks
  const { signInWithGoogle, isGoogleScriptLoaded } = useGoogleAuth()
  const { signInWithKakao, isKakaoScriptLoaded } = useKakaoAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    kakao: false
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const submitButtonRef = useRef(null)

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
    setSubmitAttempted(true)
    
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
    
    // 에러가 있으면 첫 번째 에러 필드에 포커스
    if (emailError || passwordError) {
      if (emailError && emailInputRef.current) {
        emailInputRef.current.focus()
      } else if (passwordError && passwordInputRef.current) {
        passwordInputRef.current.focus()
      }
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

  // 키보드 네비게이션 핸들러
  const handleKeyDown = (e) => {
    // Enter 키로 다음 필드로 이동
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.target.name === 'email' && passwordInputRef.current) {
        e.preventDefault()
        passwordInputRef.current.focus()
      } else if (e.target.name === 'password' && submitButtonRef.current) {
        e.preventDefault()
        if (isFormValid) {
          submitButtonRef.current.click()
        }
      }
    }
  }

  // 폼이 유효한지 확인
  const isFormValid = !errors.email && !errors.password && formData.email && formData.password

  const handleGoogleLogin = async () => {
    dispatch(clearError())
    setSocialLoading(prev => ({ ...prev, google: true }))
    
    try {
      if (!isGoogleScriptLoaded) {
        throw new Error('Google SDK가 아직 로드되지 않았습니다.')
      }
      
      await signInWithGoogle()
    } catch (error) {
      console.error('Google 로그인 실패:', error)
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Google 로그인에 실패했습니다.' 
      }))
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }))
    }
  }

  const handleKakaoLogin = async () => {
    dispatch(clearError())
    setSocialLoading(prev => ({ ...prev, kakao: true }))
    
    try {
      if (!isKakaoScriptLoaded) {
        throw new Error('Kakao SDK가 아직 로드되지 않았습니다.')
      }
      
      await signInWithKakao()
    } catch (error) {
      console.error('Kakao 로그인 실패:', error)
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Kakao 로그인에 실패했습니다.' 
      }))
    } finally {
      setSocialLoading(prev => ({ ...prev, kakao: false }))
    }
  }

  return (
    <Box 
      component="section"
      sx={{ 
        width: '100%',
        maxWidth: { xs: '100%', sm: '400px' },
        mx: 'auto',
        px: { xs: 2, sm: 0 }
      }}
    >
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        role="form"
        aria-label="로그인 폼"
        noValidate
      >
      {/* 에러 알림 */}
      {(errors.general || authError) && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, borderRadius: 2 }}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {errors.general || authError}
        </Alert>
      )}

      {/* 이메일 필드 */}
      <TextField
        name="email"
        type="email"
        label="이메일"
        placeholder="이메일을 입력하세요"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        required
        autoComplete="email"
        inputRef={emailInputRef}
        onKeyDown={handleKeyDown}
        inputProps={{
          'aria-label': '이메일 주소 입력',
          'aria-describedby': errors.email ? 'email-error' : 'email-helper',
          'aria-invalid': !!errors.email,
          'aria-required': true
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
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        required
        autoComplete="current-password"
        inputRef={passwordInputRef}
        onKeyDown={handleKeyDown}
        inputProps={{
          'aria-label': '비밀번호 입력',
          'aria-describedby': errors.password ? 'password-error' : 'password-helper',
          'aria-invalid': !!errors.password,
          'aria-required': true
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
                aria-pressed={showPassword}
                tabIndex={0}
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
            boxShadow: (loading || !isFormValid) ? 'none' : '0 6px 16px rgba(102, 126, 234, 0.6)',
            transform: 'translateY(-2px)'
          },
          '&:focus': {
            outline: '2px solid #667eea',
            outlineOffset: '2px'
          },
          '&:disabled': {
            background: '#d1d5db',
            boxShadow: 'none',
            color: '#9ca3af'
          }
        }}
        ref={submitButtonRef}
        aria-label={loading ? '로그인 진행 중' : '로그인 버튼'}
        aria-describedby={loading ? 'login-status' : undefined}
      >
        {loading ? (
          <>
            <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            <span aria-live="polite" id="login-status">로그인 중...</span>
          </>
        ) : (
          '로그인'
        )}
      </Button>

      {/* Forgot Password */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography
          component="button"
          type="button"
          variant="body2"
          sx={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            fontWeight: 500,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            },
            '&:focus': {
              outline: '2px solid #667eea',
              outlineOffset: '2px',
              borderRadius: 1
            }
          }}
          onClick={() => console.log('비밀번호 찾기')}
          aria-label="비밀번호 찾기 페이지로 이동"
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
          disabled={loading || socialLoading.google || !isGoogleScriptLoaded}
          sx={{
            py: 1.5,
            borderRadius: 2,
            borderColor: '#e5e7eb',
            color: '#374151',
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: '#667eea',
              bgcolor: '#f8f9ff',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            },
            '&:focus': {
              outline: '2px solid #667eea',
              outlineOffset: '2px'
            },
            '&:disabled': {
              borderColor: '#d1d5db',
              color: '#9ca3af'
            }
          }}
          startIcon={socialLoading.google ? <CircularProgress size={20} /> : <Google />}
          aria-label={socialLoading.google ? 'Google 로그인 진행 중' : 'Google 계정으로 로그인'}
          aria-describedby={socialLoading.google ? 'google-login-status' : undefined}
        >
          {socialLoading.google ? (
            <span aria-live="polite" id="google-login-status">Google 로그인 중...</span>
          ) : !isGoogleScriptLoaded ? (
            <span aria-live="polite">Google SDK 로딩 중...</span>
          ) : (
            'Google로 로그인'
          )}
        </Button>

        {/* Kakao Login */}
        <Button
          onClick={handleKakaoLogin}
          variant="contained"
          fullWidth
          disabled={loading || socialLoading.kakao || !isKakaoScriptLoaded}
          sx={{
            py: 1.5,
            borderRadius: 2,
            bgcolor: '#FEE500',
            color: '#000000',
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: '#FDD835',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(254, 229, 0, 0.3)'
            },
            '&:focus': {
              outline: '2px solid #FEE500',
              outlineOffset: '2px'
            },
            '&:active': {
              transform: 'translateY(0px)',
              boxShadow: '0 1px 4px rgba(254, 229, 0, 0.2)'
            },
            '&:disabled': {
              bgcolor: '#d1d5db',
              color: '#6b7280'
            }
          }}
          aria-label={socialLoading.kakao ? 'Kakao 로그인 진행 중' : 'Kakao 계정으로 로그인'}
          aria-describedby={socialLoading.kakao ? 'kakao-login-status' : undefined}
          startIcon={
            socialLoading.kakao ? (
              <CircularProgress size={20} sx={{ color: '#000000' }} />
            ) : (
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
            )
          }
        >
          {socialLoading.kakao ? (
            <span aria-live="polite" id="kakao-login-status">Kakao 로그인 중...</span>
          ) : !isKakaoScriptLoaded ? (
            <span aria-live="polite">Kakao SDK 로딩 중...</span>
          ) : (
            'Kakao로 로그인'
          )}
        </Button>
      </Box>
      </Box>
    </Box>
  )
}

export default LoginForm