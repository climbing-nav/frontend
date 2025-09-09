import { Box, Typography, Chip, Paper, Rating, Skeleton } from '@mui/material'
import { LocationOn, Star } from '@mui/icons-material'

const crowdednessConfig = {
  comfortable: { label: '쾌적', color: '#10b981' },
  moderate: { label: '보통', color: '#f59e0b' },
  crowded: { label: '혼잡', color: '#ef4444' }
}

function GymCard({ gym, onClick, loading = false }) {
  if (loading) {
    return (
      <Paper sx={{
        borderRadius: 1.5,
        p: 2,
        mb: 1.5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}>
        <Skeleton variant="rounded" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={50} height={24} />
          </Box>
        </Box>
        <Skeleton variant="rounded" width={60} height={32} />
      </Paper>
    )
  }

  const crowdedness = crowdednessConfig[gym.crowdedness] || crowdednessConfig.comfortable
  
  const handleClick = () => {
    if (onClick) {
      onClick(gym)
    }
  }
  
  return (
    <Paper 
      sx={{
        borderRadius: 1.5,
        p: 2,
        mb: 1.5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          transform: 'translateY(-1px)'
        } : {}
      }}
      onClick={handleClick}
    >
      <Box sx={{
        width: 48,
        height: 48,
        background: gym.image ? `url(${gym.image})` : 'linear-gradient(135deg, #667eea, #764ba2)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: 18
      }}>
        {!gym.image && (gym.logo || gym.name?.charAt(0))}
      </Box>
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="body1" sx={{
            fontWeight: 600,
            color: '#1f2937',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}>
            {gym.name}
          </Typography>
          {gym.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <Star sx={{ fontSize: 16, color: '#fbbf24' }} />
              <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                {gym.rating.toFixed(1)}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <LocationOn sx={{ fontSize: 14, color: '#6b7280' }} />
          <Typography variant="body2" sx={{
            color: '#6b7280',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}>
            {gym.address}
          </Typography>
          {gym.distance && (
            <Typography variant="caption" sx={{ 
              color: '#6b7280',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              {gym.distance < 1 
                ? `${Math.round(gym.distance * 1000)}m` 
                : `${gym.distance.toFixed(1)}km`
              }
            </Typography>
          )}
        </Box>
        
        {gym.tags && gym.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {gym.tags.slice(0, 2).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  bgcolor: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: 11,
                  height: 22,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            ))}
            {gym.tags.length > 2 && (
              <Typography variant="caption" sx={{ color: '#9ca3af', alignSelf: 'center' }}>
                +{gym.tags.length - 2}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      
      <Box sx={{
        bgcolor: crowdedness.color,
        color: 'white',
        px: 1.5,
        py: 1,
        borderRadius: 2.5,
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        minWidth: 60,
        flexShrink: 0
      }}>
        {crowdedness.label}
      </Box>
    </Paper>
  )
}

export default GymCard