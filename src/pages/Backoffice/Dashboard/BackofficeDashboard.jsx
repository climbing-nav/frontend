import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Avatar,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  IconButton,
  Badge,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  People,
  FitnessCenter,
  Assessment,
  Store,
  PersonAdd,
  Terrain,
  Schedule,
  Star,
  StarBorder,
  StarHalf,
  EmojiEvents,
  CalendarToday,
  DateRange,
  Repeat,
  RateReview,
  Warning,
  Error,
  CheckCircle,
  Build,
  Notifications,
  Flag,
  VerifiedUser,
  ArrowForward,
  PriorityHigh,
} from '@mui/icons-material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  LineChart,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for congestion chart
const congestionData = [
  { time: '06:00', today: 12, yesterday: 8 },
  { time: '08:00', today: 35, yesterday: 28 },
  { time: '10:00', today: 58, yesterday: 52 },
  { time: '12:00', today: 82, yesterday: 75 },
  { time: '14:00', today: 95, yesterday: 88, isPeak: true },
  { time: '16:00', today: 78, yesterday: 82 },
  { time: '18:00', today: 120, yesterday: 115, isPeak: true },
  { time: '20:00', today: 102, yesterday: 98 },
  { time: '22:00', today: 45, yesterday: 52 },
];

// Mock data for recent activities
const recentGyms = [
  { id: 1, name: '클라임 하우스 강남', location: '서울 강남구', time: '5분 전', avatar: 'CH', color: '#ff6b35' },
  { id: 2, name: '더클라임 홍대', location: '서울 마포구', time: '12분 전', avatar: 'TC', color: '#667eea' },
  { id: 3, name: '볼더링 파크', location: '서울 송파구', time: '25분 전', avatar: 'BP', color: '#48bb78' },
  { id: 4, name: '스파이더 클라임', location: '경기 성남시', time: '1시간 전', avatar: 'SC', color: '#f59e0b' },
  { id: 5, name: '락앤클라임', location: '서울 강서구', time: '2시간 전', avatar: 'RC', color: '#ec4899' },
];

const recentMembers = [
  { id: 1, name: '김민수', time: '방금 전', level: '초급' },
  { id: 2, name: '이지은', time: '3분 전', level: '중급' },
  { id: 3, name: '박준호', time: '8분 전', level: '초급' },
  { id: 4, name: '최서연', time: '15분 전', level: '고급' },
  { id: 5, name: '정우진', time: '22분 전', level: '중급' },
];

const recentProblems = [
  { id: 1, gym: '클라임 하우스', grade: 'V4', color: '#48bb78', time: '10분 전' },
  { id: 2, gym: '더클라임', grade: 'V7', color: '#f59e0b', time: '18분 전' },
  { id: 3, gym: '볼더링 파크', grade: 'V3', color: '#667eea', time: '32분 전' },
  { id: 4, gym: '스파이더', grade: 'V9', color: '#ff6b35', time: '45분 전' },
  { id: 5, gym: '락앤클라임', grade: 'V5', color: '#ec4899', time: '1시간 전' },
];

// Mock data for popular gyms ranking
const popularGymsWeekly = [
  { id: 1, name: '클라임 하우스 강남', location: '서울 강남구', visitors: 1250, rating: 4.8, change: 'up', avatar: 'CH' },
  { id: 2, name: '더클라임 홍대', location: '서울 마포구', visitors: 1180, rating: 4.7, change: 'up', avatar: 'TC' },
  { id: 3, name: '볼더링 파크', location: '서울 송파구', visitors: 980, rating: 4.6, change: 'down', avatar: 'BP' },
  { id: 4, name: '스파이더 클라임', location: '경기 성남시', visitors: 890, rating: 4.5, change: 'same', avatar: 'SC' },
  { id: 5, name: '락앤클라임', location: '서울 강서구', visitors: 750, rating: 4.4, change: 'up', avatar: 'RC' },
];

