import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material'
import {
  ExpandMore,
  ChatBubbleOutline,
  EmailOutlined,
  PhoneOutlined,
  ContentCopy,
  HelpOutline,
  Person,
  PlayCircleOutline,
  Payment,
  MoreHoriz,
  CheckCircle,
  Schedule,
  ArrowBack
} from '@mui/icons-material'
import PropTypes from 'prop-types'

// FAQ Data
const faqData = {
  account: [
    {
      question: '회원가입은 어떻게 하나요?',
      answer: '구글 또는 카카오 계정으로 간편하게 가입할 수 있습니다. 로그인 페이지에서 원하는 소셜 로그인 버튼을 클릭해주세요.'
    },
    {
      question: '비밀번호를 잊어버렸어요',
      answer: '설정 > 계정 설정 > 비밀번호 변경에서 새로운 비밀번호를 설정할 수 있습니다.'
    }
  ],
  usage: [
    {
      question: '즐겨찾기는 어떻게 추가하나요?',
      answer: '암장 상세 페이지에서 하트 아이콘을 클릭하면 즐겨찾기에 추가됩니다. 프로필 페이지에서 즐겨찾는 암장 목록을 확인할 수 있습니다.'
    },
    {
      question: '방문 기록은 어떻게 확인하나요?',
      answer: '프로필 페이지 > 방문 기록 메뉴에서 나의 클라이밍 히스토리를 확인할 수 있습니다.'
    }
  ],
  payment: [
    {
      question: '유료 기능이 있나요?',
      answer: '현재는 모든 기능을 무료로 이용하실 수 있습니다. 향후 프리미엄 기능이 추가될 예정입니다.'
    }
  ],
  other: [
    {
      question: '오류를 발견했어요',
      answer: '1:1 문의 또는 이메일로 오류 내용을 상세히 알려주시면 빠르게 해결하겠습니다.'
    },
    {
      question: '새로운 기능을 제안하고 싶어요',
      answer: '언제든 환영합니다! 1:1 문의나 이메일로 의견을 보내주세요.'
    }
  ]
}

const categories = [
  { id: 'account', label: '계정', icon: Person, color: '#667eea' },
  { id: 'usage', label: '이용방법', icon: PlayCircleOutline, color: '#10b981' },
  { id: 'payment', label: '결제', icon: Payment, color: '#f59e0b' },
  { id: 'other', label: '기타', icon: MoreHoriz, color: '#8b5cf6' }
]

