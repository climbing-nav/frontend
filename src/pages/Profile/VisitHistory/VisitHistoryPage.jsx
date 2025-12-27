import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  IconButton
} from '@mui/material'
import {
  CalendarToday,
  LocationOn,
  AccessTime,
  EmojiEvents,
  TrendingUp,
  ArrowBack
} from '@mui/icons-material'
import PropTypes from 'prop-types'

// Mock data - grouped by month
const mockVisits = [
  {
    id: 1,
    date: '2024-01-15',
    gymName: '더클라임 강남',
    location: '서울 강남구 테헤란로',
    duration: '2시간 30분',
    time: '19:00'
  },
  {
    id: 2,
    date: '2024-01-12',
    gymName: '클라이밍파크 홍대',
    location: '서울 마포구 홍익로',
    duration: '3시간',
    time: '14:00'
  },
  {
    id: 3,
    date: '2024-01-08',
    gymName: '더클라임 강남',
    location: '서울 강남구 테헤란로',
    duration: '2시간',
    time: '18:30'
  },
  {
    id: 4,
    date: '2023-12-28',
    gymName: '볼더링 스튜디오 성수',
    location: '서울 성동구 성수이로',
    duration: '2시간 15분',
    time: '20:00'
  },
  {
    id: 5,
    date: '2023-12-24',
    gymName: '클라이밍파크 홍대',
    location: '서울 마포구 홍익로',
    duration: '3시간 30분',
    time: '10:00'
  }
]

const stats = {
  totalVisits: 147,
  totalGyms: 12,
  mostVisited: '더클라임 강남'
}

