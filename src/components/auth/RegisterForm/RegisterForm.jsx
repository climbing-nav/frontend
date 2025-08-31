import { useState, useEffect } from 'react'
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton,
  Alert,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  LinearProgress
} from '@mui/material'
import { 
  Email, 
  Lock, 
  Person,
  Visibility, 
  VisibilityOff,
  Check,
  Close
} from '@mui/icons-material'
import { useAuth } from '../../../hooks/useAuth'
import TermsModal from '../../common/Modal/TermsModal'
import EmailVerification from '../EmailVerification/EmailVerification'

const CLIMBING_LEVELS = [
  { value: 'beginner', label: '초보자 (V0-V2)' },
  { value: 'intermediate', label: '중급자 (V3-V5)' },
  { value: 'advanced', label: '고급자 (V6-V8)' },
  { value: 'expert', label: '전문가 (V9+)' }
]

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    climbingLevel: '',
    agreeTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] })
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  
  const { register, loading, error, clearError, isAuthenticated } = useAuth()

  // 컴포넌트 마운트 시 Redux 에러 클리어
  useEffect(() => {
    clearError()
  }, [clearError])

  // Redux 에러를 로컬 에러 상태로 동기화
  useEffect(() => {
    if (error) {
      setErrors({ general: error })
    }
  }, [error])

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeTerms' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Clear Redux error when user starts typing
    if (error) {
      clearError()
    }

    // Update password strength in real-time
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const checkPasswordStrength = (password) => {
    const checks = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    const passedChecks = Object.values(checks).filter(Boolean).length
    const score = (passedChecks / 5) * 100

    const feedback = []
    if (!checks.minLength) feedback.push('최소 8자 이상')
    if (!checks.hasUpperCase) feedback.push('대문자 포함')
    if (!checks.hasLowerCase) feedback.push('소문자 포함')
    if (!checks.hasNumber) feedback.push('숫자 포함')
    if (!checks.hasSpecialChar) feedback.push('특수문자 포함')

    return { score, feedback, checks }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateNickname = (nickname) => {
    // 2-20자, 한글, 영문, 숫자만 허용
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,20}$/
    return nicknameRegex.test(nickname)
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다 (예: user@example.com)'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else {
      const strength = checkPasswordStrength(formData.password)
      if (strength.score < 80) {
        newErrors.password = '비밀번호가 너무 약합니다. 모든 조건을 만족해주세요'
      }
    }
    
    // Password confirmation validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
    }
    
    // Nickname validation
    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요'
    } else if (!validateNickname(formData.nickname)) {
      newErrors.nickname = '닉네임은 2-20자의 한글, 영문, 숫자만 사용 가능합니다'
    }
    
    if (!formData.climbingLevel) {
      newErrors.climbingLevel = '클라이밍 레벨을 선택해주세요'
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Redux loading이 활성화되므로 로컬 loading 상태는 불필요
    const result = await register(formData)
    
    if (result.success) {
      // 회원가입 성공 시 이메일 인증 단계로 이동
      setRegisteredEmail(formData.email)
      setShowEmailVerification(true)
      console.log('회원가입 성공, 이메일 인증 단계로 이동')
    }
    // 에러 처리는 useEffect에서 자동으로 처리됨
  }

  const handleVerificationSuccess = () => {
    // 이메일 인증 완료 후 처리
    console.log('이메일 인증 완료')
    // 이미 Redux에서 인증된 상태이므로 추가 처리 가능
    // 예: 홈 페이지로 리다이렉트 또는 성공 메시지 표시
    setShowEmailVerification(false)
    
    // 폼 초기화
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      climbingLevel: '',
      agreeTerms: false
    })
    setErrors({})
  }

  const handleResendCode = async (email) => {
    // 인증코드 재전송 API 호출
    console.log(`Resending verification code to: ${email}`)
    
    // TODO: 실제 API 연동
    // await resendVerificationCode(email)
    
    // 임시: 시뮬레이션
    return new Promise(resolve => setTimeout(resolve, 1000))
  }

  // 이메일 인증 단계 표시
  if (showEmailVerification) {
    return (
      <EmailVerification
        email={registeredEmail}
        onVerificationSuccess={handleVerificationSuccess}
        onResendCode={handleResendCode}
      />
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Error Alert */}
      {errors.general && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {errors.general}
        </Alert>
      )}

      {/* Email Field */}
      <TextField
        name="email"
        type="email"
        placeholder="이메일"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: '#f9fafb',
            '& fieldset': {
              borderColor: '#e5e7eb'
            },
            '&:hover fieldset': {
              borderColor: '#667eea'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea'
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: '#6b7280' }} />
            </InputAdornment>
          )
        }}
      />

      {/* Nickname Field */}
      <TextField
        name="nickname"
        placeholder="닉네임"
        value={formData.nickname}
        onChange={handleChange}
        error={!!errors.nickname}
        helperText={errors.nickname}
        fullWidth
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: '#f9fafb',
            '& fieldset': {
              borderColor: '#e5e7eb'
            },
            '&:hover fieldset': {
              borderColor: '#667eea'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea'
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person sx={{ color: '#6b7280' }} />
            </InputAdornment>
          )
        }}
      />

      {/* Climbing Level */}
      <FormControl 
        fullWidth 
        error={!!errors.climbingLevel}
        sx={{ mb: 2 }}
      >
        <Select
          name="climbingLevel"
          value={formData.climbingLevel}
          onChange={handleChange}
          displayEmpty
          sx={{
            borderRadius: 2,
            bgcolor: '#f9fafb',
            '& fieldset': {
              borderColor: '#e5e7eb'
            },
            '&:hover fieldset': {
              borderColor: '#667eea'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea'
            }
          }}
        >
          <MenuItem value="" disabled>
            클라이밍 레벨을 선택하세요
          </MenuItem>
          {CLIMBING_LEVELS.map((level) => (
            <MenuItem key={level.value} value={level.value}>
              {level.label}
            </MenuItem>
          ))}
        </Select>
        {errors.climbingLevel && (
          <FormHelperText>{errors.climbingLevel}</FormHelperText>
        )}
      </FormControl>

      {/* Password Field */}
      <TextField
        name="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        sx={{
          mb: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: '#f9fafb',
            '& fieldset': {
              borderColor: '#e5e7eb'
            },
            '&:hover fieldset': {
              borderColor: '#667eea'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea'
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: '#6b7280' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: '#6b7280' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      
      {/* Password Strength Indicator */}
      {formData.password && (
        <Box sx={{ mb: 2, px: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#6b7280', mr: 1 }}>
              비밀번호 강도:
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: passwordStrength.score < 40 ? '#ef4444' : 
                       passwordStrength.score < 80 ? '#f59e0b' : '#10b981',
                fontWeight: 500
              }}
            >
              {passwordStrength.score < 40 ? '약함' : 
               passwordStrength.score < 80 ? '보통' : '강함'}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={passwordStrength.score}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: '#e5e7eb',
              '& .MuiLinearProgress-bar': {
                bgcolor: passwordStrength.score < 40 ? '#ef4444' : 
                         passwordStrength.score < 80 ? '#f59e0b' : '#10b981',
                borderRadius: 2
              }
            }}
          />
          {passwordStrength.feedback.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {passwordStrength.feedback.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Close sx={{ fontSize: 12, color: '#ef4444', mr: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                    {item}
                  </Typography>
                </Box>
              ))}
              {passwordStrength.checks && Object.entries(passwordStrength.checks).map(([key, passed]) => {
                if (passed) {
                  const labels = {
                    minLength: '최소 8자 이상',
                    hasUpperCase: '대문자 포함',
                    hasLowerCase: '소문자 포함',
                    hasNumber: '숫자 포함',
                    hasSpecialChar: '특수문자 포함'
                  }
                  return (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Check sx={{ fontSize: 12, color: '#10b981', mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {labels[key]}
                      </Typography>
                    </Box>
                  )
                }
                return null
              })}
            </Box>
          )}
        </Box>
      )}

      {/* Confirm Password Field */}
      <TextField
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="비밀번호 확인"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        fullWidth
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: '#f9fafb',
            '& fieldset': {
              borderColor: '#e5e7eb'
            },
            '&:hover fieldset': {
              borderColor: '#667eea'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea'
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: '#6b7280' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                sx={{ color: '#6b7280' }}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {/* Terms Agreement */}
      <FormControlLabel
        control={
          <Checkbox
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            sx={{
              color: '#667eea',
              '&.Mui-checked': {
                color: '#667eea'
              }
            }}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: '#374151' }}>
            <Typography 
              component="span" 
              sx={{ color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={(e) => {
                e.preventDefault()
                setTermsModalOpen(true)
              }}
            >
              이용약관
            </Typography>
            {' '}및{' '}
            <Typography 
              component="span" 
              sx={{ color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={(e) => {
                e.preventDefault()
                setTermsModalOpen(true)
              }}
            >
              개인정보처리방침
            </Typography>
            에 동의합니다
          </Typography>
        }
        sx={{ mb: 2 }}
      />
      {errors.agreeTerms && (
        <Typography variant="body2" color="error" sx={{ mb: 2, fontSize: 12 }}>
          {errors.agreeTerms}
        </Typography>
      )}

      {/* Register Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          py: 1.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 600,
          fontSize: 16,
          textTransform: 'none',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)'
          },
          '&:disabled': {
            background: '#d1d5db',
            boxShadow: 'none'
          }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : '회원가입'}
      </Button>

      {/* Terms and Conditions Modal */}
      <TermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        onAccept={() => {
          setFormData(prev => ({ ...prev, agreeTerms: true }))
          if (errors.agreeTerms) {
            setErrors(prev => ({ ...prev, agreeTerms: '' }))
          }
        }}
      />
    </Box>
  )
}

export default RegisterForm