const popularGymsMonthly = [
  { id: 1, name: '더클라임 홍대', location: '서울 마포구', visitors: 4820, rating: 4.7, change: 'up', avatar: 'TC' },
  { id: 2, name: '클라임 하우스 강남', location: '서울 강남구', visitors: 4650, rating: 4.8, change: 'down', avatar: 'CH' },
  { id: 3, name: '스파이더 클라임', location: '경기 성남시', visitors: 3890, rating: 4.5, change: 'up', avatar: 'SC' },
  { id: 4, name: '볼더링 파크', location: '서울 송파구', visitors: 3540, rating: 4.6, change: 'down', avatar: 'BP' },
  { id: 5, name: '클라이밍 팩토리', location: '서울 영등포구', visitors: 3120, rating: 4.3, change: 'up', avatar: 'CF' },
];

// Mock data for member activity analysis
const dailyActivityData = [
  { date: '12/29', active: 245, newSignups: 18 },
  { date: '12/30', active: 312, newSignups: 24 },
  { date: '12/31', active: 198, newSignups: 12 },
  { date: '01/01', active: 156, newSignups: 8 },
  { date: '01/02', active: 389, newSignups: 32 },
  { date: '01/03', active: 425, newSignups: 28 },
  { date: '01/04', active: 478, newSignups: 35 },
];

const weeklyActivityData = [
  { date: '12월 1주', active: 1850, newSignups: 142 },
  { date: '12월 2주', active: 2120, newSignups: 168 },
  { date: '12월 3주', active: 1980, newSignups: 135 },
  { date: '12월 4주', active: 2450, newSignups: 198 },
  { date: '1월 1주', active: 2680, newSignups: 225 },
];

const monthlyActivityData = [
  { date: '9월', active: 6800, newSignups: 520 },
  { date: '10월', active: 7450, newSignups: 612 },
  { date: '11월', active: 8200, newSignups: 698 },
  { date: '12월', active: 9100, newSignups: 785 },
  { date: '1월', active: 8950, newSignups: 742 },
];

// Mock data for reviews
const recentReviews = [
  {
    id: 1,
    userName: '박서준',
    gymName: '클라임 하우스 강남',
    rating: 5,
    content: '시설이 깨끗하고 직원분들이 너무 친절해요! 초보자도 쉽게 배울 수 있었습니다.',
    time: '10분 전',
    isNegative: false,
  },
  {
    id: 2,
    userName: '김예진',
    gymName: '더클라임 홍대',
    rating: 2,
    content: '주말에 너무 혼잡해서 제대로 운동을 할 수 없었어요. 인원 제한이 필요할 것 같습니다.',
    time: '25분 전',
    isNegative: true,
  },
  {
    id: 3,
    userName: '이동현',
    gymName: '볼더링 파크',
    rating: 4,
    content: '루트 세팅이 다양하고 재미있어요. 다만 샤워실이 조금 좁은 편입니다.',
    time: '1시간 전',
    isNegative: false,
  },
  {
    id: 4,
    userName: '최민지',
    gymName: '스파이더 클라임',
    rating: 1,
    content: '환기가 안 되어서 냄새가 심했습니다. 위생 관리가 필요해 보입니다.',
    time: '2시간 전',
    isNegative: true,
  },
  {
    id: 5,
    userName: '정수현',
    gymName: '락앤클라임',
    rating: 5,
    content: '가성비 최고! 월 정액권 가격도 합리적이고 시설도 좋아요.',
    time: '3시간 전',
    isNegative: false,
  },
];

const ratingTrendData = [
  { date: '12/29', rating: 4.2 },
  { date: '12/30', rating: 4.3 },
  { date: '12/31', rating: 4.1 },
  { date: '01/01', rating: 4.4 },
  { date: '01/02', rating: 4.5 },
  { date: '01/03', rating: 4.3 },
  { date: '01/04', rating: 4.6 },
];

const ratingDistribution = [
  { stars: 5, count: 245, percentage: 45 },
  { stars: 4, count: 156, percentage: 29 },
  { stars: 3, count: 78, percentage: 14 },
  { stars: 2, count: 42, percentage: 8 },
  { stars: 1, count: 21, percentage: 4 },
];

