import { useDispatch, useSelector } from 'react-redux'
import { Snackbar, Alert } from '@mui/material'
import { clearError, clearSuccess } from '../../../store/slices/communitySlice'
import { clearError as clearAuthError } from '../../../store/slices/authSlice'

/**
 * 전역 Snackbar 컴포넌트
 * Redux state의 error와 success를 감지하여 자동으로 메시지 표시
 * - communitySlice: 게시글 관련 에러/성공
 * - authSlice: 인증 관련 에러
 */
function GlobalSnackbar() {
  const dispatch = useDispatch()
  const { error: communityError, success } = useSelector(state => state.community)
  const { error: authError } = useSelector(state => state.auth)

  // community 또는 auth 에러 중 하나라도 있으면 표시
  const error = communityError || authError

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    // 두 에러 모두 클리어
    dispatch(clearError())
    dispatch(clearAuthError())
  }

  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(clearSuccess())
  }

  return (
    <>
      {/* 에러 메시지 */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 7 }} // Header 아래에 표시
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: 3
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* 성공 메시지 */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 7 }} // Header 아래에 표시
      >
        <Alert
          onClose={handleSuccessClose}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: 3
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </>
  )
}

export default GlobalSnackbar
