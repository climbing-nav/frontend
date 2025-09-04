import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeAuthAsync, selectIsAuthInitialized, selectAuthLoading } from '../../../store/slices/authSlice'

/**
 * AuthInitializer Component
 * 앱 시작 시 로컬 스토리지에서 인증 상태를 복원하는 컴포넌트
 * 
 * 기능:
 * - 로컬 스토리지에서 토큰과 사용자 정보 확인
 * - 토큰 만료 검사 및 자동 갱신 시도
 * - 인증 상태가 복원될 때까지 로딩 표시
 */
function AuthInitializer({ children }) {
  const dispatch = useDispatch()
  const isInitialized = useSelector(selectIsAuthInitialized)
  const loading = useSelector(selectAuthLoading)

  useEffect(() => {
    // 인증 상태가 아직 초기화되지 않았을 때만 실행
    if (!isInitialized) {
      dispatch(initializeAuthAsync())
    }
  }, [dispatch, isInitialized])

  // 초기화가 완료되지 않았거나 로딩 중일 때는 로딩 표시
  if (!isInitialized || loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          margin: 0
        }}>
          앱을 초기화하는 중...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    )
  }

  // 초기화 완료 후 자식 컴포넌트 렌더링
  return children
}

export default AuthInitializer