// Mock data for system notifications
const systemNotifications = [
  {
    id: 1,
    type: 'approval',
    title: '암장 승인 요청',
    description: '클라이밍 센터 판교점이 등록 승인을 요청했습니다.',
    time: '5분 전',
    priority: 'high',
    count: 3,
  },
  {
    id: 2,
    type: 'report',
    title: '부적절한 리뷰 신고',
    description: '더클라임 홍대점 리뷰에 대한 신고가 접수되었습니다.',
    time: '15분 전',
    priority: 'urgent',
  },
  {
    id: 3,
    type: 'maintenance',
    title: '시스템 점검 예정',
    description: '1월 10일 02:00-04:00 서버 점검이 예정되어 있습니다.',
    time: '1시간 전',
    priority: 'normal',
  },
  {
    id: 4,
    type: 'report',
    title: '부적절한 사진 신고',
    description: '볼더링 파크 게시물에 부적절한 사진이 신고되었습니다.',
    time: '2시간 전',
    priority: 'high',
  },
  {
    id: 5,
    type: 'approval',
    title: '암장 정보 수정 요청',
    description: '스파이더 클라임에서 영업시간 정보 수정을 요청했습니다.',
    time: '3시간 전',
    priority: 'normal',
  },
];

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
          sx={{ color: '#6b7280', fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 500 }}
        >
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e', mt: 0.5 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const CongestionChart = () => {
  const currentHour = new Date().getHours();
  const currentTimeLabel = `${String(currentHour).padStart(2, '0')}:00`;

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

const RecentActivity = () => {
  const [activeTab, setActiveTab] = useState(0);

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
  };

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

// Reviews & Feedback Component
const ReviewsFeedback = () => {
  const averageRating = 4.4;
  const totalReviews = 542;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} sx={{ fontSize: 14, color: '#f59e0b' }} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} sx={{ fontSize: 14, color: '#f59e0b' }} />);
      } else {
        stars.push(<StarBorder key={i} sx={{ fontSize: 14, color: '#e8eaed' }} />);
      }
    }
    return stars;
  };

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
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <RateReview sx={{ fontSize: 24, color: '#667eea' }} />
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e' }}>
                리뷰 및 피드백
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', fontSize: '13px' }}>
              최근 사용자 리뷰 현황
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '28px', color: '#1a1f2e' }}>
                {averageRating}
              </Typography>
              <Box>
                <Box sx={{ display: 'flex' }}>{renderStars(averageRating)}</Box>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#9ca3af' }}>
                  {totalReviews}개 리뷰
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Rating Distribution */}
        <Box sx={{ mb: 3 }}>
          {ratingDistribution.map((item) => (
            <Box key={item.stars} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 24 }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#6b7280' }}>{item.stars}</Typography>
                <Star sx={{ fontSize: 12, color: '#f59e0b' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: '#e8eaed',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background:
                        item.stars >= 4
                          ? 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)'
                          : item.stars === 3
                          ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                    },
                  }}
                />
              </Box>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#6b7280', width: 32, textAlign: 'right' }}>
                {item.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Rating Trend Sparkline */}
        <Box sx={{ mb: 3, p: 2, background: '#f8f9fa', borderRadius: '12px' }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 600, color: '#6b7280', mb: 1 }}>
            평균 평점 추이 (최근 7일)
          </Typography>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={ratingTrendData}>
              <Line type="monotone" dataKey="rating" stroke="#667eea" strokeWidth={2} dot={{ fill: '#667eea', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Recent Reviews */}
        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '14px', color: '#1a1f2e', mb: 2 }}>
          최근 리뷰
        </Typography>
        {recentReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                mb: 1.5,
                background: review.isNegative ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' : 'transparent',
                border: review.isNegative ? '1px solid #fecaca' : '1px solid #e8eaed',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s',
                '&:hover': { background: review.isNegative ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' : '#f8f9fa' },
              }}
            >
              {review.isNegative && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: '#ef4444',
                  }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: review.isNegative
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  {review.userName[0]}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '14px', color: '#1a1f2e' }}>
                        {review.userName}
                      </Typography>
                      {review.isNegative && (
                        <Chip
                          icon={<Warning sx={{ fontSize: 12 }} />}
                          label="주의"
                          size="small"
                          sx={{
                            height: '20px',
                            fontSize: '10px',
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 600,
                            background: '#ef444415',
                            color: '#ef4444',
                            border: '1px solid #ef444430',
                            '& .MuiChip-icon': { color: '#ef4444' },
                          }}
                        />
                      )}
                    </Box>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#9ca3af' }}>
                      {review.time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#6b7280' }}>
                      {review.gymName}
                    </Typography>
                    <Box sx={{ display: 'flex' }}>{renderStars(review.rating)}</Box>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '13px',
                      color: '#4b5563',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {review.content}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Paper>
  );
};

