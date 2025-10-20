import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Typography,
  Divider
} from '@mui/material'
import { Google } from '@mui/icons-material'
import {
  clearError,
  selectAuthLoading
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

  // 소셜 로그인 Hooks
  const { signInWithGoogle } = useGoogleAuth()
  const { signInWithKakao } = useKakaoAuth()

  const handleGoogleLogin = useCallback(() => {
    dispatch(clearError())

    try {
      // 서버 사이드 OAuth 플로우 시작
      signInWithGoogle()

      // 성공 콜백 (리다이렉트 전에 호출됨)
      if (onSuccess) {
        onSuccess('google')
      }
    } catch (error) {
      console.error('Google 로그인 리다이렉트 실패:', error)
      const errorMessage = '구글 로그인을 시작할 수 없습니다.'

      // Error callback
      if (onError) {
        onError('google', errorMessage)
      }
    }
  }, [dispatch, signInWithGoogle, onSuccess, onError])

  const handleKakaoLogin = useCallback(() => {
    dispatch(clearError())

    try {
      // 서버 사이드 OAuth 플로우 시작
      signInWithKakao()

      // 성공 콜백 (리다이렉트 전에 호출됨)
      if (onSuccess) {
        onSuccess('kakao')
      }
    } catch (error) {
      console.error('Kakao 로그인 리다이렉트 실패:', error)
      const errorMessage = '카카오 로그인을 시작할 수 없습니다.'

      // Error callback
      if (onError) {
        onError('kakao', errorMessage)
      }
    }
  }, [dispatch, signInWithKakao, onSuccess, onError])

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
          disabled={loading}
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
          startIcon={<Google />}
          aria-label="Google 계정으로 로그인"
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
          aria-label="Kakao 계정으로 로그인"
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

export default SocialLogin