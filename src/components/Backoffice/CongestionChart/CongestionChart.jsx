import { Box, Paper, Typography, Chip } from '@mui/material';
import { Schedule } from '@mui/icons-material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { congestionData } from '../../../data/dashboardMockData';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 2, background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px' }}>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#6b7280', mb: 1 }}>
          {payload[0].payload.time}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#ff6b35' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600, color: '#1a1f2e' }}>
              오늘: {payload[0].value}명
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#667eea' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600, color: '#1a1f2e' }}>
              어제: {payload[1].value}명
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }
  return null;
};

const CongestionChart = () => {
  const currentHour = new Date().getHours();
  const currentTimeLabel = `${String(currentHour).padStart(2, '0')}:00`;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e8eaed',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e', mb: 0.5 }}>
          실시간 혼잡도
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', fontSize: '13px' }}>
          시간대별 암장 방문자 추이
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 3, borderRadius: '2px', background: '#ff6b35' }} />
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#6b7280' }}>오늘</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 3, borderRadius: '2px', background: '#667eea' }} />
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#6b7280' }}>어제</Typography>
        </Box>
        <Chip
          icon={<Schedule sx={{ fontSize: 14 }} />}
          label={`현재 시간: ${currentTimeLabel}`}
          size="small"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '12px',
            background: '#48bb7815',
            color: '#48bb78',
            border: '1px solid #48bb7830',
            fontWeight: 600,
          }}
        />
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={congestionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorYesterday" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#667eea" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#6b7280', fontFamily: '"DM Sans", sans-serif', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e8eaed' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontFamily: '"DM Sans", sans-serif', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e8eaed' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={currentTimeLabel} stroke="#48bb78" strokeWidth={2} strokeDasharray="5 5" />
          <Area type="monotone" dataKey="yesterday" stroke="#667eea" strokeWidth={2} fill="url(#colorYesterday)" animationDuration={1500} />
          <Area type="monotone" dataKey="today" stroke="#ff6b35" strokeWidth={3} fill="url(#colorToday)" animationDuration={1500} />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CongestionChart;
