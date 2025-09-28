import { useSelector } from 'react-redux'
import { Box, Typography, TextField, InputAdornment } from '@mui/material'
import { Search } from '@mui/icons-material'
import { selectIsAuthenticated } from '../../../store/slices/authSlice'
import UserProfileButton from './UserProfileButton'
import GuestButtons from './GuestButtons'

function Header({ onNavigateToAuth, onNavigateToProfile }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <>
      {/* Status Bar */}
      <Box sx={{
        height: 44,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2.5,
        color: 'white',
        fontSize: 14,
        fontWeight: 600
      }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>9:41</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{import.meta.env.VITE_APP_NAME || '클밍여지도'}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>100%🔋</Typography>
      </Box>

      {/* App Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: '16px 20px 20px'
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            🧗‍♂️ {import.meta.env.VITE_APP_NAME || '클밍여지도'}
          </Typography>

          {/* 인증 상태에 따른 조건부 렌더링 */}
          {isAuthenticated ? (
            <UserProfileButton onNavigateToProfile={onNavigateToProfile} />
          ) : (
            <GuestButtons onNavigateToAuth={onNavigateToAuth} />
          )}
        </Box>
        
        <TextField
          placeholder="암장, 지역으로 검색하세요"
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '& fieldset': {
                border: 'none'
              },
              '&::placeholder': {
                color: 'rgba(255,255,255,0.8)'
              }
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255,255,255,0.8)',
              opacity: 1
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'rgba(255,255,255,0.8)' }} />
              </InputAdornment>
            )
          }}
        />
      </Box>
    </>
  )
}

export default Header