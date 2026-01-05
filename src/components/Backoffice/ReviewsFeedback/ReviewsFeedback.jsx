import { Box, Paper, Typography, Avatar, Chip, LinearProgress } from '@mui/material';
import { RateReview, Star, StarBorder, StarHalf, Warning } from '@mui/icons-material';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { recentReviews, ratingTrendData, ratingDistribution } from '../../../data/dashboardMockData';

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
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={ratingTrendData}>
                <Line type="monotone" dataKey="rating" stroke="#667eea" strokeWidth={2} dot={{ fill: '#667eea', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
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

export default ReviewsFeedback;
