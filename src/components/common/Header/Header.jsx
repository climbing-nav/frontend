import { useState } from 'react'
import { Box, Typography, IconButton, TextField, InputAdornment, Menu, MenuItem } from '@mui/material'
import { Person, Search } from '@mui/icons-material'

function Header({ onNavigateToAuth }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogin = () => {
    onNavigateToAuth()
    handleClose()
  }

  const handleSignup = () => {
    onNavigateToAuth()
    handleClose()
  }

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
        <Typography variant="body2" sx={{ fontWeight: 600 }}>클라이밍 서울</Typography>
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
            🧗‍♂️ 클라이밍 서울
          </Typography>
          <IconButton 
            onClick={handleClick}
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white'
            }}
          >
            <Person />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 120,
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
          >
            <MenuItem onClick={handleLogin}>로그인</MenuItem>
            <MenuItem onClick={handleSignup}>회원가입</MenuItem>
          </Menu>
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