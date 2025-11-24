import { useState } from 'react'
import { Box, Alert } from '@mui/material'
import SocialLogin from '../SocialLogin'

function LoginForm() {
  const [error, setError] = useState(null)

  const handleSocialError = (provider, errorMessage) => {
    setError(errorMessage)
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
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {error}
        </Alert>
      )}

      <SocialLogin
        showDivider={false}
        onError={handleSocialError}
        onSuccess={handleSocialSuccess}
      />
    </Box>
  )
}

export default LoginForm