function CustomerSupportPage({ onNavigateToInquiry, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('account')
  const [expandedFaq, setExpandedFaq] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [copiedText, setCopiedText] = useState('')

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setSnackbarOpen(true)
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false)
  }

  // Check if currently open (9 AM - 6 PM)
  const now = new Date()
  const currentHour = now.getHours()
  const isOpen = currentHour >= 9 && currentHour < 18

  return (
    <Box sx={{ width: '393px', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header - Service oriented */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '3px solid #667eea',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)'
          }
        }}
      >
        <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
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
                width: 44,
                height: 44,
                borderRadius: 1,
                bgcolor: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HelpOutline sx={{ fontSize: 26, color: 'white' }} />
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
                고객센터
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 500,
                  fontSize: 13
                }}
              >
                무엇을 도와드릴까요?
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
          <Paper
            elevation={0}
            onClick={onNavigateToInquiry}
            sx={{
              flex: 1,
              p: 2,
              bgcolor: 'white',
              border: '2px solid #667eea',
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#667eea',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.25)',
                '& .icon': { color: 'white' },
                '& .text': { color: 'white' }
              }
            }}
          >
            <ChatBubbleOutline
              className="icon"
              sx={{
                fontSize: 28,
                color: '#667eea',
                mb: 1,
                transition: 'color 0.3s ease'
              }}
            />
            <Typography
              className="text"
              variant="body2"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                fontSize: 13,
                transition: 'color 0.3s ease'
              }}
            >
              1:1 문의
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            onClick={() => handleCopy('support@climbing.com', '이메일')}
            sx={{
              flex: 1,
              p: 2,
              bgcolor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#10b981',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(16, 185, 129, 0.15)'
              }
            }}
          >
            <EmailOutlined sx={{ fontSize: 28, color: '#10b981', mb: 1 }} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                fontSize: 13
              }}
            >
              이메일
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            onClick={() => handleCopy('1588-1234', '전화번호')}
            sx={{
              flex: 1,
              p: 2,
              bgcolor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#f59e0b',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(245, 158, 11, 0.15)'
              }
            }}
          >
            <PhoneOutlined sx={{ fontSize: 28, color: '#f59e0b', mb: 1 }} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                fontSize: 13
              }}
            >
              전화
            </Typography>
          </Paper>
        </Box>

        {/* Operating Hours */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule sx={{ fontSize: 20, color: '#6b7280' }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#1f2937',
                  fontSize: 13
                }}
              >
                운영 시간: 평일 09:00 - 18:00
              </Typography>
            </Box>
            <Chip
              icon={
                isOpen ? (
                  <CheckCircle sx={{ fontSize: 16 }} />
                ) : (
                  <Schedule sx={{ fontSize: 16 }} />
                )
              }
              label={isOpen ? '운영중' : '운영종료'}
              size="small"
              sx={{
                height: 24,
                fontSize: 11,
                fontWeight: 700,
                bgcolor: isOpen ? '#d1fae5' : '#fee2e2',
                color: isOpen ? '#065f46' : '#991b1b',
                border: 'none'
              }}
            />
          </Box>
        </Paper>

        {/* FAQ Section */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            color: '#1f2937',
            mb: 2,
            letterSpacing: '-0.01em'
          }}
        >
          자주 묻는 질문
        </Typography>

        {/* Category Tabs */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: 2,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 4
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#e5e7eb',
              borderRadius: 2
            }
          }}
        >
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id
            return (
              <Chip
                key={category.id}
                icon={<Icon sx={{ fontSize: 18 }} />}
                label={category.label}
                onClick={() => setSelectedCategory(category.id)}
                sx={{
                  height: 36,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  bgcolor: isSelected ? category.color : 'white',
                  color: isSelected ? 'white' : '#6b7280',
                  border: `2px solid ${isSelected ? category.color : '#e5e7eb'}`,
                  transition: 'all 0.3s ease',
                  '& .MuiChip-icon': {
                    color: isSelected ? 'white' : category.color
                  },
                  '&:hover': {
                    borderColor: category.color,
                    transform: 'translateY(-2px)'
                  }
                }}
              />
            )
          })}
        </Box>

        {/* FAQ Accordion */}
        <Box>
          {faqData[selectedCategory]?.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expandedFaq === `panel${index}`}
              onChange={handleAccordionChange(`panel${index}`)}
              elevation={0}
              sx={{
                mb: 1.5,
                border: '2px solid #e5e7eb',
                borderRadius: '4px !important',
                bgcolor: 'white',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  borderColor: categories.find(c => c.id === selectedCategory)?.color,
                  boxShadow: `0 4px 12px ${categories.find(c => c.id === selectedCategory)?.color}20`
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#667eea' }} />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    my: 1.5
                  }
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: '#1f2937',
                    fontSize: 14,
                    letterSpacing: '-0.01em'
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  pt: 0,
                  pb: 2,
                  px: 2,
                  borderTop: '1px solid #f3f4f6'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6b7280',
                    lineHeight: 1.7,
                    fontSize: 13
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Contact Info */}
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2.5,
            bgcolor: '#f8f9fa',
            border: '2px solid #e5e7eb',
            borderRadius: 1
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              color: '#1f2937',
              mb: 2,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            연락처
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                bgcolor: 'white',
                borderRadius: 1,
                border: '1px solid #e5e7eb'
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#9ca3af',
                    fontSize: 11,
                    fontWeight: 600,
                    display: 'block',
                    mb: 0.5
                  }}
                >
                  이메일
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1f2937',
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  support@climbing.com
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => handleCopy('support@climbing.com', '이메일')}
                sx={{
                  bgcolor: '#f3f4f6',
                  '&:hover': {
                    bgcolor: '#667eea',
                    color: 'white'
                  }
                }}
              >
                <ContentCopy sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                bgcolor: 'white',
                borderRadius: 1,
                border: '1px solid #e5e7eb'
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#9ca3af',
                    fontSize: 11,
                    fontWeight: 600,
                    display: 'block',
                    mb: 0.5
                  }}
                >
                  전화번호
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1f2937',
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  1588-1234
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => handleCopy('1588-1234', '전화번호')}
                sx={{
                  bgcolor: '#f3f4f6',
                  '&:hover': {
                    bgcolor: '#667eea',
                    color: 'white'
                  }
                }}
              >
                <ContentCopy sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar for copy feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{
            bgcolor: '#667eea',
            color: 'white',
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {copiedText} 복사 완료
        </Alert>
      </Snackbar>
    </Box>
  )
}

CustomerSupportPage.propTypes = {
  onNavigateToInquiry: PropTypes.func,
  onBack: PropTypes.func
}

export default CustomerSupportPage
