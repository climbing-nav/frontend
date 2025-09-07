import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * CongestionBadge Component
 * Visual congestion status indicator with color coding and animations
 * 
 * @param {Object} props
 * @param {string} props.congestion - Congestion level ('comfortable', 'normal', 'crowded')
 * @param {string} props.size - Badge size ('small', 'medium', 'large')
 * @param {string} props.variant - Display variant ('badge', 'chip', 'dot')
 * @param {boolean} props.animated - Whether to show pulse animation
 * @param {boolean} props.showLabel - Whether to show text label
 * @param {Object} props.sx - Additional MUI styling
 * @param {Function} props.onClick - Click handler
 */
function CongestionBadge({
  congestion = 'comfortable',
  size = 'medium',
  variant = 'badge',
  animated = false,
  showLabel = true,
  sx = {},
  onClick = null
}) {
  // Congestion configuration
  const congestionConfig = useMemo(() => ({
    comfortable: {
      label: '쾌적',
      color: '#10b981',
      backgroundColor: '#d1fae5',
      icon: '😊',
      description: '여유로운 상태'
    },
    normal: {
      label: '보통',
      color: '#f59e0b',
      backgroundColor: '#fef3c7',
      icon: '😐',
      description: '적당한 이용객'
    },
    crowded: {
      label: '혼잡',
      color: '#ef4444',
      backgroundColor: '#fee2e2',
      icon: '😰',
      description: '많은 이용객'
    }
  }), [])

  // Get current congestion data
  const currentCongestion = congestionConfig[congestion] || congestionConfig.comfortable

  // Size configurations
  const sizeConfig = useMemo(() => ({
    small: {
      padding: '4px 8px',
      fontSize: '11px',
      minWidth: '50px',
      height: '20px',
      iconSize: '12px',
      borderRadius: '10px'
    },
    medium: {
      padding: '6px 12px',
      fontSize: '12px',
      minWidth: '60px',
      height: '24px',
      iconSize: '14px',
      borderRadius: '12px'
    },
    large: {
      padding: '8px 16px',
      fontSize: '14px',
      minWidth: '80px',
      height: '32px',
      iconSize: '16px',
      borderRadius: '16px'
    }
  }), [])

  const currentSize = sizeConfig[size] || sizeConfig.medium

  // Animation variants
  const animationVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  // Render badge variant
  const renderBadge = () => (
    <Box
      component={motion.div}
      variants={animationVariants}
      animate={animated ? 'pulse' : ''}
      whileHover={onClick ? 'hover' : ''}
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: showLabel ? 0.5 : 0,
        backgroundColor: currentCongestion.backgroundColor,
        color: currentCongestion.color,
        padding: currentSize.padding,
        borderRadius: currentSize.borderRadius,
        fontSize: currentSize.fontSize,
        fontWeight: 600,
        minWidth: currentSize.minWidth,
        height: currentSize.height,
        border: `1px solid ${currentCongestion.color}20`,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        '&:hover': onClick ? {
          backgroundColor: currentCongestion.color + '10',
          borderColor: currentCongestion.color + '40'
        } : {},
        ...sx
      }}
      role={onClick ? 'button' : 'status'}
      aria-label={`혼잡도: ${currentCongestion.label} - ${currentCongestion.description}`}
      tabIndex={onClick ? 0 : -1}
    >
      {!showLabel && (
        <Typography
          component="span"
          sx={{
            fontSize: currentSize.iconSize,
            lineHeight: 1
          }}
        >
          {currentCongestion.icon}
        </Typography>
      )}
      {showLabel && (
        <Typography
          component="span"
          sx={{
            fontSize: currentSize.fontSize,
            fontWeight: 600,
            lineHeight: 1
          }}
        >
          {currentCongestion.label}
        </Typography>
      )}
    </Box>
  )

  // Render chip variant
  const renderChip = () => (
    <Box
      component={motion.div}
      variants={animationVariants}
      animate={animated ? 'pulse' : ''}
      whileHover={onClick ? 'hover' : ''}
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: currentCongestion.color,
        color: 'white',
        padding: currentSize.padding,
        borderRadius: currentSize.borderRadius,
        fontSize: currentSize.fontSize,
        fontWeight: 600,
        minWidth: currentSize.minWidth,
        height: currentSize.height,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        '&:hover': onClick ? {
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          transform: 'translateY(-1px)'
        } : {},
        ...sx
      }}
      role={onClick ? 'button' : 'status'}
      aria-label={`혼잡도: ${currentCongestion.label} - ${currentCongestion.description}`}
      tabIndex={onClick ? 0 : -1}
    >
      <Typography
        component="span"
        sx={{
          fontSize: currentSize.fontSize,
          fontWeight: 600,
          lineHeight: 1,
          color: 'inherit'
        }}
      >
        {currentCongestion.label}
      </Typography>
    </Box>
  )

  // Render dot variant
  const renderDot = () => (
    <Box
      component={motion.div}
      variants={animationVariants}
      animate={animated ? 'pulse' : ''}
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: currentSize.height,
        height: currentSize.height,
        backgroundColor: currentCongestion.color,
        borderRadius: '50%',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
        '&:hover': onClick ? {
          transform: 'scale(1.1)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
        } : {},
        ...sx
      }}
      role={onClick ? 'button' : 'status'}
      aria-label={`혼잡도: ${currentCongestion.label} - ${currentCongestion.description}`}
      tabIndex={onClick ? 0 : -1}
    >
      {animated && (
        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: currentCongestion.color,
            borderRadius: '50%',
            opacity: 0.3
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </Box>
  )

  // Render based on variant
  const renderVariant = () => {
    switch (variant) {
      case 'chip':
        return renderChip()
      case 'dot':
        return renderDot()
      case 'badge':
      default:
        return renderBadge()
    }
  }

  return renderVariant()
}

CongestionBadge.propTypes = {
  congestion: PropTypes.oneOf(['comfortable', 'normal', 'crowded']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['badge', 'chip', 'dot']),
  animated: PropTypes.bool,
  showLabel: PropTypes.bool,
  sx: PropTypes.object,
  onClick: PropTypes.func
}

export default CongestionBadge