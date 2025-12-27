import { useSelector } from 'react-redux'
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Grid, Avatar, Button } from '@mui/material'
import {
  LocationOn,
  Edit,
  TrendingUp,
  Settings,
  Help,
  Description,
  ChevronRight,
  Login
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import { selectUser, selectIsAuthenticated, selectAuthProvider } from '../../store/slices/authSlice'

const menuItems = [
  { icon: LocationOn, text: '즐겨찾는 암장', page: 'favoriteGyms' },
  { icon: Edit, text: '작성한 글', page: 'myPosts' },
  { icon: TrendingUp, text: '방문 기록', page: 'visitHistory' }
]

const settingsItems = [
  { icon: Settings, text: '설정', page: 'settings' },
  { icon: Help, text: '고객센터', page: 'customerSupport' },
  { icon: Description, text: '약관 및 정책', page: 'termsAndPolicies' }
]

function ProfilePage({ onNavigateToAuth, onNavigateToSubPage }) {
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const authProvider = useSelector(selectAuthProvider)

  // 비로그인 상태 UI
  if (!isAuthenticated) {
    return (
      <Box sx={{ width: '393px', p: 3, textAlign: 'center' }}>
        <Box sx={{ mt: 8, mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#f0f0f0' }}>
            <Login sx={{ fontSize: 40, color: '#9ca3af' }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 1, color: '#1f2937' }}>
            로그인이 필요합니다
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
            프로필을 확인하려면 로그인해주세요
          </Typography>
          <Button
            variant="contained"
            onClick={() => onNavigateToAuth && onNavigateToAuth()}
            sx={{
              bgcolor: '#667eea',
              '&:hover': { bgcolor: '#5a6fd8' },
              borderRadius: 2,
              px: 4
            }}
          >
            로그인하기
          </Button>
        </Box>
      </Box>
    )
  }

  // 사용자 이름의 첫 글자
  const getAvatarText = () => {
    if (user?.nickname) return user.nickname.charAt(0).toUpperCase()
    if (user?.email) return user.email.charAt(0).toUpperCase()
    return 'U'
  }

  // 프로바이더별 색상
  const getProviderColor = () => {
    switch (authProvider) {
      case 'kakao': return '#FEE500'
      case 'google': return '#4285F4'
      default: return '#667eea'
    }
  }

  return (
    <Box sx={{ width: '393px' }}>
      {/* Profile Section */}
      <Paper sx={{
        p: 3,
        borderBottom: '8px solid #f8f9fa',
        borderRadius: 0
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2.5
        }}>
          {user?.avatar ? (
            <Avatar
              src={user.avatar}
              sx={{
                width: 64,
                height: 64,
                border: `3px solid ${getProviderColor()}`
              }}
              alt={user?.nickname || '사용자'}
            />
          ) : (
            <Avatar sx={{
              width: 64,
              height: 64,
              bgcolor: getProviderColor(),
              color: authProvider === 'kakao' ? '#000' : '#fff',
              fontSize: 24,
              fontWeight: 700,
              border: `3px solid ${getProviderColor()}`
            }}>
              {getAvatarText()}
            </Avatar>
          )}
          <Box>
            <Typography variant="h6" sx={{
              fontWeight: 600,
              color: '#1f2937',
              mb: 0.5
            }}>
              {user?.nickname || user?.email || '사용자'}
            </Typography>
            <Typography variant="body2" component="div" sx={{
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              {authProvider === 'kakao' && '카카오'}
              {authProvider === 'google' && '구글'}
              {authProvider === 'email' && '이메일'}
              로그인
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: getProviderColor()
              }} />
            </Typography>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box sx={{
              bgcolor: '#f8f9fa',
              p: 1.5,
              borderRadius: 1,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                color: '#667eea',
                mb: 0.5
              }}>
                147
              </Typography>
              <Typography variant="caption" sx={{
                color: '#6b7280'
              }}>
                방문 암장
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{
              bgcolor: '#f8f9fa',
              p: 1.5,
              borderRadius: 1,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                color: '#667eea',
                mb: 0.5
              }}>
                23
              </Typography>
              <Typography variant="caption" sx={{
                color: '#6b7280'
              }}>
                작성 글
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{
              bgcolor: '#f8f9fa',
              p: 1.5,
              borderRadius: 1,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                color: '#667eea',
                mb: 0.5
              }}>
                12
              </Typography>
              <Typography variant="caption" sx={{
                color: '#6b7280'
              }}>
                즐겨찾기
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Menu Section 1 */}
      <Paper sx={{ mb: 1, borderRadius: 0 }}>
        <List sx={{ py: 0 }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              button
              onClick={() => onNavigateToSubPage && onNavigateToSubPage(item.page)}
              sx={{
                borderBottom: index < menuItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#f8f9fa'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <item.icon sx={{ fontSize: 24 }} />
              </ListItemIcon>
              <ListItemText primary={item.text} />
              <ChevronRight sx={{ color: '#9ca3af' }} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Menu Section 2 */}
      <Paper sx={{ borderRadius: 0 }}>
        <List sx={{ py: 0 }}>
          {settingsItems.map((item, index) => (
            <ListItem
              key={index}
              button
              onClick={() => onNavigateToSubPage && onNavigateToSubPage(item.page)}
              sx={{
                borderBottom: index < settingsItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#f8f9fa'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <item.icon sx={{ fontSize: 24 }} />
              </ListItemIcon>
              <ListItemText primary={item.text} />
              <ChevronRight sx={{ color: '#9ca3af' }} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

ProfilePage.propTypes = {
  onNavigateToAuth: PropTypes.func,
  onNavigateToSubPage: PropTypes.func
}

export default ProfilePage