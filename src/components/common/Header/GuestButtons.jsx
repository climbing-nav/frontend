import { useState, useCallback } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography
} from '@mui/material'
import {
  Person,
  Login
} from '@mui/icons-material'

/**
 * GuestButtons Component
 * 비로그인 사용자를 위한 로그인 버튼
 */
function GuestButtons({ onNavigateToAuth }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleLogin = useCallback(() => {
    if (onNavigateToAuth) {
      onNavigateToAuth('login')
    }
    handleClose()
  }, [onNavigateToAuth, handleClose])

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          width: 32,
          height: 32,
          bgcolor: 'rgba(255,255,255,0.2)',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.3)',
          }
        }}
        aria-label="로그인 메뉴"
        aria-controls={open ? 'guest-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Person />
      </IconButton>

      <Menu
        id="guest-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'guest-menu-button',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              fontWeight: 500,
              py: 1.5,
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.1)',
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogin}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Login sx={{ fontSize: 20, color: '#667eea' }} />
          </ListItemIcon>
          <Typography variant="inherit" sx={{ color: '#1f2937' }}>
            로그인
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export default GuestButtons
