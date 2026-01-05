import { useState } from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { CalendarMonth, DateRange } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const weeklyData = [
  { day: '월', count: 145, level: 'medium' },
  { day: '화', count: 132, level: 'medium' },
  { day: '수', count: 167, level: 'high' },
  { day: '목', count: 178, level: 'high' },
  { day: '금', count: 189, level: 'veryHigh' },
  { day: '토', count: 198, level: 'veryHigh' },
  { day: '일', count: 156, level: 'high' },
];

const monthlyData = [
  { week: '1주차', count: 152, level: 'medium' },
  { week: '2주차', count: 168, level: 'high' },
  { week: '3주차', count: 145, level: 'medium' },
  { week: '4주차', count: 187, level: 'veryHigh' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          background: '#ffffff',
          border: '1px solid #e8eaed',
          borderRadius: '12px',
        }}
      >
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '12px',
            color: '#6b7280',
            mb: 1,
          }}
        >
          {payload[0].payload.day || payload[0].payload.week}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#1a1f2e',
          }}
        >
          {payload[0].value}명
        </Typography>
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '11px',
            color: '#9ca3af',
            mt: 0.5,
          }}
        >
          평균 방문자
        </Typography>
      </Paper>
    );
  }
  return null;
};

const WeeklyTrendChart = () => {
  const [period, setPeriod] = useState('week'); // 'week' or 'month'

  const data = period === 'week' ? weeklyData : monthlyData;

  const getLevelColor = (level) => {
    const colors = {
      low: '#48bb78',
      medium: '#f59e0b',
      high: '#ff6b35',
      veryHigh: '#ef4444',
    };
    return colors[level] || '#6b7280';
  };

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e8eaed',
        borderRadius: '16px',
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
            혼잡도 트렌드
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: '#6b7280',
              fontSize: '13px',
            }}
          >
            {period === 'week' ? '주간' : '월간'} 평균 방문자 추이
          </Typography>
        </Box>

        {/* Period Toggle */}
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              px: 2,
              py: 1,
              border: '1px solid #e8eaed',
              color: '#6b7280',
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: '1px solid transparent',
                '&:hover': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
              },
              '&:hover': {
                background: '#f8f9fa',
              },
            },
          }}
        >
          <ToggleButton value="week">
            <CalendarMonth sx={{ fontSize: 16, mr: 0.5 }} />
            주간
          </ToggleButton>
          <ToggleButton value="month">
            <DateRange sx={{ fontSize: 16, mr: 0.5 }} />
            월간
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Chart */}
      <Box
        sx={{
          '& *': {
            outline: 'none !important',
          },
          '& *:focus': {
            outline: 'none !important',
          },
          '& *:focus-visible': {
            outline: 'none !important',
          },
        }}
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getLevelColor(entry.level)} stopOpacity={1} />
                  <stop offset="100%" stopColor={getLevelColor(entry.level)} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" vertical={false} />
            <XAxis
              dataKey={period === 'week' ? 'day' : 'week'}
              tick={{ fill: '#6b7280', fontFamily: '"DM Sans", sans-serif', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e8eaed' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontFamily: '"DM Sans", sans-serif', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e8eaed' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f9fa' }} />
            <Bar
              dataKey="count"
              radius={[12, 12, 0, 0]}
              animationDuration={1000}
              animationBegin={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Statistics Summary */}
      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
        }}
      >
        {[
          {
            label: '평균',
            value: Math.round(data.reduce((acc, cur) => acc + cur.count, 0) / data.length),
            color: '#667eea',
          },
          {
            label: '최고',
            value: Math.max(...data.map((d) => d.count)),
            color: '#ef4444',
          },
          {
            label: '최저',
            value: Math.min(...data.map((d) => d.count)),
            color: '#48bb78',
          },
        ].map((stat, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e8eaed',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '11px',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 0.5,
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: stat.color,
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default WeeklyTrendChart;
