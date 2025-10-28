import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { checkCookieAuthAsync, selectIsAuthInitialized, selectIsAuthenticated, loginSuccess } from './store/slices/authSlice'
import { authService } from './services/authService'
import Header from './components/common/Header/Header'
import BottomNavigation from './components/common/BottomNavigation/BottomNavigation'
import FloatingActionButton from './components/common/FAB/FAB'
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
  const isAuthInitialized = useSelector(selectIsAuthInitialized)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [currentTab, setCurrentTab] = useState('home')
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'map', 'community', 'mypage', 'auth', 'gymDetail', 'postCreate', 'gymList', 'postDetail'
  const [selectedGym, setSelectedGym] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedAuthType, setSelectedAuthType] = useState('login') // 'login' or 'signup'

  // 앱 시작 시 쿠키 기반 인증 상태 확인
  useEffect(() => {
    if (!isAuthInitialized) {
      dispatch(checkCookieAuthAsync())
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
        try {
          // redirectUri도 함께 전송 (카카오 OAuth 스펙 요구사항)
          const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/auth/kakao/callback`

          // 백엔드로 code와 redirectUri 전송하여 토큰 받기
          const userData = await authService.kakaoLogin(code, redirectUri)

          // Redux 상태 업데이트
          dispatch(loginSuccess(userData))

          // URL 파라미터 제거 및 홈으로 리다이렉트
          window.history.replaceState({}, document.title, '/')
          setCurrentPage('home')
          setCurrentTab('home')
        } catch (error) {
          console.error('카카오 로그인 처리 실패:', error)
          // 에러 발생 시 로그인 페이지로 리다이렉트
          window.history.replaceState({}, document.title, '/')
          setCurrentPage('auth')
          setSelectedAuthType('login')
        }
      }
    }

    handleKakaoCallback()
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

  const handleNavigateToAuth = (type = 'login') => {
    setSelectedAuthType(type) // 'login' 또는 'signup'
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
    setCurrentPage('postCreate')
  }

  const handleBackFromPostCreate = () => {
    setCurrentPage('community')
    setCurrentTab('community')
  }

  const handlePostCreated = () => {
    // 포스트 생성 완료 후 커뮤니티 페이지로 이동
    setCurrentPage('community')
    setCurrentTab('community')
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
        {currentPage === 'auth' ? (
          <AuthPage initialTab={selectedAuthType} onNavigateToHome={handleNavigateToHome} />
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
      </Box>
    </ThemeProvider>
  )
}

export default App
