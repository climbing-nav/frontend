import { useState, useEffect, useRef } from 'react'
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  Paper,
  InputAdornment
} from '@mui/material'
import { 
  Email, 
  CheckCircle, 
  Error as ErrorIcon,
  Refresh
} from '@mui/icons-material'

function EmailVerification({ email, onVerificationSuccess, onResendCode }) {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  
  // 인증코드 입력 필드 refs
  const inputRefs = useRef([])
  
  useEffect(() => {
    // 컴포넌트 마운트 시 첫 번째 입력 필드에 포커스
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    // 재전송 타이머
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleCodeChange = (index, value) => {
    // 숫자만 허용
    if (!/^\d*$/.test(value)) return
    
    const newCode = [...verificationCode]
    newCode[index] = value.slice(-1) // 마지막 문자만 사용
    setVerificationCode(newCode)
    
    // 에러 상태 클리어
    if (error) setError('')
    
    // 다음 입력 필드로 포커스 이동
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // 백스페이스 처리
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // 엔터키로 인증 시도
    if (e.key === 'Enter' && verificationCode.every(digit => digit)) {
      handleVerification()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)
    
    const newCode = [...verificationCode]
    for (let i = 0; i < 6; i++) {
      newCode[i] = digits[i] || ''
    }
    setVerificationCode(newCode)
    
    // 붙여넣은 후 마지막 입력된 필드로 포커스
    const lastIndex = Math.min(digits.length, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  const handleVerification = async () => {
    const code = verificationCode.join('')
    
    if (code.length !== 6) {
      setError('6자리 인증코드를 모두 입력해주세요')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // TODO: API 연동 - 인증코드 확인
      // await verifyEmailCode({ email, code })
      
      // 임시: 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 성공 시뮬레이션 (실제로는 API 응답에 따라 처리)
      if (code === '123456') {
        setSuccess(true)
        setTimeout(() => {
          onVerificationSuccess()
        }, 2000)
      } else {
        setError('인증코드가 올바르지 않습니다. 다시 확인해주세요.')
      }
      
    } catch (error) {
      setError('인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    setError('')
    
    try {
      await onResendCode(email)
      setResendTimer(60) // 60초 재전송 대기
      setVerificationCode(['', '', '', '', '', '']) // 입력 코드 초기화
      inputRefs.current[0]?.focus()
    } catch (error) {
      setError('인증코드 재전송에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setResendLoading(false)
    }
  }

  if (success) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: '#f0f9f0',
          border: '1px solid #4caf50'
        }}
      >
        <CheckCircle sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          이메일 인증 완료!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          회원가입이 성공적으로 완료되었습니다.
        </Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Email sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          이메일 인증
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {email}로 전송된 6자리 인증코드를 입력해주세요
        </Typography>
        <Typography variant="caption" color="text.secondary">
          이메일이 도착하지 않았다면 스팸함을 확인해보세요
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          icon={<ErrorIcon />}
        >
          {error}
        </Alert>
      )}

      {/* Verification Code Input */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, justifyContent: 'center' }}>
        {verificationCode.map((digit, index) => (
          <TextField
            key={index}
            ref={(el) => inputRefs.current[index] = el}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 600,
                padding: 12
              }
            }}
            sx={{
              width: 48,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#f9fafb',
                '& fieldset': {
                  borderColor: digit ? '#667eea' : '#e5e7eb',
                  borderWidth: digit ? 2 : 1
                },
                '&:hover fieldset': {
                  borderColor: '#667eea'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                  borderWidth: 2
                }
              }
            }}
          />
        ))}
      </Box>

      {/* Verify Button */}
      <Button
        onClick={handleVerification}
        variant="contained"
        fullWidth
        disabled={loading || verificationCode.some(digit => !digit)}
        sx={{
          py: 1.5,
          mb: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 600,
          fontSize: 16,
          textTransform: 'none',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)'
          },
          '&:disabled': {
            background: '#d1d5db',
            boxShadow: 'none'
          }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : '인증하기'}
      </Button>

      {/* Resend Code */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          인증코드를 받지 못하셨나요?
        </Typography>
        <Button
          onClick={handleResendCode}
          disabled={resendLoading || resendTimer > 0}
          startIcon={resendLoading ? <CircularProgress size={16} /> : <Refresh />}
          sx={{
            color: '#667eea',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'rgba(102, 126, 234, 0.08)'
            }
          }}
        >
          {resendTimer > 0 
            ? `${resendTimer}초 후 재전송 가능` 
            : resendLoading 
              ? '전송 중...' 
              : '인증코드 재전송'
          }
        </Button>
      </Box>
    </Box>
  )
}

export default EmailVerification