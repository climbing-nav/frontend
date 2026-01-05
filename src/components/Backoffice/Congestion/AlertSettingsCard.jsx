import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  Slider,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  NotificationsActive,
  Email,
  Sms,
  Circle,
  CheckCircle,
} from '@mui/icons-material';

const AlertSettingsCard = () => {
  const [alerts, setAlerts] = useState({
    enabled: true,
    threshold: 80,
    email: true,
    sms: false,
  });

  const handleThresholdChange = (event, newValue) => {
    setAlerts({ ...alerts, threshold: newValue });
  };

  const getThresholdColor = (value) => {
    if (value < 50) return '#48bb78';
    if (value < 75) return '#f59e0b';
    if (value < 90) return '#ff6b35';
    return '#ef4444';
  };

  const thresholdMarks = [
    { value: 0, label: '0%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e8eaed',
        borderRadius: '16px',
        height: '100%',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              color: '#1a1f2e',
              mb: 0.5,
            }}
          >
            혼잡도 알림 설정
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: '#6b7280',
              fontSize: '13px',
            }}
          >
            수용률 기준 자동 알림
          </Typography>
        </Box>

        <Switch
          checked={alerts.enabled}
          onChange={(e) => setAlerts({ ...alerts, enabled: e.target.checked })}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#48bb78',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            },
          }}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Alert Threshold */}
      <Box
        sx={{
          p: 3,
          background: alerts.enabled ? '#ffffff' : '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e8eaed',
          mb: 3,
          opacity: alerts.enabled ? 1 : 0.5,
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1a1f2e',
            }}
          >
            알림 기준 수용률
          </Typography>
          <Chip
            label={`${alerts.threshold}%`}
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              background: `${getThresholdColor(alerts.threshold)}15`,
              color: getThresholdColor(alerts.threshold),
              border: `1px solid ${getThresholdColor(alerts.threshold)}30`,
            }}
          />
        </Box>

        <Slider
          value={alerts.threshold}
          onChange={handleThresholdChange}
          disabled={!alerts.enabled}
          marks={thresholdMarks}
          min={0}
          max={100}
          sx={{
            mt: 3,
            mb: 2,
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
              background: '#ffffff',
              border: `3px solid ${getThresholdColor(alerts.threshold)}`,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0 0 0 8px ${getThresholdColor(alerts.threshold)}20`,
              },
            },
            '& .MuiSlider-track': {
              height: 6,
              background: `linear-gradient(90deg, #48bb78 0%, ${getThresholdColor(alerts.threshold)} 100%)`,
              border: 'none',
            },
            '& .MuiSlider-rail': {
              height: 6,
              background: '#e8eaed',
            },
            '& .MuiSlider-mark': {
              width: 2,
              height: 12,
              background: '#9ca3af',
            },
            '& .MuiSlider-markLabel': {
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '11px',
              color: '#9ca3af',
            },
          }}
        />

        <Box
          sx={{
            mt: 2,
            p: 2,
            background: `${getThresholdColor(alerts.threshold)}08`,
            borderRadius: '8px',
            border: `1px solid ${getThresholdColor(alerts.threshold)}20`,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              color: '#6b7280',
            }}
          >
            수용률이{' '}
            <strong style={{ color: getThresholdColor(alerts.threshold) }}>
              {alerts.threshold}%
            </strong>
            를 초과하면 알림을 전송합니다
          </Typography>
        </Box>
      </Box>

      {/* Notification Channels */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1a1f2e',
            mb: 2,
          }}
        >
          알림 채널
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Email */}
          <Box
            sx={{
              p: 2,
              background: alerts.email && alerts.enabled ? '#48bb7808' : '#ffffff',
              border: alerts.email && alerts.enabled ? '1px solid #48bb7830' : '1px solid #e8eaed',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: alerts.enabled ? 1 : 0.5,
              transition: 'all 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: alerts.email && alerts.enabled ? '#48bb7815' : '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Email
                  sx={{
                    fontSize: 20,
                    color: alerts.email && alerts.enabled ? '#48bb78' : '#9ca3af',
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1a1f2e',
                  }}
                >
                  이메일 알림
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '11px',
                    color: '#9ca3af',
                  }}
                >
                  admin@climbing.com
                </Typography>
              </Box>
            </Box>
            <Switch
              checked={alerts.email}
              disabled={!alerts.enabled}
              onChange={(e) => setAlerts({ ...alerts, email: e.target.checked })}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#48bb78',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  background: '#48bb78',
                },
              }}
            />
          </Box>

          {/* SMS */}
          <Box
            sx={{
              p: 2,
              background: alerts.sms && alerts.enabled ? '#667eea08' : '#ffffff',
              border: alerts.sms && alerts.enabled ? '1px solid #667eea30' : '1px solid #e8eaed',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: alerts.enabled ? 1 : 0.5,
              transition: 'all 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: alerts.sms && alerts.enabled ? '#667eea15' : '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sms
                  sx={{
                    fontSize: 20,
                    color: alerts.sms && alerts.enabled ? '#667eea' : '#9ca3af',
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1a1f2e',
                  }}
                >
                  SMS 알림
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '11px',
                    color: '#9ca3af',
                  }}
                >
                  010-****-****
                </Typography>
              </Box>
            </Box>
            <Switch
              checked={alerts.sms}
              disabled={!alerts.enabled}
              onChange={(e) => setAlerts({ ...alerts, sms: e.target.checked })}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#667eea',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  background: '#667eea',
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Save Button */}
      <Button
        fullWidth
        disabled={!alerts.enabled}
        sx={{
          py: 1.5,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '14px',
          fontWeight: 700,
          textTransform: 'none',
          background: alerts.enabled
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : '#e8eaed',
          color: alerts.enabled ? '#ffffff' : '#9ca3af',
          borderRadius: '12px',
          boxShadow: alerts.enabled ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
          '&:hover': {
            background: alerts.enabled
              ? 'linear-gradient(135deg, #5568d3 0%, #66388f 100%)'
              : '#e8eaed',
            boxShadow: alerts.enabled ? '0 6px 16px rgba(102, 126, 234, 0.4)' : 'none',
          },
          '&:disabled': {
            color: '#9ca3af',
          },
        }}
      >
        {alerts.enabled ? (
          <>
            <CheckCircle sx={{ fontSize: 18, mr: 1 }} />
            설정 저장
          </>
        ) : (
          '알림 비활성화됨'
        )}
      </Button>
    </Paper>
  );
};

export default AlertSettingsCard;