function VisitHistoryPage({ onNavigateToGym, onBack }) {
  const [visits] = useState(mockVisits)

  // Group visits by month
  const groupedVisits = visits.reduce((acc, visit) => {
    const date = new Date(visit.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(visit)
    return acc
  }, {})

  const formatMonthHeader = (monthKey) => {
    const [year, month] = monthKey.split('-')
    return `${year}년 ${parseInt(month)}월`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
    return { day, dayOfWeek }
  }

  const handleVisitClick = (visit) => {
    if (onNavigateToGym) {
      onNavigateToGym(visit)
    }
  }

  return (
    <Box sx={{ width: '393px', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header with milestone feel */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '2px solid #667eea',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 90% 10%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 10% 90%, rgba(102, 126, 234, 0.03) 0%, transparent 50%)
            `,
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <IconButton
              onClick={onBack}
              sx={{
                width: 36,
                height: 36,
                color: '#1f2937',
                '&:hover': { bgcolor: '#f3f4f6' }
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                bgcolor: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUp sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#1f2937',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                방문 기록
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 500
                }}
              >
                나의 클라이밍 여정
              </Typography>
            </Box>
          </Box>

          {/* Statistics Cards */}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 1.5,
                bgcolor: '#f8f9fa',
                border: '2px solid #e5e7eb',
                borderRadius: 1,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#667eea',
                  letterSpacing: '-0.03em',
                  lineHeight: 1
                }}
              >
                {stats.totalVisits}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                총 방문
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 1.5,
                bgcolor: '#f8f9fa',
                border: '2px solid #e5e7eb',
                borderRadius: 1,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#667eea',
                  letterSpacing: '-0.03em',
                  lineHeight: 1
                }}
              >
                {stats.totalGyms}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                방문 암장
              </Typography>
            </Paper>
          </Box>

          {/* Most Visited Badge */}
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: 'rgba(102, 126, 234, 0.08)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <EmojiEvents sx={{ fontSize: 20, color: '#667eea' }} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#6b7280',
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block'
                }}
              >
                최다 방문 암장
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#1f2937',
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                {stats.mostVisited}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Timeline */}
      <Box sx={{ position: 'relative' }}>
        {visits.length === 0 ? (
          // Empty State
          <Paper
            elevation={0}
            sx={{
              m: 3,
              mt: 6,
              p: 6,
              textAlign: 'center',
              bgcolor: 'white',
              border: '2px dashed #e5e7eb',
              borderRadius: 1
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                bgcolor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                border: '2px solid #e5e7eb'
              }}
            >
              <CalendarToday sx={{ fontSize: 36, color: '#9ca3af' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#1f2937',
                fontWeight: 700,
                mb: 1,
                letterSpacing: '-0.01em'
              }}
            >
              아직 방문 기록이 없습니다
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                lineHeight: 1.6
              }}
            >
              클라이밍을 시작하고
              <br />
              나만의 등반 일지를 만들어보세요
            </Typography>
          </Paper>
        ) : (
          Object.keys(groupedVisits).sort().reverse().map((monthKey, monthIndex) => (
            <Box key={monthKey}>
              {/* Month Header */}
              <Box
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  bgcolor: '#fafafa',
                  py: 2,
                  px: 3,
                  animation: `fadeIn 0.5s ease-out ${monthIndex * 0.1}s backwards`,
                  '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                  }
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    color: '#667eea',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  {formatMonthHeader(monthKey)}
                </Typography>
              </Box>

              {/* Timeline Entries */}
              <Box sx={{ px: 3, pb: 2, position: 'relative' }}>
                {/* Timeline Line (rope visual) */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: 42,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    bgcolor: '#e5e7eb',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: 1,
                      transform: 'translateX(-50%)',
                      background: 'repeating-linear-gradient(0deg, #667eea 0px, #667eea 8px, transparent 8px, transparent 16px)',
                      opacity: 0.3
                    }
                  }}
                />

                {groupedVisits[monthKey].map((visit, index) => {
                  const { day, dayOfWeek } = formatDate(visit.date)
                  return (
                    <Box
                      key={visit.id}
                      onClick={() => handleVisitClick(visit)}
                      sx={{
                        position: 'relative',
                        pl: 6,
                        mb: 3,
                        cursor: 'pointer',
                        animation: `slideInLeft 0.5s ease-out ${(monthIndex * 0.2) + (index * 0.1)}s backwards`,
                        '@keyframes slideInLeft': {
                          from: {
                            opacity: 0,
                            transform: 'translateX(-30px)'
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateX(0)'
                          }
                        }
                      }}
                    >
                      {/* Timeline Node */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 12,
                          top: 4,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: 'white',
                          border: '3px solid #667eea',
                          zIndex: 1,
                          transition: 'all 0.3s ease',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#667eea',
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          },
                          '&:hover::after': {
                            opacity: 1
                          }
                        }}
                      />

                      {/* Visit Card */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: 1,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            borderColor: '#667eea',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                            transform: 'translateX(4px)'
                          }
                        }}
                      >
                        {/* Date Badge */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Chip
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                <Typography
                                  component="span"
                                  sx={{
                                    fontSize: 16,
                                    fontWeight: 800,
                                    color: '#667eea'
                                  }}
                                >
                                  {day}
                                </Typography>
                                <Typography
                                  component="span"
                                  sx={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: '#6b7280'
                                  }}
                                >
                                  {dayOfWeek}
                                </Typography>
                              </Box>
                            }
                            size="small"
                            sx={{
                              height: 28,
                              bgcolor: '#f3f4f6',
                              border: '1px solid #e5e7eb',
                              '& .MuiChip-label': {
                                px: 1.5
                              }
                            }}
                          />
                          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime sx={{ fontSize: 14, color: '#9ca3af' }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#9ca3af',
                                fontSize: 12,
                                fontWeight: 600
                              }}
                            >
                              {visit.time}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Gym Info */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: '#1f2937',
                            mb: 0.5,
                            letterSpacing: '-0.01em'
                          }}
                        >
                          {visit.gymName}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mb: 1
                          }}
                        >
                          <LocationOn sx={{ fontSize: 14, color: '#9ca3af' }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#6b7280',
                              fontSize: 12
                            }}
                          >
                            {visit.location}
                          </Typography>
                        </Box>

                        {/* Duration */}
                        <Divider sx={{ my: 1 }} />
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#667eea',
                            fontWeight: 700,
                            fontSize: 12
                          }}
                        >
                          운동 시간: {visit.duration}
                        </Typography>
                      </Paper>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}

VisitHistoryPage.propTypes = {
  onNavigateToGym: PropTypes.func,
  onBack: PropTypes.func
}

export default VisitHistoryPage
