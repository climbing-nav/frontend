import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Box, 
  Button, 
  Typography, 
  Divider,
  CircularProgress
} from '@mui/material'
import { Google } from '@mui/icons-material'
import { 
  clearError, 
  selectAuthLoading, 
  selectAuthError
} from '../../../store/slices/authSlice'
import { useGoogleAuth } from '../../../hooks/useGoogleAuth'
import { useKakaoAuth } from '../../../hooks/useKakaoAuth'

/**
 * SocialLogin Component
 * Reusable social login component supporting Google and Kakao OAuth
 * 
 * @param {Object} props
 * @param {boolean} props.showDivider - Whether to show divider above social buttons
 * @param {string} props.dividerText - Text to display in divider
 * @param {Function} props.onError - Callback for handling errors
 * @param {Function} props.onSuccess - Callback for handling successful login
 * @param {Object} props.sx - Additional styling
 */
function SocialLogin({ 
  showDivider = true,
  dividerText = '또는',
  onError,
  onSuccess,
  sx = {}
}) {
  const dispatch = useDispatch()
  const loading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  
  // 소셜 로그인 Hooks
  const { signInWithGoogle, isGoogleScriptLoaded } = useGoogleAuth()
  const { signInWithKakao, isKakaoScriptLoaded } = useKakaoAuth()
  
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    kakao: false
  })

  const handleGoogleLogin = async () => {
    dispatch(clearError())
    setSocialLoading(prev => ({ ...prev, google: true }))
    
    try {
      if (!isGoogleScriptLoaded) {
        throw new Error('Google SDK가 아직 로드되지 않았습니다.')
      }
      
      await signInWithGoogle()
      
      // Success callback
      if (onSuccess) {
        onSuccess('google')
      }
    } catch (error) {
      console.error('Google 로그인 실패:', error)
      const errorMessage = error.message || 'Google 로그인에 실패했습니다.'
      
      // Error callback
      if (onError) {
        onError('google', errorMessage)
      }
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
      
      // Success callback
      if (onSuccess) {
        onSuccess('kakao')
      }
    } catch (error) {
      console.error('Kakao 로그인 실패:', error)
      const errorMessage = error.message || 'Kakao 로그인에 실패했습니다.'
      
      // Error callback
      if (onError) {
        onError('kakao', errorMessage)
      }
    } finally {
      setSocialLoading(prev => ({ ...prev, kakao: false }))
    }
  }

  return (
    <Box sx={sx}>
      {/* Divider */}
      {showDivider && (
        <Divider sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#6b7280', px: 2 }}>
            {dividerText}
          </Typography>
        </Divider>
      )}

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
  )
}

export default SocialLogin