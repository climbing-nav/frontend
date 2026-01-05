import { Box, Paper, Typography, Grid, Badge, Chip, IconButton } from '@mui/material';
import {
  Notifications,
  VerifiedUser,
  Flag,
  Build,
  ArrowForward,
  PriorityHigh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { systemNotifications } from '../../../data/dashboardMockData';

const SystemNotifications = () => {
  const pendingApprovals = systemNotifications.filter((n) => n.type === 'approval').length;
  const pendingReports = systemNotifications.filter((n) => n.type === 'report').length;

  const getTypeConfig = (type) => {
    switch (type) {
      case 'approval':
        return { icon: VerifiedUser, color: '#667eea', label: '승인 요청' };
      case 'report':
        return { icon: Flag, color: '#ef4444', label: '신고' };
      case 'maintenance':
        return { icon: Build, color: '#f59e0b', label: '점검' };
      default:
        return { icon: Notifications, color: '#6b7280', label: '알림' };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'urgent':
        return { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: '긴급' };
      case 'high':
        return { color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', label: '주의' };
      default:
        return { color: '#667eea', bg: '#eef2ff', border: '#c7d2fe', label: '일반' };
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e8eaed',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Badge badgeContent={systemNotifications.length} color="error" sx={{ '& .MuiBadge-badge': { fontFamily: '"DM Sans", sans-serif', fontWeight: 600 } }}>
                <Notifications sx={{ fontSize: 24, color: '#ff6b35' }} />
              </Badge>
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e' }}>
                시스템 알림
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', fontSize: '13px' }}>
              처리가 필요한 알림 및 공지
            </Typography>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                border: '1px solid #c7d2fe',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: '#667eea' }}>
                    승인 대기
                  </Typography>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '24px', fontWeight: 700, color: '#1a1f2e' }}>
                    {pendingApprovals}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#667eea20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <VerifiedUser sx={{ fontSize: 20, color: '#667eea' }} />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                border: '1px solid #fecaca',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: '#ef4444' }}>
                    신고 접수
                  </Typography>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '24px', fontWeight: 700, color: '#1a1f2e' }}>
                    {pendingReports}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flag sx={{ fontSize: 20, color: '#ef4444' }} />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Notifications List */}
        {systemNotifications.map((notification, index) => {
          const typeConfig = getTypeConfig(notification.type);
          const priorityConfig = getPriorityConfig(notification.priority);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  mb: 1.5,
                  background: `linear-gradient(135deg, ${priorityConfig.bg} 0%, ${priorityConfig.bg} 100%)`,
                  border: `1px solid ${priorityConfig.border}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: `0 4px 12px ${priorityConfig.color}20`,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: priorityConfig.color,
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      background: `${typeConfig.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <typeConfig.icon sx={{ fontSize: 20, color: typeConfig.color }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '14px', color: '#1a1f2e' }}>
                        {notification.title}
                      </Typography>
                      {notification.count && (
                        <Chip
                          label={`+${notification.count}`}
                          size="small"
                          sx={{
                            height: '18px',
                            fontSize: '10px',
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 700,
                            background: typeConfig.color,
                            color: '#ffffff',
                          }}
                        />
                      )}
                      {notification.priority === 'urgent' && (
                        <PriorityHigh sx={{ fontSize: 16, color: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '13px',
                        color: '#4b5563',
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {notification.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={typeConfig.label}
                          size="small"
                          sx={{
                            height: '18px',
                            fontSize: '10px',
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 600,
                            background: `${typeConfig.color}15`,
                            color: typeConfig.color,
                          }}
                        />
                        <Chip
                          label={priorityConfig.label}
                          size="small"
                          sx={{
                            height: '18px',
                            fontSize: '10px',
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 600,
                            background: `${priorityConfig.color}15`,
                            color: priorityConfig.color,
                          }}
                        />
                        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#9ca3af' }}>
                          {notification.time}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        sx={{
                          width: 28,
                          height: 28,
                          background: `${typeConfig.color}10`,
                          '&:hover': { background: `${typeConfig.color}20` },
                        }}
                      >
                        <ArrowForward sx={{ fontSize: 14, color: typeConfig.color }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </Paper>
  );
};

export default SystemNotifications;
