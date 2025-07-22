import { Fab } from '@mui/material'
import { Edit } from '@mui/icons-material'

function FloatingActionButton() {
  return (
    <Fab
      sx={{
        position: 'fixed',
        bottom: 110,
        right: 20,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        '&:hover': {
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          transform: 'scale(1.1)',
          boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)'
        },
        transition: 'all 0.3s',
        zIndex: 100
      }}
    >
      <Edit />
    </Fab>
  )
}

export default FloatingActionButton