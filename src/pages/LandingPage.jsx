import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Map as MapIcon,
  People as PeopleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Place as PlaceIcon,
  Forum as ForumIcon
} from '@mui/icons-material';
import { motion, useScroll, useTransform } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

const LandingPage = ({ onNavigateToMap, onNavigateToAuth, onNavigateToCommunity }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: MapIcon,
      title: '지도로 암장 찾기',
      description: '카카오 지도 기반으로 내 주변 암장을 실시간으로 확인하고 혼잡도까지 한눈에',
      color: '#FFD166',
      delay: 0.1
    },
    {
      icon: PeopleIcon,
      title: '클라이머 커뮤니티',
      description: '동료 클라이머들과 정보를 공유하고 함께 성장하는 커뮤니티',
      color: '#06FFA5',
      delay: 0.2
    },
    {
      icon: StarIcon,
      title: '암장 리뷰 & 정보',
      description: '실제 이용자들의 생생한 리뷰와 상세한 암장 정보를 한 곳에서',
      color: '#FF6B9D',
      delay: 0.3
    }
  ];

  const stats = [
    { value: '120+', label: '등록된 암장', icon: PlaceIcon },
    { value: '5,000+', label: '클라이머', icon: PeopleIcon },
    { value: '15,000+', label: '리뷰', icon: ForumIcon },
    { value: '92%', label: '만족도', icon: TrendingUpIcon }
  ];

  return (
    <Box sx={{
      bgcolor: '#1A1A2E',
      color: '#fff',
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: `
          radial-gradient(circle at 20% 30%, rgba(255, 209, 102, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(6, 255, 165, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255, 107, 157, 0.03) 0%, transparent 70%)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }
    }}>

      {/* 히어로 섹션 */}
      <MotionBox
        style={{ opacity: heroOpacity, scale: heroScale }}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          pt: { xs: 6, md: 8 },
          pb: { xs: 8, md: 12 },
          overflow: 'hidden'
        }}
      >
        {/* 애니메이션 배경 요소 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `
              linear-gradient(30deg, transparent 48%, currentColor 49%, currentColor 51%, transparent 52%),
              linear-gradient(150deg, transparent 48%, currentColor 49%, currentColor 51%, transparent 52%)
            `,
            backgroundSize: '60px 60px',
            color: '#FFD166',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />

        {/* 클라이밍 홀드 배경 - 화면 전체에 배치 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          {[
            // 좌측 상단
            { size: 130, color: '#FFD166', x: '15%', y: '20%', delay: 0.6, rotate: 15 },
            // 우측 상단
            { size: 100, color: '#06FFA5', x: '85%', y: '25%', delay: 0.7, rotate: -20 },
            // 중앙 좌측
            { size: 115, color: '#FF6B9D', x: '20%', y: '50%', delay: 0.8, rotate: 30 },
            // 중앙 우측
            { size: 95, color: '#FFD166', x: '88%', y: '55%', delay: 0.9, rotate: -15 },
            // 하단 중앙
            { size: 105, color: '#06FFA5', x: '50%', y: '75%', delay: 1.0, rotate: 10 },
            // 우측 중앙
            { size: 85, color: '#FF6B9D', x: '92%', y: '40%', delay: 1.1, rotate: 25 },
            // 좌측 하단
            { size: 90, color: '#FFD166', x: '12%', y: '80%', delay: 1.2, rotate: -10 },
            // 중앙 상단
            { size: 75, color: '#06FFA5', x: '55%', y: '15%', delay: 1.3, rotate: 5 }
          ].map((hold, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{ opacity: 0.8, scale: 1, rotate: hold.rotate }}
              transition={{
                delay: hold.delay,
                duration: 0.6,
                type: 'spring',
                stiffness: 200
              }}
              sx={{
                position: 'absolute',
                left: hold.x,
                top: hold.y,
                width: { xs: hold.size * 0.6, sm: hold.size * 0.75, md: hold.size },
                height: { xs: hold.size * 0.6, sm: hold.size * 0.75, md: hold.size },
                background: `linear-gradient(135deg, ${hold.color} 0%, ${hold.color}dd 100%)`,
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                boxShadow: `0 10px 40px ${hold.color}40`,
                transform: `translate(-50%, -50%)`,
                pointerEvents: 'auto',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: `translate(-50%, -50%) scale(1.1) rotate(${hold.rotate + 10}deg)`,
                  boxShadow: `0 15px 60px ${hold.color}60`,
                  opacity: 1
                },
                '&:active': {
                  transform: `translate(-50%, -50%) scale(0.95) rotate(${hold.rotate}deg)`,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '15%',
                  left: '15%',
                  width: '30%',
                  height: '30%',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  filter: 'blur(5px)'
                }
              }}
            />
          ))}
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, px: { xs: 3, sm: 3 } }}>
          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
            <Grid item xs={12} md={12}>
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {/* 눈길을 끄는 배지 */}
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  sx={{
                    display: 'inline-block',
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.8, sm: 1 },
                    mb: { xs: 2, sm: 3 },
                    background: 'linear-gradient(135deg, #FFD166 0%, #FF6B9D 100%)',
                    borderRadius: '30px',
                    fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
                    fontSize: { xs: '0.9rem', sm: '0.9rem' },
                    letterSpacing: { xs: '2px', sm: '2px' },
                    fontWeight: 'bold',
                    transform: 'rotate(-2deg)',
                    boxShadow: '0 4px 20px rgba(255, 209, 102, 0.4)'
                  }}
                >
                  SEOUL'S #1 CLIMBING COMMUNITY
                </MotionBox>

                <MotionTypography
                  variant="h1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  sx={{
                    fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
                    fontSize: { xs: '6.5rem', sm: '5rem', md: '6.5rem' },
                    fontWeight: 'bold',
                    lineHeight: 0.9,
                    mb: 2,
                    letterSpacing: { xs: '1px', sm: '2px' },
                    background: 'linear-gradient(135deg, #FFD166 0%, #06FFA5 50%, #FF6B9D 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 80px rgba(255, 209, 102, 0.3)',
                    position: 'relative',
                    '&::after': {
                      content: '"CLIMBING"',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: -1,
                      background: 'transparent',
                      WebkitTextStroke: { xs: '1px rgba(255, 209, 102, 0.2)', sm: '2px rgba(255, 209, 102, 0.2)' },
                      WebkitTextFillColor: 'transparent',
                      transform: { xs: 'translate(2px, 2px)', sm: 'translate(4px, 4px)' }
                    }
                  }}
                >
                  CLIMBING
                </MotionTypography>

                <MotionTypography
                  variant="h2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  sx={{
                    fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
                    fontSize: { xs: '4.5rem', sm: '3.5rem', md: '4.5rem' },
                    fontWeight: 'bold',
                    lineHeight: 1,
                    mb: { xs: 3, md: 4 },
                    letterSpacing: { xs: '4px', sm: '8px' },
                    color: '#fff',
                    textTransform: 'uppercase'
                  }}
                >
                  SEOUL
                </MotionTypography>

                <MotionTypography
                  variant="h5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.3rem' },
                    mb: { xs: 4, md: 5 },
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxWidth: '600px',
                    lineHeight: 1.6,
                    fontWeight: 300,
                    pr: { xs: 2, md: 0 }
                  }}
                >
                  서울의 모든 클라이밍 암장을 한눈에.
                  실시간 정보와 커뮤니티로 당신의 등반을 더 특별하게.
                </MotionTypography>

                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mt: { xs: 4, md: 6 },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onNavigateToMap}
                    sx={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: { xs: '1.2rem', sm: '1.3rem' },
                      letterSpacing: '2px',
                      px: { xs: 4, sm: 5 },
                      py: { xs: 1.8, sm: 2 },
                      background: 'linear-gradient(135deg, #FFD166 0%, #FF6B9D 100%)',
                      color: '#1A1A2E',
                      fontWeight: 'bold',
                      borderRadius: '50px',
                      boxShadow: '0 8px 30px rgba(255, 209, 102, 0.4)',
                      transition: 'all 0.3s ease',
                      width: { xs: '100%', sm: 'auto' },
                      minHeight: { xs: '56px', sm: 'auto' },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF6B9D 0%, #FFD166 100%)',
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 12px 40px rgba(255, 209, 102, 0.6)'
                      },
                      '&:active': {
                        transform: 'translateY(-1px) scale(1)',
                      }
                    }}
                  >
                    암장 찾기
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={onNavigateToAuth}
                    sx={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: { xs: '1.2rem', sm: '1.3rem' },
                      letterSpacing: '2px',
                      px: { xs: 4, sm: 5 },
                      py: { xs: 1.8, sm: 2 },
                      borderColor: '#06FFA5',
                      color: '#06FFA5',
                      fontWeight: 'bold',
                      borderRadius: '50px',
                      borderWidth: '2px',
                      transition: 'all 0.3s ease',
                      width: { xs: '100%', sm: 'auto' },
                      minHeight: { xs: '56px', sm: 'auto' },
                      '&:hover': {
                        borderWidth: '2px',
                        borderColor: '#06FFA5',
                        background: 'rgba(6, 255, 165, 0.1)',
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 8px 30px rgba(6, 255, 165, 0.3)'
                      },
                      '&:active': {
                        transform: 'translateY(-1px) scale(1)',
                      }
                    }}
                  >
                    시작하기
                  </Button>
                </MotionBox>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </MotionBox>

      {/* 기능 섹션 */}
      <Box sx={{ py: { xs: 10, md: 15 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 3 } }}>
          <MotionTypography
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variant="h2"
            align="center"
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.0rem' },
              mb: { xs: 6, md: 8 },
              letterSpacing: { xs: '2px', md: '4px' },
              color: '#fff'
            }}
          >
            왜 클라이밍 서울인가?
          </MotionTypography>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay, duration: 0.6 }}
                  whileHover={{
                    y: -15,
                    transition: { duration: 0.3 }
                  }}
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: { xs: '20px', md: '24px' },
                    p: { xs: 3, md: 4 },
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '5px',
                      background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}00 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: feature.color,
                      boxShadow: `0 20px 60px ${feature.color}30`
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 60, md: 70 },
                      height: { xs: 60, md: 70 },
                      borderRadius: { xs: '16px', md: '20px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${feature.color}30 0%, ${feature.color}10 100%)`,
                      mb: { xs: 2, md: 3 },
                      border: `2px solid ${feature.color}40`
                    }}
                  >
                    <feature.icon sx={{ fontSize: { xs: 30, md: 35 }, color: feature.color }} />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: { xs: '1.5rem', md: '1.8rem' },
                      mb: { xs: 1.5, md: 2 },
                      color: '#fff',
                      letterSpacing: '1px'
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.7
                    }}
                  >
                    {feature.description}
                  </Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 통계 섹션 */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 209, 102, 0.05) 50%, transparent 100%)'
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 3 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  sx={{ textAlign: 'center' }}
                >
                  <stat.icon
                    sx={{
                      fontSize: { xs: 40, md: 50 },
                      color: '#FFD166',
                      mb: { xs: 1.5, md: 2 },
                      opacity: 0.8
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                      color: '#06FFA5',
                      fontWeight: 'bold',
                      lineHeight: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: { xs: '0.85rem', md: '1rem' },
                      color: 'rgba(255, 255, 255, 0.7)',
                      mt: 1,
                      letterSpacing: '1px'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA 섹션 */}
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 3, sm: 3 } }}>
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            sx={{
              background: 'linear-gradient(135deg, rgba(255, 209, 102, 0.15) 0%, rgba(6, 255, 165, 0.15) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 209, 102, 0.3)',
              borderRadius: { xs: '24px', md: '32px' },
              p: { xs: 4, sm: 5, md: 8 },
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255, 209, 102, 0.1) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite'
              },
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' }
              }
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' },
                mb: { xs: 2, md: 3 },
                color: '#fff',
                letterSpacing: { xs: '2px', md: '3px' },
                position: 'relative',
                zIndex: 1
              }}
            >
              지금 바로 시작하세요
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                mb: { xs: 4, md: 5 },
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '500px',
                mx: 'auto',
                lineHeight: 1.7,
                position: 'relative',
                zIndex: 1
              }}
            >
              서울의 모든 암장 정보와 활발한 클라이머 커뮤니티가 기다립니다
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={onNavigateToAuth}
              sx={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                letterSpacing: '2px',
                px: { xs: 5, md: 6 },
                py: { xs: 2, md: 2.5 },
                background: 'linear-gradient(135deg, #FFD166 0%, #FF6B9D 100%)',
                color: '#1A1A2E',
                fontWeight: 'bold',
                borderRadius: '50px',
                boxShadow: '0 10px 40px rgba(255, 209, 102, 0.5)',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1,
                width: { xs: '100%', sm: 'auto' },
                minHeight: { xs: '56px', sm: 'auto' },
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF6B9D 0%, #FFD166 100%)',
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: '0 15px 50px rgba(255, 209, 102, 0.7)'
                },
                '&:active': {
                  transform: 'translateY(-2px) scale(1)',
                }
              }}
            >
              무료로 시작하기
            </Button>
          </MotionBox>
        </Container>
      </Box>

      {/* 푸터 */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          py: { xs: 5, md: 6 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 3 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: '1.8rem',
                  mb: 2,
                  background: 'linear-gradient(135deg, #FFD166 0%, #06FFA5 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '2px'
                }}
              >
                CLIMBING SEOUL
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.9rem'
                }}
              >
                서울의 모든 클라이밍을 한 곳에서
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                gap: 4
              }}>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: '1rem',
                      mb: 2,
                      color: '#FFD166',
                      letterSpacing: '1px'
                    }}
                  >
                    서비스
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { color: '#06FFA5' }
                    }}
                    onClick={onNavigateToMap}
                  >
                    암장 지도
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { color: '#06FFA5' }
                    }}
                    onClick={onNavigateToCommunity}
                  >
                    커뮤니티
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: '1rem',
                      mb: 2,
                      color: '#FFD166',
                      letterSpacing: '1px'
                    }}
                  >
                    정보
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { color: '#06FFA5' }
                    }}
                  >
                    이용약관
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      '&:hover': { color: '#06FFA5' }
                    }}
                  >
                    개인정보처리방침
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{
            textAlign: 'center',
            mt: { xs: 4, md: 6 },
            pt: { xs: 3, md: 4 },
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: { xs: '0.8rem', md: '0.85rem' }
              }}
            >
              © 2025 Climbing Seoul. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

LandingPage.propTypes = {
  onNavigateToMap: PropTypes.func.isRequired,
  onNavigateToAuth: PropTypes.func.isRequired,
  onNavigateToCommunity: PropTypes.func.isRequired
};

export default LandingPage;
