import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
  IconButton
} from '@mui/material'
import { Close } from '@mui/icons-material'

const TERMS_CONTENT = `
# 클라이밍 네비게이터 이용약관

## 제1조 (목적)
본 약관은 클라이밍 네비게이터(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리와 의무, 책임사항을 규정함을 목적으로 합니다.

## 제2조 (정의)
1. "서비스"란 클라이밍장 정보 제공 및 커뮤니티 서비스를 의미합니다.
2. "이용자"란 본 약관에 따라 서비스를 이용하는 회원을 의미합니다.
3. "회원"이란 서비스에 개인정보를 제공하여 회원등록을 한 자를 의미합니다.

## 제3조 (서비스 내용)
1. 클라이밍장 위치 및 정보 제공
2. 클라이밍장 혼잡도 및 이용 현황 제공
3. 클라이밍 커뮤니티 게시판 서비스
4. 클라이밍장 리뷰 및 평점 서비스
5. 기타 클라이밍 관련 정보 서비스

## 제4조 (회원가입)
1. 이용자는 서비스가 정한 양식에 따라 회원정보를 기입하고 본 약관에 동의함으로써 회원가입을 신청합니다.
2. 서비스는 다음 각 호에 해당하지 않는 한 회원가입을 승낙합니다.
   - 가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우
   - 등록 내용에 허위, 기재누락, 오기가 있는 경우
   - 기타 회원으로 등록하는 것이 서비스의 기술상 현저히 지장이 있다고 판단되는 경우

## 제5조 (회원정보의 변경)
회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.

## 제6조 (서비스 이용)
1. 회원은 서비스를 이용하여 클라이밍장 정보를 조회하고 커뮤니티에 참여할 수 있습니다.
2. 회원은 다음 행위를 하여서는 안 됩니다.
   - 다른 회원의 개인정보 수집, 저장, 공개 행위
   - 허위 내용의 게시 또는 타인의 명예를 훼손하는 내용의 게시
   - 서비스의 안전성을 위협하는 행위
   - 기타 관련 법령에 위반되는 행위

## 제7조 (서비스의 중단)
서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.

## 제8조 (면책조항)
1. 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
2. 서비스는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.

## 부칙
본 약관은 2025년 1월 1일부터 시행됩니다.
`

const PRIVACY_CONTENT = `
# 개인정보처리방침

## 수집하는 개인정보 항목

### 필수항목
- 이메일 주소
- 닉네임
- 비밀번호 (암호화 저장)
- 클라이밍 레벨

### 선택항목
- 프로필 사진
- 선호 클라이밍장
- 위치 정보 (서비스 이용 시)

## 개인정보 수집 및 이용목적

### 회원관리
- 회원제 서비스 이용에 따른 본인확인
- 개인 식별
- 불량회원의 부정 이용 방지와 비인가 사용 방지
- 가입 의사 확인
- 만14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부 확인

### 서비스 제공
- 클라이밍장 정보 맞춤 제공
- 위치 기반 서비스 제공
- 커뮤니티 서비스 제공
- 고객 상담 및 불만 처리

### 마케팅 및 광고 활용
- 신규 서비스 개발 및 맞춤 서비스 제공
- 이벤트 및 광고성 정보 제공 및 참여기회 제공

## 개인정보의 보유 및 이용기간

회원의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 다음 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.

### 회원탈퇴 시 보존정보
- 보존항목: 이메일, 닉네임, 탈퇴일시
- 보존근거: 서비스 부정이용 방지
- 보존기간: 1년

### 관련법령에 의한 정보보유 사유
- 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래등에서의 소비자보호에 관한 법률)
- 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래등에서의 소비자보호에 관한 법률)
- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래등에서의 소비자보호에 관한 법률)

## 개인정보의 파기

회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.

### 파기절차
이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.

### 파기방법
- 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
- 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.

## 개인정보의 제3자 제공

회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.

- 이용자들이 사전에 동의한 경우
- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

## 이용자의 권리

### 개인정보 열람권
이용자는 언제든지 등록되어 있는 자신의 개인정보를 열람하거나 수정할 수 있습니다.

### 개인정보 삭제권
이용자는 언제든지 회원탈퇴를 통해 개인정보 삭제를 요청할 수 있습니다.

## 개인정보보호 책임자

클라이밍 네비게이터는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호 책임자를 지정하고 있습니다.

**개인정보보호 책임자**
- 이름: 개인정보보호팀
- 이메일: privacy@climbing-nav.com

## 부칙
본 방침은 2025년 1월 1일부터 시행됩니다.
`

function TermsModal({ open, onClose, onAccept, defaultTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleAccept = () => {
    if (onAccept) {
      onAccept()
    }
    onClose()
  }

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <Typography key={index} variant="h5" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
            {line.substring(2)}
          </Typography>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <Typography key={index} variant="h6" sx={{ fontWeight: 500, mb: 1.5, mt: 2.5 }}>
            {line.substring(3)}
          </Typography>
        )
      }
      if (line.startsWith('### ')) {
        return (
          <Typography key={index} variant="subtitle1" sx={{ fontWeight: 500, mb: 1, mt: 2 }}>
            {line.substring(4)}
          </Typography>
        )
      }
      if (line.startsWith('- ')) {
        return (
          <Typography key={index} variant="body2" sx={{ mb: 0.5, ml: 2, color: '#4b5563' }}>
            • {line.substring(2)}
          </Typography>
        )
      }
      if (line.trim() === '') {
        return <Box key={index} sx={{ mb: 1 }} />
      }
      return (
        <Typography key={index} variant="body2" sx={{ mb: 1, color: '#374151', lineHeight: 1.6 }}>
          {line}
        </Typography>
      )
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="terms-modal-title"
      aria-describedby="terms-modal-description"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        id="terms-modal-title"
        sx={{ 
          pb: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          약관 및 정책
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="모달 닫기"
          sx={{ color: '#6b7280' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          aria-label="약관 및 정책 탭"
        >
          <Tab 
            label="이용약관" 
            value="terms"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
          <Tab 
            label="개인정보처리방침" 
            value="privacy"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
        </Tabs>
      </Box>

      <DialogContent
        id="terms-modal-description"
        sx={{ 
          pt: 3,
          pb: 2,
          maxHeight: '60vh',
          overflowY: 'auto'
        }}
      >
        <Box role="document" tabIndex={0}>
          {activeTab === 'terms' ? (
            <Box>
              {formatContent(TERMS_CONTENT)}
            </Box>
          ) : (
            <Box>
              {formatContent(PRIVACY_CONTENT)}
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: '#d1d5db',
            color: '#6b7280',
            textTransform: 'none'
          }}
        >
          취소
        </Button>
        {onAccept && (
          <Button 
            onClick={handleAccept}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            동의하고 계속하기
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default TermsModal