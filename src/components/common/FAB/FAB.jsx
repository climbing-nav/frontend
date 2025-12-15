import { Fab } from '@mui/material'
import { Edit } from '@mui/icons-material'
import PropTypes from 'prop-types'

function FloatingActionButton({ onClick }) {
  return (
    <Fab
      onClick={onClick}
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
        zIndex: 100,
        '&:focus': {
          outline: 'none'
        },
        '&:focus-visible': {
          outline: '2px solid #667eea',
          outlineOffset: '2px'
        }
      }}
    >
      <Edit />
    </Fab>
  )
}

FloatingActionButton.propTypes = {
  onClick: PropTypes.func
}

export default FloatingActionButton