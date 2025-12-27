import { Box, Typography, Paper, Chip, IconButton } from '@mui/material'
import {
  Description,
  Security,
  LocationOn,
  Forum,
  Code,
  ChevronRight,
  Update,
  ArrowBack
} from '@mui/icons-material'
import PropTypes from 'prop-types'

const policies = [
  {
    id: 'terms',
    number: '01',
    title: '이용약관',
    subtitle: 'Terms of Service',
    description: '서비스 이용에 관한 기본 약관 및 사용자 권리와 의무사항',
    lastUpdated: '2024.01.15',
    icon: Description,
    color: '#667eea'
  },
  {
    id: 'privacy',
    number: '02',
    title: '개인정보 처리방침',
    subtitle: 'Privacy Policy',
    description: '개인정보 수집, 이용, 보관 및 파기에 관한 정책',
    lastUpdated: '2024.01.10',
    icon: Security,
    color: '#10b981'
  },
  {
    id: 'location',
    number: '03',
    title: '위치기반 서비스 이용약관',
    subtitle: 'Location Services Terms',
    description: '위치정보 수집 및 이용에 관한 약관',
    lastUpdated: '2024.01.05',
    icon: LocationOn,
    color: '#f59e0b'
  },
  {
    id: 'community',
    number: '04',
    title: '커뮤니티 가이드라인',
    subtitle: 'Community Guidelines',
    description: '커뮤니티 운영 원칙 및 게시물 작성 규칙',
    lastUpdated: '2024.01.01',
    icon: Forum,
    color: '#ec4899'
  },
  {
    id: 'opensource',
    number: '05',
    title: '오픈소스 라이선스',
    subtitle: 'Open Source Licenses',
    description: '앱에 사용된 오픈소스 라이브러리 및 라이선스 정보',
    lastUpdated: '2024.01.15',
    icon: Code,
    color: '#8b5cf6'
  }
]

function TermsAndPoliciesPage({ onNavigateToPolicy, onBack }) {
  const handlePolicyClick = (policy) => {
    if (onNavigateToPolicy) {
      onNavigateToPolicy(policy)
    }
  }

  return (
    <Box sx={{ width: '393px', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header - Legal document style */}
      <Box
        sx={{
          bgcolor: '#1f2937',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '4px solid #667eea',
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
                rgba(255,255,255,0.02) 2px,
                rgba(255,255,255,0.02) 4px
              )
            `,
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          {/* Back button and Legal label */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                bgcolor: 'rgba(102, 126, 234, 0.2)',
                border: '1px solid rgba(102, 126, 234, 0.5)'
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#667eea'
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace'
                }}
              >
                LEGAL DOCUMENTS
              </Typography>
            </Box>
            <IconButton
              onClick={onBack}
              sx={{
                width: 36,
                height: 36,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              mb: 0.5
            }}
          >
            약관 및 정책
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            Terms & Policies
          </Typography>
        </Box>
      </Box>

      {/* Policy List */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {policies.map((policy, index) => {
            const Icon = policy.icon
            return (
              <Paper
                key={policy.id}
                elevation={0}
                onClick={() => handlePolicyClick(policy)}
                sx={{
                  bgcolor: 'white',
                  border: '2px solid #e5e7eb',
                  borderLeft: `6px solid ${policy.color}`,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  animation: `slideInRight 0.5s ease-out ${index * 0.1}s backwards`,
                  '@keyframes slideInRight': {
                    from: {
                      opacity: 0,
                      transform: 'translateX(30px)'
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateX(0)'
                    }
                  },
                  '&:hover': {
                    borderColor: policy.color,
                    boxShadow: `0 8px 24px ${policy.color}30`,
                    transform: 'translateX(4px)',
                    '& .chevron': {
                      transform: 'translateX(4px)'
                    },
                    '& .number': {
                      bgcolor: policy.color,
                      color: 'white'
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    background: `radial-gradient(circle, ${policy.color}10 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }
                }}
              >
                <Box sx={{ p: 2.5, position: 'relative' }}>
                  {/* Header with number and icon */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 1.5
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {/* Document Number */}
                      <Box
                        className="number"
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: '#f3f4f6',
                          border: `2px solid ${policy.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 900,
                            fontSize: 16,
                            fontFamily: 'monospace',
                            color: policy.color,
                            lineHeight: 1
                          }}
                        >
                          {policy.number}
                        </Typography>
                      </Box>

                      {/* Icon */}
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: `${policy.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon sx={{ fontSize: 22, color: policy.color }} />
                      </Box>
                    </Box>

                    {/* Chevron */}
                    <ChevronRight
                      className="chevron"
                      sx={{
                        fontSize: 24,
                        color: '#9ca3af',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: '#1f2937',
                      mb: 0.5,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.3
                    }}
                  >
                    {policy.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#9ca3af',
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'block',
                      mb: 1.5
                    }}
                  >
                    {policy.subtitle}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6b7280',
                      lineHeight: 1.6,
                      fontSize: 13,
                      mb: 2
                    }}
                  >
                    {policy.description}
                  </Typography>

                  {/* Last Updated Badge */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Update sx={{ fontSize: 14, color: '#9ca3af' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#9ca3af',
                        fontSize: 11,
                        fontWeight: 600
                      }}
                    >
                      최종 업데이트:
                    </Typography>
                    <Chip
                      label={policy.lastUpdated}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        bgcolor: '#f3f4f6',
                        color: '#6b7280',
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            )
          })}
        </Box>

        {/* Footer Notice */}
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2.5,
            bgcolor: '#f8f9fa',
            border: '2px solid #e5e7eb',
            borderRadius: 1,
            borderTop: '3px solid #667eea'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#6b7280',
              fontSize: 11,
              lineHeight: 1.7,
              display: 'block',
              mb: 1
            }}
          >
            본 약관은 대한민국 법률에 따라 규율되며, 약관의 해석 및 적용에 관하여는
            대한민국 법을 우선 적용합니다.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pt: 1.5,
              borderTop: '1px solid #e5e7eb'
            }}
          >
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: '#667eea'
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: '#9ca3af',
                fontSize: 10,
                fontWeight: 600,
                fontFamily: 'monospace',
                letterSpacing: '0.05em'
              }}
            >
              CLIMBING APP © 2024
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

TermsAndPoliciesPage.propTypes = {
  onNavigateToPolicy: PropTypes.func,
  onBack: PropTypes.func
}

export default TermsAndPoliciesPage
