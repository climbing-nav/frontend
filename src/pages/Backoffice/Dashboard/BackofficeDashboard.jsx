import { Box, Typography, Paper, Grid } from '@mui/material';
import {
  TrendingUp,
  People,
  FitnessCenter,
  Assessment,
} from '@mui/icons-material';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid #e8eaed',
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: color,
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: 24, color }} />
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: '#6b7280',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            color: '#1a1f2e',
            mt: 0.5,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const BackofficeDashboard = () => {
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
          대시보드
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: '#6b7280',
          }}
        >
          전체 암장 운영 현황을 한눈에 확인하세요
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <StatCard
            icon={FitnessCenter}
            title="등록 암장"
            value="24"
            color="#ff6b35"
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            icon={People}
            title="총 회원"
            value="1,234"
            color="#667eea"
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            icon={TrendingUp}
            title="오늘 방문"
            value="89"
            color="#48bb78"
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            icon={Assessment}
            title="평균 혼잡도"
            value="45%"
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      {/* Placeholder for future content */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid #e8eaed',
          borderRadius: '16px',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: '#9ca3af',
          }}
        >
          상세 대시보드 컨텐츠는 추후 구현 예정입니다
        </Typography>
      </Paper>
    </Box>
  );
};

export default BackofficeDashboard;
