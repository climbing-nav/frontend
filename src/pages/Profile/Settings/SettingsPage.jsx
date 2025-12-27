import { useState } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
  IconButton
} from '@mui/material'
import {
  Person,
  Email,
  Lock,
  Notifications,
  NotificationsActive,
  Forum,
  Language,
  Palette,
  Storage,
  Info,
  DeleteSweep,
  Logout,
  PersonRemove,
  ChevronRight,
  ArrowBack
} from '@mui/icons-material'
import PropTypes from 'prop-types'

function SettingsPage({ onNavigateToProfile, onLogout, onDeleteAccount, onBack }) {
  // Notification settings state
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [communityUpdates, setCommunityUpdates] = useState(true)

  // Dialog states
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [clearCacheDialogOpen, setClearCacheDialogOpen] = useState(false)

  const appVersion = 'v1.2.3'

  const handleLogout = () => {
    setLogoutDialogOpen(false)
    if (onLogout) {
      onLogout()
    }
  }

  const handleDeleteAccount = () => {
    setDeleteAccountDialogOpen(false)
    if (onDeleteAccount) {
      onDeleteAccount()
    }
  }

  const handleClearCache = () => {
    setClearCacheDialogOpen(false)
    // Clear cache logic here
    console.log('Cache cleared')
  }

  return (
    <Box sx={{ width: '393px', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header - Industrial style with grid */}
      <Box
        sx={{
          bgcolor: '#1f2937',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(0deg, rgba(255,255,255,.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <IconButton
              onClick={onBack}
              sx={{
                width: 36,
                height: 36,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
            <Box
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                bgcolor: '#667eea'
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}
              >
                CONFIGURATION
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1
            }}
          >
            설정
          </Typography>
        </Box>
      </Box>

      {/* Settings Sections */}
      <Box sx={{ p: 2 }}>
        {/* Account Settings Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            bgcolor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: '#f8f9fa',
              borderBottom: '2px solid #e5e7eb'
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: '0.1em',
                color: '#6b7280'
              }}
            >
              계정 설정
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {[
              { icon: Person, label: '프로필 수정', action: onNavigateToProfile },
              { icon: Email, label: '이메일 변경' },
              { icon: Lock, label: '비밀번호 변경' }
            ].map((item, index, array) => (
              <ListItem
                key={index}
                button
                onClick={item.action}
                sx={{
                  borderBottom: index < array.length - 1 ? '1px solid #f3f4f6' : 'none',
                  py: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#f8f9fa',
                    pl: 3
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon sx={{ fontSize: 22, color: '#667eea' }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#1f2937'
                  }}
                />
                <ChevronRight sx={{ color: '#9ca3af', fontSize: 20 }} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Notification Settings Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            bgcolor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: '#f8f9fa',
              borderBottom: '2px solid #e5e7eb'
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: '0.1em',
                color: '#6b7280'
              }}
            >
              알림 설정
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {[
              {
                icon: Notifications,
                label: '푸시 알림',
                description: '앱 알림 받기',
                checked: pushNotifications,
                onChange: setPushNotifications
              },
              {
                icon: NotificationsActive,
                label: '이메일 알림',
                description: '이메일로 알림 받기',
                checked: emailNotifications,
                onChange: setEmailNotifications
              },
              {
                icon: Forum,
                label: '커뮤니티 소식',
                description: '새 글 및 댓글 알림',
                checked: communityUpdates,
                onChange: setCommunityUpdates
              }
            ].map((item, index, array) => (
              <ListItem
                key={index}
                sx={{
                  borderBottom: index < array.length - 1 ? '1px solid #f3f4f6' : 'none',
                  py: 2
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon
                    sx={{
                      fontSize: 22,
                      color: item.checked ? '#667eea' : '#9ca3af'
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#1f2937'
                  }}
                  secondaryTypographyProps={{
                    fontSize: 12,
                    color: '#6b7280'
                  }}
                />
                <Switch
                  checked={item.checked}
                  onChange={(e) => item.onChange(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#667eea'
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      bgcolor: '#667eea'
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* App Settings Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            bgcolor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: '#f8f9fa',
              borderBottom: '2px solid #e5e7eb'
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: '0.1em',
                color: '#6b7280'
              }}
            >
              앱 설정
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {[
              { icon: Language, label: '언어 설정', value: '한국어' },
              { icon: Palette, label: '테마 모드', value: 'Light' },
              { icon: Storage, label: '데이터 사용량', value: '23.4 MB' }
            ].map((item, index, array) => (
              <ListItem
                key={index}
                button
                sx={{
                  borderBottom: index < array.length - 1 ? '1px solid #f3f4f6' : 'none',
                  py: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#f8f9fa',
                    pl: 3
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon sx={{ fontSize: 22, color: '#667eea' }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#1f2937'
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#9ca3af',
                    fontWeight: 600,
                    fontSize: 13,
                    mr: 1
                  }}
                >
                  {item.value}
                </Typography>
                <ChevronRight sx={{ color: '#9ca3af', fontSize: 20 }} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Others Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            bgcolor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: '#f8f9fa',
              borderBottom: '2px solid #e5e7eb'
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: '0.1em',
                color: '#6b7280'
              }}
            >
              기타
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {/* App Version */}
            <ListItem
              sx={{
                borderBottom: '1px solid #f3f4f6',
                py: 2
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Info sx={{ fontSize: 22, color: '#667eea' }} />
              </ListItemIcon>
              <ListItemText
                primary="앱 버전"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#1f2937'
                }}
              />
              <Chip
                label={appVersion}
                size="small"
                sx={{
                  bgcolor: '#f3f4f6',
                  color: '#6b7280',
                  fontWeight: 700,
                  fontSize: 12,
                  fontFamily: 'monospace',
                  height: 24
                }}
              />
            </ListItem>

            {/* Clear Cache */}
            <ListItem
              button
              onClick={() => setClearCacheDialogOpen(true)}
              sx={{
                borderBottom: '1px solid #f3f4f6',
                py: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f8f9fa',
                  pl: 3
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <DeleteSweep sx={{ fontSize: 22, color: '#06b6d4' }} />
              </ListItemIcon>
              <ListItemText
                primary="캐시 삭제"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#1f2937'
                }}
              />
              <ChevronRight sx={{ color: '#9ca3af', fontSize: 20 }} />
            </ListItem>

            {/* Logout */}
            <ListItem
              button
              onClick={() => setLogoutDialogOpen(true)}
              sx={{
                borderBottom: '1px solid #f3f4f6',
                py: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#fef3c7',
                  pl: 3
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Logout sx={{ fontSize: 22, color: '#f59e0b' }} />
              </ListItemIcon>
              <ListItemText
                primary="로그아웃"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#f59e0b'
                }}
              />
              <ChevronRight sx={{ color: '#f59e0b', fontSize: 20 }} />
            </ListItem>

            {/* Delete Account */}
            <ListItem
              button
              onClick={() => setDeleteAccountDialogOpen(true)}
              sx={{
                py: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#fee2e2',
                  pl: 3
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonRemove sx={{ fontSize: 22, color: '#ef4444' }} />
              </ListItemIcon>
              <ListItemText
                primary="회원 탈퇴"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#ef4444'
                }}
              />
              <ChevronRight sx={{ color: '#ef4444', fontSize: 20 }} />
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* Logout Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 1,
            width: 320,
            p: 1,
            border: '2px solid #f59e0b'
          }
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: '#1f2937',
            fontSize: 18,
            letterSpacing: '-0.01em'
          }}
        >
          로그아웃
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              lineHeight: 1.6
            }}
          >
            로그아웃 하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setLogoutDialogOpen(false)}
            sx={{
              color: '#6b7280',
              fontWeight: 700,
              textTransform: 'none',
              px: 3
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              bgcolor: '#f59e0b',
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
              '&:hover': {
                bgcolor: '#d97706'
              }
            }}
          >
            로그아웃
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountDialogOpen}
        onClose={() => setDeleteAccountDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 1,
            width: 320,
            p: 1,
            border: '2px solid #ef4444'
          }
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: '#1f2937',
            fontSize: 18,
            letterSpacing: '-0.01em'
          }}
        >
          회원 탈퇴
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              lineHeight: 1.6,
              mb: 2
            }}
          >
            정말로 탈퇴하시겠습니까?
            <br />
            모든 데이터가 삭제되며 복구할 수 없습니다.
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: 1
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#991b1b',
                fontWeight: 700,
                fontSize: 11
              }}
            >
              ⚠️ 이 작업은 되돌릴 수 없습니다
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteAccountDialogOpen(false)}
            sx={{
              color: '#6b7280',
              fontWeight: 700,
              textTransform: 'none',
              px: 3
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            sx={{
              bgcolor: '#ef4444',
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
              '&:hover': {
                bgcolor: '#dc2626'
              }
            }}
          >
            탈퇴하기
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Cache Dialog */}
      <Dialog
        open={clearCacheDialogOpen}
        onClose={() => setClearCacheDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 1,
            width: 320,
            p: 1,
            border: '2px solid #06b6d4'
          }
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: '#1f2937',
            fontSize: 18,
            letterSpacing: '-0.01em'
          }}
        >
          캐시 삭제
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              lineHeight: 1.6
            }}
          >
            저장된 캐시 데이터를 삭제하시겠습니까?
            <br />
            앱 성능이 일시적으로 느려질 수 있습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setClearCacheDialogOpen(false)}
            sx={{
              color: '#6b7280',
              fontWeight: 700,
              textTransform: 'none',
              px: 3
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleClearCache}
            variant="contained"
            sx={{
              bgcolor: '#06b6d4',
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
              '&:hover': {
                bgcolor: '#0891b2'
              }
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

SettingsPage.propTypes = {
  onNavigateToProfile: PropTypes.func,
  onLogout: PropTypes.func,
  onDeleteAccount: PropTypes.func,
  onBack: PropTypes.func
}

export default SettingsPage
