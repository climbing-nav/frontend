import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useAuth } from '../../../hooks/useAuth'
import { validateLoginForm } from '../../../utils/validators'
import SocialLogin from '../SocialLogin'

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [socialError, setSocialError] = useState(null)

  const { login, loading, error, clearError } = useAuth()

  // 컴포넌트 마운트 시 에러 클리어
  useEffect(() => {
    clearError()
  }, [clearError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Clear Redux error
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 폼 검증
    const validationErrors = validateLoginForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // 로그인 실행
    const result = await login(formData)

    if (result.success) {
      console.log('이메일 로그인 성공')
    }
    // 에러는 Redux에서 자동으로 처리됨
  }

  const handleSocialError = (provider, errorMessage) => {
    setSocialError(errorMessage)
  }

  const handleSocialSuccess = (provider) => {
    console.log(`${provider} 로그인 성공`)
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
      {/* Error Alerts */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}
      {socialError && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          role="alert"
          aria-live="assertive"
        >
          {socialError}
        </Alert>
      )}

      {/* Email Login Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
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

        {/* Login Button */}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
        </Button>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: '#6b7280', px: 2 }}>
          또는
        </Typography>
      </Divider>

      {/* Social Login */}
      <SocialLogin
        showDivider={false}
        onError={handleSocialError}
        onSuccess={handleSocialSuccess}
      />
    </Box>
  )
}

export default LoginForm
