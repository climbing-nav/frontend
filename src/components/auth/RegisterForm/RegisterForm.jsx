import { useState } from 'react'
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
  CircularProgress
} from '@mui/material'
import { 
  Email, 
  Lock, 
  Person,
  Visibility, 
  VisibilityOff
} from '@mui/icons-material'
import { useAuth } from '../../../hooks/useAuth'

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
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()

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
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다'
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
    }
    
    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요'
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다'
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
    
    setLoading(true)
    try {
      await register(formData)
      // 회원가입 성공 시 처리 (예: 로그인 탭으로 이동)
      console.log('회원가입 성공')
    } catch (error) {
      setErrors({ general: '회원가입에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setLoading(false)
    }
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
            <Typography component="span" sx={{ color: '#667eea', cursor: 'pointer' }}>
              이용약관
            </Typography>
            {' '}및{' '}
            <Typography component="span" sx={{ color: '#667eea', cursor: 'pointer' }}>
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
    </Box>
  )
}

export default RegisterForm