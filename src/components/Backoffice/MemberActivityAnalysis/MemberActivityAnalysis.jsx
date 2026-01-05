import { useState } from 'react';
import { Box, Paper, Typography, Grid, Tabs, Tab } from '@mui/material';
import { Assessment, CalendarToday, DateRange, People, Repeat } from '@mui/icons-material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';
import { dailyActivityData, weeklyActivityData, monthlyActivityData } from '../../../data/dashboardMockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 2, background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px' }}>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#6b7280', mb: 1 }}>{label}</Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: entry.dataKey === 'newSignups' ? '2px' : '50%', background: entry.color }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600, color: '#1a1f2e' }}>
              {entry.dataKey === 'active' ? '활성 사용자' : '신규 가입'}: {entry.value.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

const MemberActivityAnalysis = () => {
  const [period, setPeriod] = useState(0);
  const activityData = [dailyActivityData, weeklyActivityData, monthlyActivityData][period];

  const metricCards = [
    { label: 'DAU', value: '478', change: '+12%', color: '#ff6b35', icon: CalendarToday },
    { label: 'WAU', value: '2.6K', change: '+8%', color: '#667eea', icon: DateRange },
    { label: 'MAU', value: '9.1K', change: '+15%', color: '#48bb78', icon: People },
    { label: '재방문율', value: '68%', change: '+5%', color: '#f59e0b', icon: Repeat },
  ];

  const retentionData = [
    { name: '재방문', value: 68, color: '#48bb78' },
    { name: '신규', value: 32, color: '#667eea' },
  ];

  return (
    <Paper elevation={0} sx={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid #e8eaed', borderRadius: '16px', overflow: 'hidden' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Assessment sx={{ fontSize: 24, color: '#667eea' }} />
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e' }}>회원 활동 분석</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', fontSize: '13px' }}>사용자 활동 및 가입 추이</Typography>
          </Box>
        </Box>

        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {metricCards.map((metric, index) => (
            <Grid item xs={6} key={index}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                <Box sx={{ p: 2, borderRadius: '12px', background: `${metric.color}08`, border: `1px solid ${metric.color}20` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <metric.icon sx={{ fontSize: 16, color: metric.color }} />
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>{metric.label}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '20px', fontWeight: 700, color: '#1a1f2e' }}>{metric.value}</Typography>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: '#48bb78' }}>{metric.change}</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Tabs
          value={period}
          onChange={(e, v) => setPeriod(v)}
          sx={{
            mb: 3,
            minHeight: '36px',
            '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', height: '3px', borderRadius: '3px 3px 0 0' },
            '& .MuiTab-root': { minHeight: '36px', py: 1 },
          }}
        >
          {['일간', '주간', '월간'].map((label, index) => (
            <Tab key={index} label={label} sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '13px', textTransform: 'none', '&.Mui-selected': { color: '#667eea' } }} />
          ))}
        </Tabs>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 3, borderRadius: '2px', background: '#667eea' }} />
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#6b7280' }}>활성 사용자</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 8, borderRadius: '2px', background: '#48bb78' }} />
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#6b7280' }}>신규 가입</Typography>
            </Box>
          </Box>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontFamily: '"DM Sans", sans-serif', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e8eaed' }} />
              <YAxis yAxisId="left" tick={{ fill: '#6b7280', fontFamily: '"DM Sans", sans-serif', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e8eaed' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280', fontFamily: '"DM Sans", sans-serif', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e8eaed' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="right" dataKey="newSignups" fill="#48bb78" radius={[4, 4, 0, 0]} barSize={20} />
              <Line yAxisId="left" type="monotone" dataKey="active" stroke="#667eea" strokeWidth={3} dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ width: 100, height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={retentionData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={2} dataKey="value">
                  {retentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '14px', color: '#1a1f2e', mb: 1.5 }}>재방문율 분석</Typography>
            {retentionData.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '3px', background: item.color }} />
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#6b7280', flex: 1 }}>{item.name}</Typography>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '14px', fontWeight: 600, color: '#1a1f2e' }}>{item.value}%</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MemberActivityAnalysis;
