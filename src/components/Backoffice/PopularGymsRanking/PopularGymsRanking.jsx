import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
} from '@mui/material';
import { TrendingUp, TrendingDown, Remove, EmojiEvents, Star } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { popularGymsWeekly, popularGymsMonthly } from '../../../data/dashboardMockData';

const PopularGymsRanking = () => {
  const [period, setPeriod] = useState('weekly');
  const gymsData = period === 'weekly' ? popularGymsWeekly : popularGymsMonthly;
  const maxVisitors = Math.max(...gymsData.map((g) => g.visitors));

  const getRankStyle = (rank) => {
    if (rank === 1) return { background: 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)', color: '#ffffff', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)' };
    if (rank === 2) return { background: 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%)', color: '#ffffff' };
    if (rank === 3) return { background: 'linear-gradient(135deg, #cd7f32 0%, #b8860b 100%)', color: '#ffffff' };
    return { background: '#f3f4f6', color: '#6b7280' };
  };

  const getChangeIcon = (change) => {
    if (change === 'up') return <TrendingUp sx={{ fontSize: 16, color: '#48bb78' }} />;
    if (change === 'down') return <TrendingDown sx={{ fontSize: 16, color: '#f56565' }} />;
    return <Remove sx={{ fontSize: 16, color: '#9ca3af' }} />;
  };

  return (
    <Paper elevation={0} sx={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid #e8eaed', borderRadius: '16px', overflow: 'hidden' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <EmojiEvents sx={{ fontSize: 24, color: '#f59e0b' }} />
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e' }}>
                인기 암장 순위
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', fontSize: '13px' }}>
              방문자 수 기준 Top 5
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(e, v) => v && setPeriod(v)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'none',
                px: 2,
                py: 0.5,
                border: '1px solid #e8eaed',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f59e0b 100%)',
                  color: '#ffffff',
                  border: '1px solid transparent',
                  '&:hover': { background: 'linear-gradient(135deg, #ff6b35 0%, #f59e0b 100%)' },
                },
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
              },
            }}
          >
            <ToggleButton value="weekly">금주</ToggleButton>
            <ToggleButton value="monthly">금월</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <AnimatePresence mode="wait">
          <motion.div key={period} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {gymsData.map((gym, index) => (
              <motion.div key={gym.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.08 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: '12px',
                    mb: 1,
                    background: index === 0 ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : 'transparent',
                    border: index === 0 ? '1px solid #fcd34d' : '1px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': { background: index === 0 ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#f8f9fa' },
                  }}
                >
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '14px', ...getRankStyle(index + 1) }}>
                    {index + 1}
                  </Box>
                  <Avatar sx={{ width: 40, height: 40, background: index === 0 ? 'linear-gradient(135deg, #ff6b35 0%, #f59e0b 100%)' : '#667eea15', color: index === 0 ? '#ffffff' : '#667eea', fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '13px' }}>
                    {gym.avatar}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#1a1f2e', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {gym.name}
                      </Typography>
                      {getChangeIcon(gym.change)}
                    </Box>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', fontSize: '12px' }}>{gym.location}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#9ca3af' }}>방문자</Typography>
                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '12px', fontWeight: 600, color: '#1a1f2e' }}>{gym.visitors.toLocaleString()}명</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(gym.visitors / maxVisitors) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          background: '#e8eaed',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: index === 0 ? 'linear-gradient(90deg, #ff6b35 0%, #f59e0b 100%)' : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '14px', color: '#1a1f2e' }}>{gym.rating}</Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Paper>
  );
};

export default PopularGymsRanking;
