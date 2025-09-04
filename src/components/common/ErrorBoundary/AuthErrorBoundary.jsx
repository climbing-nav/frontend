import React from 'react'
import { Box, Typography, Button, Alert, Card, CardContent } from '@mui/material'
import { Refresh as RefreshIcon, Warning as WarningIcon } from '@mui/icons-material'

/**
 * AuthErrorBoundary Component
 * 인증 관련 에러를 처리하는 에러 바운더리 컴포넌트
 * 
 * 기능:
 * - 인증 에러 캐치 및 사용자 친화적 메시지 표시
 * - 재시도 버튼 제공
 * - 다양한 에러 타입별 메시지 커스터마이징
 */
class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // 에러 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.error('AuthErrorBoundary caught an error:', error, errorInfo)
    }

    // TODO: 프로덕션에서는 에러 리포팅 서비스에 전송
    // reportError(error, errorInfo)
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  getErrorMessage(error) {
    if (!error) return '알 수 없는 오류가 발생했습니다.'

    const message = error.message || error.toString()

    // 네트워크 오류
    if (message.includes('network') || message.includes('fetch')) {
      return '네트워크 연결을 확인하고 다시 시도해주세요.'
    }

    // OAuth 관련 오류
    if (message.includes('OAuth') || message.includes('Google') || message.includes('Kakao')) {
      return '소셜 로그인 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }

    // 토큰 관련 오류
    if (message.includes('token') || message.includes('인증')) {
      return '인증에 문제가 발생했습니다. 다시 로그인해주세요.'
    }

    // SDK 관련 오류
    if (message.includes('SDK') || message.includes('script')) {
      return '서비스 초기화에 실패했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.'
    }

    return message
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.getErrorMessage(this.state.error)
      const canRetry = this.state.retryCount < 3 // 최대 3회까지만 재시도 허용

      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            p: 2
          }}
        >
          <Card 
            sx={{ 
              maxWidth: 500, 
              width: '100%',
              boxShadow: 3
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <WarningIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'error.main', 
                  mb: 2 
                }} 
              />
              
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom
                sx={{ color: 'error.main', fontWeight: 600 }}
              >
                인증 오류가 발생했습니다
              </Typography>

              <Alert 
                severity="error" 
                sx={{ mb: 3, textAlign: 'left' }}
              >
                {errorMessage}
              </Alert>

              {canRetry ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRetry}
                  sx={{
                    mr: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    }
                  }}
                >
                  다시 시도 ({3 - this.state.retryCount}회 남음)
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => window.location.reload()}
                >
                  페이지 새로고침
                </Button>
              )}

              {process.env.NODE_ENV === 'development' && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="caption" component="div" sx={{ textAlign: 'left', fontSize: '12px' }}>
                    <strong>개발 정보:</strong><br />
                    {this.state.error && this.state.error.toString()}<br />
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )
    }

    return this.props.children
  }
}

export default AuthErrorBoundary