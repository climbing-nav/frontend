import { Box, Typography, Chip, Paper } from '@mui/material'

const crowdednessConfig = {
  comfortable: { label: '쾌적', color: '#10b981' },
  moderate: { label: '보통', color: '#f59e0b' },
  crowded: { label: '혼잡', color: '#ef4444' }
}

function GymCard({ gym }) {
  const crowdedness = crowdednessConfig[gym.crowdedness]
  
  return (
    <Paper sx={{
      borderRadius: 1.5,
      p: 2,
      mb: 1.5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }
    }}>
      <Box sx={{
        width: 48,
        height: 48,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: 18
      }}>
        {gym.logo}
      </Box>
      
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" sx={{
          fontWeight: 600,
          color: '#1f2937',
          mb: 0.5
        }}>
          {gym.name}
        </Typography>
        <Typography variant="body2" sx={{
          color: '#6b7280',
          mb: 1
        }}>
          {gym.address}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          {gym.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                bgcolor: '#f3f4f6',
                color: '#6b7280',
                fontSize: 12,
                height: 24
              }}
            />
          ))}
        </Box>
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
        minWidth: 60
      }}>
        {crowdedness.label}
      </Box>
    </Paper>
  )
}

export default GymCard