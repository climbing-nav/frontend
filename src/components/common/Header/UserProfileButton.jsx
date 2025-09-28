import { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  Box
} from '@mui/material'
import {
  Person,
  Logout,
  Settings,
  AccountCircle
} from '@mui/icons-material'
import {
  selectUser,
  selectAuthProvider,
  logoutAsync
} from '../../../store/slices/authSlice'

/**
 * UserProfileButton Component
 * 로그인된 사용자를 위한 프로필 버튼 및 메뉴
 */
function UserProfileButton({ onNavigateToProfile }) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const authProvider = useSelector(selectAuthProvider)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleProfile = useCallback(() => {
    if (onNavigateToProfile) {
      onNavigateToProfile()
    }
    handleClose()
  }, [onNavigateToProfile, handleClose])

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutAsync()).unwrap()
      handleClose()
    } catch (error) {
      console.error('로그아웃 실패:', error)
      // 에러가 발생해도 로컬 상태는 정리
      handleClose()
    }
  }, [dispatch, handleClose])

  // 사용자 이름의 첫 글자를 아바타로 사용
  const getAvatarText = () => {
    if (user?.nickname) {
      return user.nickname.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // 프로바이더별 배지 색상
  const getProviderColor = () => {
    switch (authProvider) {
      case 'kakao':
        return '#FEE500'
      case 'google':
        return '#4285F4'
      default:
        return '#667eea'
    }
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          width: 32,
          height: 32,
          border: `2px solid ${getProviderColor()}`,
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)'
          }
        }}
        aria-label="사용자 메뉴"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {user?.avatar ? (
          <Avatar
            src={user.avatar}
            sx={{
              width: 28,
              height: 28,
              fontSize: '14px',
              fontWeight: 600
            }}
            alt={user?.nickname || '사용자'}
          />
        ) : (
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: getProviderColor(),
              color: authProvider === 'kakao' ? '#000' : '#fff',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {getAvatarText()}
          </Avatar>
        )}
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-profile-button',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
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
        {/* 사용자 정보 헤더 */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#1f2937',
              mb: 0.5
            }}
          >
            {user?.nickname || user?.email || '사용자'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {authProvider === 'kakao' && '카카오'}
            {authProvider === 'google' && '구글'}
            {authProvider === 'email' && '이메일'}
            로그인
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: getProviderColor()
              }}
            />
          </Typography>
        </Box>

        {/* 메뉴 아이템들 */}
        <MenuItem onClick={handleProfile}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <AccountCircle sx={{ fontSize: 20 }} />
          </ListItemIcon>
          내 프로필
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Settings sx={{ fontSize: 20 }} />
          </ListItemIcon>
          설정
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            color: '#dc2626',
            '&:hover': {
              bgcolor: 'rgba(220, 38, 38, 0.1)',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Logout sx={{ fontSize: 20, color: '#dc2626' }} />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserProfileButton