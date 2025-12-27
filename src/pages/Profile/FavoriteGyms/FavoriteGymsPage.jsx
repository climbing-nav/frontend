import { useState } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Paper
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Straighten,
  ArrowBack
} from '@mui/icons-material'
import PropTypes from 'prop-types'

// Mock data - replace with actual API data
const mockGyms = [
  {
    id: 1,
    name: '더클라임 강남',
    location: '서울 강남구 테헤란로',
    distance: '1.2km',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80',
    difficulty: 'V3-V8'
  },
  {
    id: 2,
    name: '클라이밍파크 홍대',
    location: '서울 마포구 홍익로',
    distance: '3.5km',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80',
    difficulty: 'V2-V7'
  },
  {
    id: 3,
    name: '볼더링 스튜디오 성수',
    location: '서울 성동구 성수이로',
    distance: '2.1km',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    difficulty: 'V4-V9'
  }
]

function FavoriteGymsPage({ onNavigateToGym, onBack }) {
  const [favorites, setFavorites] = useState(mockGyms)
  const [removingId, setRemovingId] = useState(null)

  const handleToggleFavorite = (gymId) => {
    setRemovingId(gymId)
    setTimeout(() => {
      setFavorites(prev => prev.filter(gym => gym.id !== gymId))
      setRemovingId(null)
    }, 300)
  }

  const handleGymClick = (gym) => {
    if (onNavigateToGym) {
      onNavigateToGym(gym)
    }
  }

  return (
    <Box sx={{ width: '393px', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header with rope texture accent */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'white',
          borderBottom: '3px solid #667eea',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '100%',
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 4px,
                rgba(102, 126, 234, 0.03) 4px,
                rgba(102, 126, 234, 0.03) 8px
              )
            `,
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
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
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                letterSpacing: '-0.02em'
              }}
            >
              즐겨찾는 암장
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<Favorite sx={{ fontSize: 16, color: '#667eea' }} />}
              label={`${favorites.length}개 암장`}
              size="small"
              sx={{
                bgcolor: '#f3f4f6',
                color: '#6b7280',
                fontWeight: 600,
                fontSize: 13,
                height: 28,
                '& .MuiChip-icon': {
                  ml: 1
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Gym List */}
      <Box sx={{ p: 2 }}>
        {favorites.length === 0 ? (
          // Empty State
          <Paper
            elevation={0}
            sx={{
              mt: 8,
              p: 5,
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
                borderRadius: '50%',
                bgcolor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <FavoriteBorder sx={{ fontSize: 36, color: '#9ca3af' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#1f2937',
                fontWeight: 600,
                mb: 1
              }}
            >
              즐겨찾는 암장이 없습니다
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                lineHeight: 1.6
              }}
            >
              자주 가는 암장을 즐겨찾기에 추가하고
              <br />
              빠르게 찾아보세요
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {favorites.map((gym, index) => (
              <Paper
                key={gym.id}
                elevation={0}
                onClick={() => handleGymClick(gym)}
                sx={{
                  overflow: 'hidden',
                  bgcolor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: removingId === gym.id ? 0 : 1,
                  transform: removingId === gym.id ? 'translateX(-20px)' : 'translateX(0)',
                  animation: `slideIn 0.4s ease-out ${index * 0.1}s backwards`,
                  '@keyframes slideIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(20px)'
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  },
                  '&:hover': {
                    borderColor: '#667eea',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                    transform: 'translateY(-2px)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', height: 120 }}>
                  {/* Image Section */}
                  <Box
                    sx={{
                      width: 120,
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      bgcolor: '#f3f4f6'
                    }}
                  >
                    <Box
                      component="img"
                      src={gym.image}
                      alt={gym.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                    {/* Gradient overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                        pointerEvents: 'none'
                      }}
                    />
                    {/* Difficulty badge */}
                    <Chip
                      label={gym.difficulty}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        height: 22,
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        color: '#667eea',
                        backdropFilter: 'blur(4px)',
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  </Box>

                  {/* Content Section */}
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    {/* Favorite Button */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleFavorite(gym.id)
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 36,
                        height: 36,
                        bgcolor: '#fef2f2',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#fee2e2',
                          transform: 'scale(1.1)'
                        },
                        '&:active': {
                          transform: 'scale(0.95)'
                        }
                      }}
                    >
                      <Favorite
                        sx={{
                          fontSize: 20,
                          color: '#ef4444',
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': {
                              transform: 'scale(1)'
                            },
                            '50%': {
                              transform: 'scale(1.05)'
                            }
                          }
                        }}
                      />
                    </IconButton>

                    {/* Gym Info */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: '#1f2937',
                          mb: 0.5,
                          pr: 5,
                          lineHeight: 1.3,
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {gym.name}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: '#6b7280',
                          mb: 0.5
                        }}
                      >
                        <LocationOn sx={{ fontSize: 16 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: 13,
                            lineHeight: 1.4
                          }}
                        >
                          {gym.location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Distance */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Straighten
                        sx={{
                          fontSize: 16,
                          color: '#667eea',
                          transform: 'rotate(-45deg)'
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#667eea',
                          fontWeight: 700,
                          fontSize: 13
                        }}
                      >
                        {gym.distance}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

FavoriteGymsPage.propTypes = {
  onNavigateToGym: PropTypes.func,
  onBack: PropTypes.func
}

export default FavoriteGymsPage
