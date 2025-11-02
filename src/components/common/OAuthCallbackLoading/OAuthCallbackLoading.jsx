import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * OAuthCallbackLoading Component
 * OAuth 콜백 처리 중 표시되는 로딩 페이지
 *
 * @param {Object} props
 * @param {string} props.provider - OAuth 제공자 ('kakao' | 'google')
 */
function OAuthCallbackLoading({ provider = 'social' }) {
  const getProviderName = () => {
    switch (provider) {
      case 'kakao':
        return '카카오'
      case 'google':
        return '구글'
      default:
        return '소셜'
    }
  }

  const getProviderColor = () => {
    switch (provider) {
      case 'kakao':
        return '#FEE500'
      case 'google':
        return '#4285F4'
      default:
        return '#667eea'
    }
  }

  return (
    <Box
      sx={{
        width: '393px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#ffffff',
        position: 'relative'
      }}
    >
      {/* 로딩 스피너 */}
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: getProviderColor(),
          mb: 3
        }}
      />

      {/* 메시지 */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#1f2937',
          mb: 1
        }}
      >
        {getProviderName()} 로그인 중입니다
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#6b7280',
          textAlign: 'center'
        }}
      >
        잠시만 기다려주세요...
      </Typography>

      {/* 하단 장식 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            gap: 1,
            alignItems: 'center'
          }}
        >
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: getProviderColor(),
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${index * 0.2}s`,
                '@keyframes pulse': {
                  '0%, 100%': {
                    opacity: 0.3,
                    transform: 'scale(0.8)'
                  },
                  '50%': {
                    opacity: 1,
                    transform: 'scale(1.2)'
                  }
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default OAuthCallbackLoading
