import { Box, Typography, keyframes } from '@mui/material'

// Climbing rope animation - three strands weaving
const ropeStrand = keyframes`
  0%, 100% {
    transform: translateY(0) scaleY(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-8px) scaleY(1.1);
    opacity: 1;
  }
`

// Carabiner rotation
const carabinerSpin = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(90deg) scale(1.05);
  }
  50% {
    transform: rotate(180deg) scale(1);
  }
  75% {
    transform: rotate(270deg) scale(1.05);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
`

// Pulse animation for the glow
const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
`

// Text shimmer
const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`

// Fade in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const BackofficeLoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 50%, #1a1f2e 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.01) 2px,
              rgba(255, 255, 255, 0.01) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.01) 2px,
              rgba(255, 255, 255, 0.01) 4px
            )
          `,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Ambient glow effect */}
      <Box
        sx={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 70%)',
          animation: `${pulseGlow} 3s ease-in-out infinite`,
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          animation: `${fadeIn} 0.6s ease-out`,
        }}
      >
        {/* Climbing-themed spinner: Carabiner with rope */}
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Rotating carabiner (simplified geometric shape) */}
          <Box
            sx={{
              position: 'absolute',
              width: 80,
              height: 80,
              border: '6px solid transparent',
              borderTopColor: '#ff6b35',
              borderRightColor: '#ff8f66',
              borderBottomColor: '#ff6b35',
              borderLeftColor: '#ff8f66',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animation: `${carabinerSpin} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 50,
                height: 50,
                border: '4px solid rgba(255, 107, 53, 0.2)',
                borderRadius: '50%',
              },
            }}
          />

          {/* Three rope strands */}
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                width: 4,
                height: 60,
                background: `linear-gradient(180deg,
                  rgba(255, 143, 102, 0.8) 0%,
                  rgba(255, 107, 53, 0.4) 100%)`,
                borderRadius: '2px',
                animation: `${ropeStrand} 1.5s ease-in-out infinite`,
                animationDelay: `${index * 0.15}s`,
                left: `${38 + index * 8}px`,
                top: '30px',
                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
              }}
            />
          ))}

          {/* Center dot */}
          <Box
            sx={{
              position: 'absolute',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
              boxShadow: '0 0 20px rgba(255, 107, 53, 0.6)',
            }}
          />
        </Box>

        {/* Loading text with gradient shimmer */}
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '380px',
          }}
        >
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, sans-serif',
              background: 'linear-gradient(90deg, #fff 0%, #ff8f66 50%, #fff 100%)',
              backgroundSize: '200% auto',
              color: 'transparent',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              animation: `${shimmer} 3s linear infinite`,
              letterSpacing: '-0.02em',
              lineHeight: 1.6,
              mb: 1,
            }}
          >
            암장지기들을 위한 관리자 페이지로
            <br />
            이동하고 있어요
          </Typography>

          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: '"DM Sans", sans-serif',
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Entering Admin Portal
          </Typography>
        </Box>

        {/* Progress bar */}
        <Box
          sx={{
            width: 280,
            height: 3,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '40%',
              background: 'linear-gradient(90deg, transparent 0%, #ff6b35 50%, #ff8f66 100%)',
              borderRadius: '2px',
              animation: 'slideProgress 1.5s ease-in-out infinite',
              '@keyframes slideProgress': {
                '0%': {
                  transform: 'translateX(-100%)',
                },
                '100%': {
                  transform: 'translateX(350%)',
                },
              },
            },
          }}
        />

        {/* Decorative elements - climbing holds scattered pattern */}
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${8 + i * 2}px`,
              height: `${8 + i * 2}px`,
              borderRadius: '30%',
              background: `rgba(255, ${107 + i * 10}, 53, ${0.1 - i * 0.015})`,
              top: `${20 + i * 15}%`,
              left: `${10 + i * 18}%`,
              transform: `rotate(${i * 30}deg)`,
              opacity: 0.6,
              animation: `${pulseGlow} ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default BackofficeLoadingScreen
