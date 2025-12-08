import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { initializeAuthAsync, kakaoLoginAsync, googleLoginAsync, selectIsAuthInitialized, selectIsAuthenticated, setAuthError } from './store/slices/authSlice'
import { fetchPostsAsync } from './store/slices/communitySlice'
import Header from './components/common/Header/Header'
import BottomNavigation from './components/common/BottomNavigation/BottomNavigation'
import FloatingActionButton from './components/common/FAB/FAB'
import OAuthCallbackLoading from './components/common/OAuthCallbackLoading/OAuthCallbackLoading'
import GlobalSnackbar from './components/common/Snackbar/GlobalSnackbar'
import HomePage from './pages/Home/HomePage'
import CommunityPage from './pages/Community/CommunityPage'
import MapPage from './pages/Map/MapPage'
import ProfilePage from './pages/Profile/ProfilePage'
import AuthPage from './pages/Auth/AuthPage'
import GymDetailPage from './pages/GymDetail/GymDetailPage'
import PostCreatePage from './pages/PostCreate/PostCreatePage'
import GymListPage from './pages/GymList/GymListPage'
import PostDetailPage from './pages/PostDetail/PostDetailPage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      dark: '#764ba2'
    },
    background: {
      default: '#f8f9fa'
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
})

function App() {
  const dispatch = useDispatch()
  const processRef = useRef(false)
  const isAuthInitialized = useSelector(selectIsAuthInitialized)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [currentTab, setCurrentTab] = useState('home')
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'map', 'community', 'mypage', 'auth', 'gymDetail', 'postCreate', 'gymList', 'postDetail'
  const [selectedGym, setSelectedGym] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isOAuthProcessing, setIsOAuthProcessing] = useState(false) // OAuth 콜백 처리 중 상태
  const [oauthProvider, setOauthProvider] = useState(null) // 'kakao' | 'google'

  // 앱 시작 시 localStorage 기반 인증 상태 확인
  useEffect(() => {
    if (!isAuthInitialized) {
      dispatch(initializeAuthAsync())
    }
  }, [dispatch, isAuthInitialized])

  // 카카오 OAuth 콜백 처리 - 프론트엔드 주도 플로우
  useEffect(() => {
    const handleKakaoCallback = async () => {
      // URL에서 인증 코드 확인
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      // 카카오 콜백 경로인지 확인
      if (code && window.location.pathname.includes('/auth/kakao/callback')) {
        // 이미 처리했으면 return
        if (processRef.current) {
          console.log('이미 처리된 카카오 콜백, 건너뜀')
          return
        }

        // ⭐ 로딩 상태 시작
        setIsOAuthProcessing(true)
        setOauthProvider('kakao')

        // ⭐ 처리 시작 표시
        processRef.current = true

        // redirectUri도 함께 전송 (카카오 OAuth 스펙 요구사항)
        const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/auth/kakao/callback`

        console.log('카카오 로그인 처리 시작:', { code: code.substring(0, 10) + '...' })

        // Redux async thunk로 카카오 로그인 처리
        const result = await dispatch(kakaoLoginAsync({ code, redirectUri }))

        if (kakaoLoginAsync.fulfilled.match(result)) {
          // 로그인 성공
          console.log('카카오 로그인 성공')

          // URL 파라미터 제거 및 홈으로 리다이렉트
          window.history.replaceState({}, document.title, '/')

          // ⭐ 로딩 상태 종료
          setIsOAuthProcessing(false)
          setOauthProvider(null)

          setCurrentPage('home')
          setCurrentTab('home')
        } else {
          // 로그인 실패
          console.error('카카오 로그인 처리 실패:', result.payload)

          // ⭐ 에러 시 다시 시도할 수 있도록 리셋
          processRef.current = false

          // ⭐ 로딩 상태 종료
          setIsOAuthProcessing(false)
          setOauthProvider(null)

          // 에러 발생 시 로그인 페이지로 리다이렉트
          window.history.replaceState({}, document.title, '/')
          setCurrentPage('auth')
          setSelectedAuthType('login')
        }
      }
    }

    handleKakaoCallback()
  }, [dispatch])

  // 구글 OAuth 콜백 처리 - 프론트엔드 주도 플로우
  useEffect(() => {
    const handleGoogleCallback = async () => {
      // URL에서 인증 코드 확인
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      // 구글 콜백 경로인지 확인
      if (code && window.location.pathname.includes('/auth/google/callback')) {
        // 이미 처리했으면 return
        if (processRef.current) {
          console.log('이미 처리된 구글 콜백, 건너뜀')
          return
        }

        // ⭐ 로딩 상태 시작
        setIsOAuthProcessing(true)
        setOauthProvider('google')

        // ⭐ 처리 시작 표시
        processRef.current = true

        // redirectUri도 함께 전송 (구글 OAuth 스펙 요구사항)
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`

        console.log('구글 로그인 처리 시작:', { code: code.substring(0, 10) + '...' })

        // Redux async thunk로 구글 로그인 처리
        const result = await dispatch(googleLoginAsync({ code, redirectUri }))

        if (googleLoginAsync.fulfilled.match(result)) {
          // 로그인 성공
          console.log('구글 로그인 성공')

          // URL 파라미터 제거 및 홈으로 리다이렉트
          window.history.replaceState({}, document.title, '/')

          // ⭐ 로딩 상태 종료
          setIsOAuthProcessing(false)
          setOauthProvider(null)

          setCurrentPage('home')
          setCurrentTab('home')
        } else {
          // 로그인 실패
          console.error('구글 로그인 처리 실패:', result.payload)

          // ⭐ 에러 시 다시 시도할 수 있도록 리셋
          processRef.current = false

          // ⭐ 로딩 상태 종료
          setIsOAuthProcessing(false)
          setOauthProvider(null)

          // 에러 발생 시 로그인 페이지로 리다이렉트
          window.history.replaceState({}, document.title, '/')
          setCurrentPage('auth')
          setSelectedAuthType('login')
        }
      }
    }

    handleGoogleCallback()
  }, [dispatch])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToGymList={handleNavigateToGymList} />
      case 'map':
        return <MapPage onNavigateToGymDetail={handleNavigateToGymDetail} />
      case 'community':
        return <CommunityPage onNavigateToPostDetail={handleNavigateToPostDetail} />
      case 'mypage':
        return <ProfilePage onNavigateToAuth={handleNavigateToAuth} />
      case 'auth':
        return <AuthPage />
      case 'gymDetail':
        return <GymDetailPage gym={selectedGym} onBack={handleBackFromGymDetail} />
      case 'postCreate':
        return <PostCreatePage onNavigateBack={handleBackFromPostCreate} onPostCreated={handlePostCreated} />
      case 'gymList':
        return <GymListPage onNavigateToGymDetail={handleNavigateToGymDetail} onBack={handleBackFromGymList} />
      case 'postDetail':
        return <PostDetailPage post={selectedPost} onBack={handleBackFromPostDetail} />
      default:
        return <HomePage onNavigateToGymList={handleNavigateToGymList} />
    }
  }

  const handleTabChange = (tab) => {
    setCurrentTab(tab)
    setCurrentPage(tab)
  }

  const handleNavigateToAuth = () => {
    setCurrentPage('auth')
  }

  const handleNavigateToProfile = () => {
    setCurrentPage('mypage')
    setCurrentTab('mypage')
  }

  const handleNavigateToHome = () => {
    setCurrentPage('home')
    setCurrentTab('home')
  }

  const handleNavigateToGymDetail = (gym) => {
    setSelectedGym(gym)
    setCurrentPage('gymDetail')
  }

  const handleBackFromGymDetail = () => {
    setSelectedGym(null)
    setCurrentPage('map')
    setCurrentTab('map')
  }

  const handleNavigateToPostCreate = () => {
    // 로그인 체크
    if (!isAuthenticated) {
      // Snackbar로 에러 메시지 표시
      dispatch(setAuthError('로그인이 필요한 기능입니다.'))
      // 잠시 후 로그인 페이지로 이동
      setTimeout(() => {
        setCurrentPage('auth')
      }, 1500)
      return
    }

    setCurrentPage('postCreate')
  }

  const handleBackFromPostCreate = () => {
    setCurrentPage('community')
    setCurrentTab('community')
  }

  const handlePostCreated = () => {
    // 임시저장 데이터 정리
    try {
      localStorage.removeItem('post-draft-new')
    } catch (error) {
      console.error('Failed to clear draft:', error)
    }

    // 포스트 생성 완료 후 커뮤니티 페이지로 이동
    setCurrentPage('community')
    setCurrentTab('community')
    // 게시글 목록 새로고침
    dispatch(fetchPostsAsync())
  }

  const handleNavigateToGymList = () => {
    setCurrentPage('gymList')
  }

  const handleBackFromGymList = () => {
    setCurrentPage('home')
    setCurrentTab('home')
  }

  const handleNavigateToPostDetail = (post) => {
    setSelectedPost(post)
    setCurrentPage('postDetail')
  }

  const handleBackFromPostDetail = () => {
    setSelectedPost(null)
    setCurrentPage('community')
    setCurrentTab('community')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        maxWidth: 393,
        width: '100%',
        margin: '0 auto',
        minHeight: '100vh',
        bgcolor: 'white',
        boxShadow: '0 0 30px rgba(0,0,0,0.1)',
        position: 'relative',
      }}>
        {/* OAuth 콜백 처리 중 로딩 페이지 */}
        {isOAuthProcessing ? (
          <OAuthCallbackLoading provider={oauthProvider} />
        ) : currentPage === 'auth' ? (
          <AuthPage onNavigateToHome={handleNavigateToHome} />
        ) : (
          <>
            {currentPage !== 'gymDetail' && currentPage !== 'postCreate' && currentPage !== 'gymList' && currentPage !== 'postDetail' && (
              <Header
                onNavigateToAuth={handleNavigateToAuth}
                onNavigateToProfile={handleNavigateToProfile}
              />
            )}
            <Box sx={{ pb: (currentPage === 'gymDetail' || currentPage === 'postCreate' || currentPage === 'gymList' || currentPage === 'postDetail') ? 0 : 10 }}>
              {renderCurrentPage()}
            </Box>
            {!['gymDetail', 'postCreate', 'gymList', 'postDetail', 'home', 'map', 'mypage'].includes(currentPage) && <FloatingActionButton onClick={handleNavigateToPostCreate} />}
            {currentPage !== 'gymDetail' && currentPage !== 'postCreate' && currentPage !== 'gymList' && currentPage !== 'postDetail' && <BottomNavigation currentTab={currentTab} onTabChange={handleTabChange} />}
          </>
        )}
        {/* 전역 Snackbar */}
        <GlobalSnackbar />
      </Box>
    </ThemeProvider>
  )
}

export default App
