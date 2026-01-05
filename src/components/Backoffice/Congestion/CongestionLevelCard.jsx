import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat, People } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const CONGESTION_LEVELS = {
  low: {
    label: '여유',
    color: '#48bb78',
    bgColor: '#48bb7808',
    borderColor: '#48bb7820',
    description: '쾌적한 이용이 가능합니다',
    icon: '🟢',
  },
  medium: {
    label: '보통',
    color: '#f59e0b',
    bgColor: '#f59e0b08',
    borderColor: '#f59e0b20',
    description: '적정 수준의 혼잡도입니다',
    icon: '🟡',
  },
  high: {
    label: '혼잡',
    color: '#ff6b35',
    bgColor: '#ff6b3508',
    borderColor: '#ff6b3520',
    description: '다소 붐빕니다',
    icon: '🟠',
  },
  veryHigh: {
    label: '매우혼잡',
    color: '#ef4444',
    bgColor: '#ef444408',
    borderColor: '#ef444420',
    description: '매우 붐비고 있습니다',
    icon: '🔴',
  },
};

const CongestionLevelCard = ({
  currentLevel = 'medium',
  currentCount = 156,
  capacity = 200,
  trend = 'up', // 'up', 'down', 'stable'
  trendValue = '+12',
  lastUpdated = '방금 전'
}) => {
  const levelConfig = CONGESTION_LEVELS[currentLevel];
  const percentage = (currentCount / capacity) * 100;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : TrendingFlat;
  const trendColor = trend === 'up' ? '#ff6b35' : trend === 'down' ? '#48bb78' : '#6b7280';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        background: `linear-gradient(135deg, ${levelConfig.bgColor} 0%, #ffffff 100%)`,
        border: `2px solid ${levelConfig.borderColor}`,
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        animation: `${pulse} 3s ease-in-out infinite`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '200%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${levelConfig.borderColor}, transparent)`,
          animation: `${shimmer} 3s infinite`,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            현재 혼잡도
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography
              sx={{
                fontSize: '32px',
                lineHeight: 1,
              }}
            >
              {levelConfig.icon}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: levelConfig.color,
                textShadow: `0 2px 20px ${levelConfig.color}40`,
              }}
            >
              {levelConfig.label}
            </Typography>
          </Box>
        </Box>

        {/* Live Indicator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            background: '#1a1f2e08',
            borderRadius: '12px',
            border: '1px solid #e8eaed',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ef4444',
              animation: `${pulse} 2s ease-in-out infinite`,
              boxShadow: '0 0 8px #ef4444',
            }}
          />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1a1f2e',
            }}
          >
            LIVE
          </Typography>
        </Box>
      </Box>

      {/* Current Count */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: '16px',
          border: '1px solid #e8eaed',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: `${levelConfig.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <People sx={{ fontSize: 24, color: levelConfig.color }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  color: '#1a1f2e',
                  lineHeight: 1,
                }}
              >
                {currentCount}
                <Typography
                  component="span"
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#6b7280',
                    ml: 1,
                  }}
                >
                  / {capacity}명
                </Typography>
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '12px',
                  color: '#9ca3af',
                  mt: 0.5,
                }}
              >
                현재 이용 중
              </Typography>
            </Box>
          </Box>

          {/* Trend */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 2,
              py: 1,
              background: `${trendColor}10`,
              borderRadius: '12px',
              border: `1px solid ${trendColor}30`,
            }}
          >
            <TrendIcon sx={{ fontSize: 18, color: trendColor }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                color: trendColor,
              }}
            >
              {trendValue}
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              수용률
            </Typography>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: levelConfig.color,
              }}
            >
              {percentage.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 10,
              borderRadius: '10px',
              background: '#e8eaed',
              '& .MuiLinearProgress-bar': {
                borderRadius: '10px',
                background: `linear-gradient(90deg, ${levelConfig.color} 0%, ${levelConfig.color}dd 100%)`,
                boxShadow: `0 2px 8px ${levelConfig.color}40`,
              },
            }}
          />
        </Box>
      </Box>

      {/* Description */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            color: '#6b7280',
          }}
        >
          {levelConfig.description}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '11px',
            color: '#9ca3af',
          }}
        >
          {lastUpdated} 업데이트
        </Typography>
      </Box>
    </Paper>
  );
};

export default CongestionLevelCard;
