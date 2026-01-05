import { useState } from 'react';
import { Box, Paper, Typography, Tabs, Tab, Avatar, Chip } from '@mui/material';
import { Store, PersonAdd, Terrain } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { recentGyms, recentMembers, recentProblems } from '../../../data/dashboardMockData';

const ActivityItem = ({ item, type }) => {
  if (type === 'gym') {
    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: '12px',
            transition: 'all 0.2s',
            '&:hover': { background: '#f8f9fa' },
          }}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: `${item.color}15`,
              color: item.color,
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {item.avatar}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                color: '#1a1f2e',
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.name}
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', fontSize: '12px' }}>
              {item.location}
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
            {item.time}
          </Typography>
        </Box>
      </motion.div>
    );
  }

  if (type === 'member') {
    const levelColors = { 초급: '#48bb78', 중급: '#f59e0b', 고급: '#ff6b35' };
    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: '12px',
            transition: 'all 0.2s',
            '&:hover': { background: '#f8f9fa' },
          }}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            {item.name[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#1a1f2e', fontSize: '14px' }}>
              {item.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={item.level}
                size="small"
                sx={{
                  height: '18px',
                  fontSize: '11px',
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  background: `${levelColors[item.level]}15`,
                  color: levelColors[item.level],
                  border: `1px solid ${levelColors[item.level]}30`,
                }}
              />
            </Box>
          </Box>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
            {item.time}
          </Typography>
        </Box>
      </motion.div>
    );
  }

  if (type === 'problem') {
    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: '12px',
            transition: 'all 0.2s',
            '&:hover': { background: '#f8f9fa' },
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: `${item.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Terrain sx={{ fontSize: 22, color: item.color }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#1a1f2e', fontSize: '14px' }}>
              {item.gym}
            </Typography>
            <Chip
              label={item.grade}
              size="small"
              sx={{
                height: '18px',
                fontSize: '11px',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                background: `${item.color}`,
                color: '#ffffff',
                mt: 0.5,
              }}
            />
          </Box>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
            {item.time}
          </Typography>
        </Box>
      </motion.div>
    );
  }

  return null;
};

const RecentActivity = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e8eaed',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 3, pb: 0 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e', mb: 0.5 }}>
          최근 활동 현황
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', fontSize: '13px' }}>
          실시간 업데이트되는 활동 내역
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{
          px: 3,
          mt: 2,
          borderBottom: '1px solid #e8eaed',
          '& .MuiTabs-indicator': {
            background: 'linear-gradient(90deg, #ff6b35 0%, #f59e0b 100%)',
            height: '3px',
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        {[{ icon: Store, label: '암장 등록' }, { icon: PersonAdd, label: '신규 회원' }, { icon: Terrain, label: '문제 등록' }].map(
          (tab, index) => (
            <Tab
              key={index}
              icon={<tab.icon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={tab.label}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'none',
                minHeight: '48px',
                '&.Mui-selected': { color: '#ff6b35' },
              }}
            />
          )
        )}
      </Tabs>

      <Box sx={{ p: 2 }}>
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div key="gyms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {recentGyms.map((gym, index) => (
                <motion.div key={gym.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                  <ActivityItem item={gym} type="gym" />
                </motion.div>
              ))}
            </motion.div>
          )}
          {activeTab === 1 && (
            <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {recentMembers.map((member, index) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                  <ActivityItem item={member} type="member" />
                </motion.div>
              ))}
            </motion.div>
          )}
          {activeTab === 2 && (
            <motion.div key="problems" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {recentProblems.map((problem, index) => (
                <motion.div key={problem.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                  <ActivityItem item={problem} type="problem" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Paper>
  );
};

export default RecentActivity;
