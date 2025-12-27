import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Language,
  ChevronRight,
} from '@mui/icons-material';

const SettingItem = ({ icon: Icon, title, description }) => (
  <ListItem
    sx={{
      py: 2,
      px: 0,
      borderBottom: '1px solid #f3f4f6',
      cursor: 'pointer',
      '&:hover': {
        '& .setting-icon': {
          transform: 'translateX(4px)',
        },
      },
    }}
  >
    <ListItemIcon sx={{ minWidth: 48 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 143, 102, 0.05) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: 20, color: '#ff6b35' }} />
      </Box>
    </ListItemIcon>
    <ListItemText
      primary={title}
      secondary={description}
      primaryTypographyProps={{
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 600,
        fontSize: '15px',
        color: '#1a1f2e',
      }}
      secondaryTypographyProps={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '13px',
        color: '#9ca3af',
      }}
    />
    <ChevronRight
      className="setting-icon"
      sx={{
        color: '#d1d5db',
        transition: 'transform 0.2s ease',
      }}
    />
  </ListItem>
);

const BackofficeSettings = () => {
  const settings = [
    {
      icon: Notifications,
      title: '알림 설정',
      description: '푸시 알림 및 이메일 알림 관리',
    },
    {
      icon: Security,
      title: '보안 설정',
      description: '비밀번호 변경 및 2단계 인증',
    },
    {
      icon: Palette,
      title: '테마 설정',
      description: '다크모드 및 UI 커스터마이징',
    },
    {
      icon: Language,
      title: '언어 설정',
      description: '표시 언어 및 지역 설정',
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            color: '#1a1f2e',
            mb: 1,
          }}
        >
          설정
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: '#6b7280',
          }}
        >
          백오피스 시스템 설정을 관리합니다
        </Typography>
      </Box>

      {/* Settings List */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid #e8eaed',
          borderRadius: '16px',
          p: 3,
        }}
      >
        <List sx={{ p: 0 }}>
          {settings.map((setting, index) => (
            <SettingItem key={index} {...setting} />
          ))}
        </List>
      </Paper>

      {/* Version Info */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: '#9ca3af',
            fontSize: '12px',
          }}
        >
          ClimbHub Backoffice v1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default BackofficeSettings;
