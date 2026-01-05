import { Box, Paper, Typography, Chip } from '@mui/material';
import { WatchLater, LocalFireDepartment, Schedule } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  }
`;

const PeakHoursCard = ({
  peakHours = [
    { time: '18:00 - 20:00', count: 187, level: 'veryHigh' },
    { time: '12:00 - 14:00', count: 165, level: 'high' },
    { time: '20:00 - 22:00', count: 142, level: 'high' },
  ],
  currentPeak = '18:00 - 20:00',
  isPeakNow = false,
}) => {
  const getLevelColor = (level) => {
    const colors = {
      low: '#48bb78',
      medium: '#f59e0b',
      high: '#ff6b35',
      veryHigh: '#ef4444',
    };
    return colors[level] || '#6b7280';
  };

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
            오늘의 피크 시간대
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: '#6b7280',
              fontSize: '13px',
            }}
          >
            가장 혼잡했던 시간대
          </Typography>
        </Box>

        {isPeakNow && (
          <Chip
            icon={<LocalFireDepartment sx={{ fontSize: 16 }} />}
            label="현재 피크타임"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ef4444 0%, #ff6b35 100%)',
              color: '#ffffff',
              animation: `${glow} 2s ease-in-out infinite`,
              '& .MuiChip-icon': {
                color: '#ffffff',
              },
            }}
          />
        )}
      </Box>

      {/* Peak Hours List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {peakHours.map((peak, index) => (
          <Box
            key={index}
            sx={{
              p: 2.5,
              background:
                index === 0
                  ? `linear-gradient(135deg, ${getLevelColor(peak.level)}08 0%, #ffffff 100%)`
                  : '#ffffff',
              border: index === 0 ? `2px solid ${getLevelColor(peak.level)}30` : '1px solid #e8eaed',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              },
            }}
          >
            {/* Rank Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                left: -8,
                width: 32,
                height: 32,
                borderRadius: '8px',
                background:
                  index === 0
                    ? 'linear-gradient(135deg, #ef4444 0%, #ff6b35 100%)'
                    : index === 1
                      ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {index + 1}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
              {/* Icon */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: `${getLevelColor(peak.level)}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {index === 0 ? (
                  <LocalFireDepartment sx={{ fontSize: 22, color: getLevelColor(peak.level) }} />
                ) : (
                  <Schedule sx={{ fontSize: 22, color: getLevelColor(peak.level) }} />
                )}
              </Box>

              {/* Time */}
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1a1f2e',
                    lineHeight: 1.2,
                  }}
                >
                  {peak.time}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '12px',
                    color: '#6b7280',
                    mt: 0.5,
                  }}
                >
                  {index === 0 ? '최고 피크' : `피크 ${index + 1}위`}
                </Typography>
              </Box>
            </Box>

            {/* Count */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: getLevelColor(peak.level),
                  lineHeight: 1,
                }}
              >
                {peak.count}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '11px',
                  color: '#9ca3af',
                  mt: 0.5,
                }}
              >
                명
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Footer Note */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          background: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e8eaed',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WatchLater sx={{ fontSize: 16, color: '#6b7280' }} />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              color: '#6b7280',
            }}
          >
            현재 예상 피크: <strong style={{ color: '#1a1f2e' }}>{currentPeak}</strong>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default PeakHoursCard;
