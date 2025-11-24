import { Box, Typography, Paper, IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import PropTypes from 'prop-types'
import LoginForm from '../../components/auth/LoginForm/LoginForm'

function AuthPage({ onNavigateToHome }) {
  const handleBackToHome = () => {
    if (onNavigateToHome) {
      onNavigateToHome()
    }
  }

  return (
    <Box sx={{ width: '393px', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Auth Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: '20px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Back Button */}
        <IconButton
          onClick={handleBackToHome}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
          aria-label="홈으로 돌아가기"
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="h5" sx={{
          fontWeight: 700,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          🧗‍♂️ {import.meta.env.VITE_APP_NAME || '클밍여지도'}
        </Typography>
        <Typography variant="body2" sx={{
          opacity: 0.9,
          fontWeight: 500
        }}>
          클라이밍의 새로운 시작
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 2.5, py: 3 }}>
        <Paper sx={{
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{
            borderBottom: '1px solid #e5e7eb',
            bgcolor: 'white',
            py: 2.5,
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: '#667eea'
            }}>
              로그인
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ bgcolor: 'white', p: 3 }}>
            <LoginForm />
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{
          textAlign: 'center',
          mt: 4,
          py: 2
        }}>
          <Typography variant="body2" sx={{
            color: '#6b7280',
            fontSize: 13,
            lineHeight: 1.5
          }}>
            {import.meta.env.VITE_APP_NAME || '클밍여지도'}을 이용하시면{' '}
            <Typography component="span" sx={{
              color: '#667eea',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              이용약관
            </Typography>
            {' '}및{' '}
            <Typography component="span" sx={{
              color: '#667eea',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              개인정보처리방침
            </Typography>
            에 동의한 것으로 간주됩니다.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

AuthPage.propTypes = {
  onNavigateToHome: PropTypes.func
}

export default AuthPage
