import { Box, Typography, Paper } from '@mui/material';
import { BarChart } from '@mui/icons-material';

const BackofficeCongestion = () => {
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
          혼잡도 관리
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: '#6b7280',
          }}
        >
          실시간 암장 혼잡도를 모니터링하고 관리합니다
        </Typography>
      </Box>

      {/* Placeholder Content */}
      <Paper
        elevation={0}
        sx={{
          p: 6,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '2px dashed #e8eaed',
          borderRadius: '16px',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 143, 102, 0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2,
          }}
        >
          <BarChart sx={{ fontSize: 40, color: '#ff6b35' }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            color: '#1a1f2e',
            mb: 1,
          }}
        >
          혼잡도 모니터링 기능 준비 중
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: '#9ca3af',
          }}
        >
          실시간 혼잡도 차트, 통계, 알림 설정 기능이 곧 제공됩니다
        </Typography>
      </Paper>
    </Box>
  );
};

export default BackofficeCongestion;
