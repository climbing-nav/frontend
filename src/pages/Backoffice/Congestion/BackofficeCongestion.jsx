import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import CongestionLevelCard from '../../../components/Backoffice/Congestion/CongestionLevelCard';
import CongestionChart from '../../../components/Backoffice/CongestionChart/CongestionChart';
import PeakHoursCard from '../../../components/Backoffice/Congestion/PeakHoursCard';
import WeeklyTrendChart from '../../../components/Backoffice/Congestion/WeeklyTrendChart';
import AlertSettingsCard from '../../../components/Backoffice/Congestion/AlertSettingsCard';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const BackofficeCongestion = () => {
  return (
    <Box
      sx={{
        animation: `${fadeInUp} 0.6s ease-out`,
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1a1f2e 0%, #667eea 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          혼잡도 관리
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          실시간 암장 혼잡도를 모니터링하고 관리합니다
        </Typography>
      </Box>

      {/* Current Congestion Level */}
      <Box sx={{ mb: 3, animation: `${fadeInUp} 0.6s ease-out 0.1s backwards` }}>
        <CongestionLevelCard
          currentLevel="high"
          currentCount={156}
          capacity={200}
          trend="up"
          trendValue="+12"
          lastUpdated="방금 전"
        />
      </Box>

      {/* Real-time Chart */}
      <Box sx={{ mb: 3, animation: `${fadeInUp} 0.6s ease-out 0.2s backwards` }}>
        <CongestionChart />
      </Box>

      {/* Peak Hours */}
      <Box sx={{ mb: 3, animation: `${fadeInUp} 0.6s ease-out 0.3s backwards` }}>
        <PeakHoursCard
          peakHours={[
            { time: '18:00 - 20:00', count: 187, level: 'veryHigh' },
            { time: '12:00 - 14:00', count: 165, level: 'high' },
            { time: '20:00 - 22:00', count: 142, level: 'high' },
          ]}
          currentPeak="18:00 - 20:00"
          isPeakNow={false}
        />
      </Box>

      {/* Weekly Trend Chart */}
      <Box sx={{ mb: 3, animation: `${fadeInUp} 0.6s ease-out 0.4s backwards` }}>
        <WeeklyTrendChart />
      </Box>

      {/* Alert Settings */}
      <Box sx={{ mb: 3, animation: `${fadeInUp} 0.6s ease-out 0.5s backwards` }}>
        <AlertSettingsCard />
      </Box>

      {/* Footer Note */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          borderRadius: '16px',
          border: '1px solid #e8eaed',
          animation: `${fadeInUp} 0.6s ease-out 0.6s backwards`,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            color: '#6b7280',
            textAlign: 'center',
          }}
        >
          💡{' '}
          <strong style={{ color: '#1a1f2e' }}>실시간 데이터는 5분마다 자동으로 갱신됩니다.</strong>{' '}
          정확한 혼잡도 관리를 위해 입장/퇴장 시스템과 연동되어 있습니다.
        </Typography>
      </Box>
    </Box>
  );
};

export default BackofficeCongestion;
