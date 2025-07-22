import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Grid } from '@mui/material'
import { 
  LocationOn, 
  Edit, 
  TrendingUp, 
  Settings, 
  Help, 
  Description,
  ChevronRight
} from '@mui/icons-material'

const menuItems = [
  { icon: LocationOn, text: '즐겨찾는 암장' },
  { icon: Edit, text: '작성한 글' },
  { icon: TrendingUp, text: '방문 기록' }
]

const settingsItems = [
  { icon: Settings, text: '설정' },
  { icon: Help, text: '고객센터' },
  { icon: Description, text: '약관 및 정책' }
]

function ProfilePage() {
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
          <Box sx={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 24,
            fontWeight: 700
          }}>
            김
          </Box>
          <Box>
            <Typography variant="h6" sx={{
              fontWeight: 600,
              color: '#1f2937',
              mb: 0.5
            }}>
              김클라이머
            </Typography>
            <Typography variant="body2" sx={{
              color: '#6b7280'
            }}>
              클라이밍 2년차 • V4 도전중
            </Typography>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid sx={{ width: '30%' }}>
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
          <Grid sx={{ width: '30%' }}>
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
          <Grid sx={{ width: '30%' }}>
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

export default ProfilePage