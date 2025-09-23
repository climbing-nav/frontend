import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Box, 
  Button, 
  Typography, 
  Divider,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material'
import { Google, Refresh } from '@mui/icons-material'
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
  const { signInWithGoogle, isGoogleScriptLoaded, scriptLoadError: googleError } = useGoogleAuth()
  const { signInWithKakao } = useKakaoAuth()

  const [socialLoading, setSocialLoading] = useState({
    google: false
  })

  const [retryCount, setRetryCount] = useState({
    google: 0
  })

  const [lastError, setLastError] = useState(null)

  const handleGoogleLogin = useCallback(async (isRetry = false) => {
    dispatch(clearError())
    setLastError(null)
    setSocialLoading(prev => ({ ...prev, google: true }))

    try {
      // 스크립트 로드 에러 체크
      if (googleError) {
        throw new Error(googleError)
      }

      if (!isGoogleScriptLoaded) {
        throw new Error('Google SDK가 아직 로드되지 않았습니다.')
      }
      
      // Google 로그인 실행 (Promise 기반)
      await signInWithGoogle()
      
      // 성공 시 재시도 카운트 리셋
      setRetryCount(prev => ({ ...prev, google: 0 }))
      
      // Success callback
      if (onSuccess) {
        onSuccess('google')
      }
    } catch (error) {
      console.error('Google 로그인 실패:', error)
      let errorMessage = 'Google 로그인에 실패했습니다.'
      
      // 에러 타입에 따른 메시지 커스터마이징
      if (error.message.includes('SDK')) {
        errorMessage = 'Google 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.'
      } else if (error.message.includes('취소') || error.message.includes('cancel')) {
        errorMessage = 'Google 로그인이 취소되었습니다.'
        // 사용자가 취소한 경우는 재시도 카운트에 포함하지 않음
        setSocialLoading(prev => ({ ...prev, google: false }))
        if (onError) {
          onError('google', errorMessage)
        }
        return
      } else if (error.message.includes('네트워크') || error.message.includes('network')) {
        errorMessage = '네트워크 연결을 확인하고 다시 시도해주세요.'
      }
      
      // 재시도가 아닌 경우에만 카운트 증가
      if (!isRetry) {
        setRetryCount(prev => ({ ...prev, google: prev.google + 1 }))
      }
      
      setLastError({ provider: 'google', message: errorMessage, originalError: error })
      
      // Error callback
      if (onError) {
        onError('google', errorMessage)
      }
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }))
    }
  }, [dispatch, googleError, isGoogleScriptLoaded, signInWithGoogle, onSuccess, onError])

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

      {/* Error Display with Retry */}
      {lastError && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            retryCount[lastError.provider] < 3 && (
              <Button
                color="inherit"
                size="small"
                startIcon={<Refresh />}
                onClick={() => {
                  if (lastError.provider === 'google') {
                    handleGoogleLogin(true)
                  }
                }}
              >
                재시도
              </Button>
            )
          }
        >
          {lastError.message}
          {retryCount[lastError.provider] > 0 && (
            <Chip 
              label={`${retryCount[lastError.provider]}회 시도`} 
              size="small" 
              sx={{ ml: 1 }} 
            />
          )}
        </Alert>
      )}

      {/* Social Login Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Google Login */}
        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          fullWidth
          disabled={loading || socialLoading.google || !isGoogleScriptLoaded || !!googleError}
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
          ) : googleError ? (
            <span aria-live="polite">Google 서비스 연결 실패</span>
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