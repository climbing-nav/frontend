import { Box, Typography, Grid } from '@mui/material';
import { FitnessCenter, People, TrendingUp, Assessment } from '@mui/icons-material';

// Backoffice Dashboard Components
import StatCard from '../../../components/Backoffice/StatCard/StatCard';
import CongestionChart from '../../../components/Backoffice/CongestionChart/CongestionChart';
import RecentActivity from '../../../components/Backoffice/RecentActivity/RecentActivity';
import PopularGymsRanking from '../../../components/Backoffice/PopularGymsRanking/PopularGymsRanking';
import MemberActivityAnalysis from '../../../components/Backoffice/MemberActivityAnalysis/MemberActivityAnalysis';
import ReviewsFeedback from '../../../components/Backoffice/ReviewsFeedback/ReviewsFeedback';
import SystemNotifications from '../../../components/Backoffice/SystemNotifications/SystemNotifications';

const BackofficeDashboard = () => {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e', mb: 1 }}>
          대시보드
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280' }}>
          전체 암장 운영 현황을 한눈에 확인하세요
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <StatCard icon={FitnessCenter} title="등록 암장" value="24" color="#ff6b35" />
        </Grid>
        <Grid item xs={6}>
          <StatCard icon={People} title="총 회원" value="1,234" color="#667eea" />
        </Grid>
        <Grid item xs={6}>
          <StatCard icon={TrendingUp} title="오늘 방문" value="89" color="#48bb78" />
        </Grid>
        <Grid item xs={6}>
          <StatCard icon={Assessment} title="평균 혼잡도" value="45%" color="#f59e0b" />
        </Grid>
      </Grid>

      {/* Congestion Chart */}
      <Box sx={{ mb: 3 }}>
        <CongestionChart />
      </Box>

      {/* Recent Activity */}
      <Box sx={{ mb: 3 }}>
        <RecentActivity />
      </Box>

      {/* Popular Gyms Ranking */}
      <Box sx={{ mb: 3 }}>
        <PopularGymsRanking />
      </Box>

      {/* Member Activity Analysis */}
      <Box sx={{ mb: 3 }}>
        <MemberActivityAnalysis />
      </Box>

      {/* Reviews & Feedback */}
      <Box sx={{ mb: 3 }}>
        <ReviewsFeedback />
      </Box>

      {/* System Notifications */}
      <SystemNotifications />
    </Box>
  );
};

export default BackofficeDashboard;