// System Notifications Component
const SystemNotifications = () => {
  const pendingApprovals = systemNotifications.filter((n) => n.type === 'approval').length;
  const pendingReports = systemNotifications.filter((n) => n.type === 'report').length;

  const getTypeConfig = (type) => {
    switch (type) {
      case 'approval':
        return { icon: VerifiedUser, color: '#667eea', label: '승인 요청' };
      case 'report':
        return { icon: Flag, color: '#ef4444', label: '신고' };
      case 'maintenance':
        return { icon: Build, color: '#f59e0b', label: '점검' };
      default:
        return { icon: Notifications, color: '#6b7280', label: '알림' };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'urgent':
        return { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: '긴급' };
      case 'high':
        return { color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', label: '주의' };
      default:
        return { color: '#667eea', bg: '#eef2ff', border: '#c7d2fe', label: '일반' };
    }
  };

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
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Badge badgeContent={systemNotifications.length} color="error" sx={{ '& .MuiBadge-badge': { fontFamily: '"DM Sans", sans-serif', fontWeight: 600 } }}>
                <Notifications sx={{ fontSize: 24, color: '#ff6b35' }} />
              </Badge>
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e' }}>
                시스템 알림
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', fontSize: '13px' }}>
              처리가 필요한 알림 및 공지
            </Typography>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                border: '1px solid #c7d2fe',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: '#667eea' }}>
                    승인 대기
                  </Typography>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '24px', fontWeight: 700, color: '#1a1f2e' }}>
                    {pendingApprovals}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#667eea20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <VerifiedUser sx={{ fontSize: 20, color: '#667eea' }} />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                border: '1px solid #fecaca',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: '#ef4444' }}>
                    신고 접수
                  </Typography>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '24px', fontWeight: 700, color: '#1a1f2e' }}>
                    {pendingReports}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flag sx={{ fontSize: 20, color: '#ef4444' }} />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Notifications List */}
        {systemNotifications.map((notification, index) => {
          const typeConfig = getTypeConfig(notification.type);
          const priorityConfig = getPriorityConfig(notification.priority);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  mb: 1.5,
                  background: `linear-gradient(135deg, ${priorityConfig.bg} 0%, ${priorityConfig.bg} 100%)`,
                  border: `1px solid ${priorityConfig.border}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: `0 4px 12px ${priorityConfig.color}20`,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: priorityConfig.color,
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      background: `${typeConfig.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <typeConfig.icon sx={{ fontSize: 20, color: typeConfig.color }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '14px', color: '#1a1f2e' }}>
                        {notification.title}
                      </Typography>
                      {notification.count && (
                        <Chip
                          label={`+${notification.count}`}
                          size="small"
                          sx={{
                            height: '18px',
                            fontSize: '10px',
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 700,
                            background: typeConfig.color,
                            color: '#ffffff',
                          }}
                        />
                      )}
                      {notification.priority === 'urgent' && (
                        <PriorityHigh sx={{ fontSize: 16, color: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '13px',
                        color: '#4b5563',
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {notification.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={typeConfig.label}
                          size="small"
                          sx={{
                            height: '18px',
                            fontSize: '10px',
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 600,
                            background: `${typeConfig.color}15`,
                            color: typeConfig.color,
                          }}
                        />
                        <Chip
                          label={priorityConfig.label}
                          size="small"
                          sx={{
                            height: '18px',
                            fontSize: '10px',
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 600,
                            background: `${priorityConfig.color}15`,
                            color: priorityConfig.color,
                          }}
                        />
                        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#9ca3af' }}>
                          {notification.time}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        sx={{
                          width: 28,
                          height: 28,
                          background: `${typeConfig.color}10`,
                          '&:hover': { background: `${typeConfig.color}20` },
                        }}
                      >
                        <ArrowForward sx={{ fontSize: 14, color: typeConfig.color }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </Paper>
  );
};

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
