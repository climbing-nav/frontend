import { Box, Typography } from '@mui/material'

function MapPage() {
  return (
    <Box sx={{ 
      p: 2.5,
      width: '393px',
    }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        지도 페이지
      </Typography>
      <Box sx={{
        height: 400,
        background: 'linear-gradient(45deg, #e3f2fd 0%, #f1f8e9 100%)',
        borderRadius: 1.5,
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body1" color="text.secondary">
          지도 컴포넌트가 여기에 표시됩니다
        </Typography>
      </Box>
    </Box>
  )
}

export default MapPage