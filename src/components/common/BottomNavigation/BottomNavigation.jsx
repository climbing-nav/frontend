import { Box, ButtonBase, Typography } from '@mui/material'
import { Home, Map, Chat, Person } from '@mui/icons-material'

const navItems = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'map', label: '지도', icon: Map },
  { id: 'community', label: '커뮤니티', icon: Chat },
  { id: 'mypage', label: '마이페이지', icon: Person }
]

function BottomNavigation({ currentTab, onTabChange }) {
  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 393,
      bgcolor: 'white',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      py: 1,
      pb: 2,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = currentTab === item.id
        
        return (
          <ButtonBase
            key={item.id}
            onClick={() => onTabChange(item.id)}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              py: 1,
              color: isActive ? '#667eea' : '#9ca3af',
              transition: 'color 0.3s',
              '&:focus': {
                outline: 'none'
              },
              '&:focus-visible': {
                outline: '2px solid #667eea',
                outlineOffset: '2px'
              }
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
            <Typography variant="caption" sx={{ 
              fontSize: 12,
              color: 'inherit'
            }}>
              {item.label}
            </Typography>
          </ButtonBase>
        )
      })}
    </Box>
  )
}

export default BottomNavigation