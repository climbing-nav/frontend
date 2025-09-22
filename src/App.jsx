import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { checkCookieAuthAsync, selectIsAuthInitialized, selectIsAuthenticated } from './store/slices/authSlice'
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
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'map', 'community', 'mypage', 'auth', 'gymDetail', 'postCreate', 'gymList'
  const [selectedGym, setSelectedGym] = useState(null)

  // 앱 시작 시 쿠키 기반 인증 상태 확인
  useEffect(() => {
    if (!isAuthInitialized) {
      dispatch(checkCookieAuthAsync())
    }
  }, [dispatch, isAuthInitialized])

  // 카카오 로그인 성공 후 리다이렉트 처리
  useEffect(() => {
    // URL에서 카카오 로그인 성공 여부 확인
    const urlParams = new URLSearchParams(window.location.search)
    const loginSuccess = urlParams.get('login')

    if (loginSuccess === 'success') {
      // URL 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname)

      // 인증 상태 다시 확인
      dispatch(checkCookieAuthAsync())

      // 홈 페이지로 이동
      setCurrentPage('home')
      setCurrentTab('home')
    }
  }, [dispatch])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToGymList={handleNavigateToGymList} />
      case 'map':
        return <MapPage onNavigateToGymDetail={handleNavigateToGymDetail} />
      case 'community':
        return <CommunityPage />
      case 'mypage':
        return <ProfilePage />
      case 'auth':
        return <AuthPage />
      case 'gymDetail':
        return <GymDetailPage gym={selectedGym} onBack={handleBackFromGymDetail} />
      case 'postCreate':
        return <PostCreatePage onNavigateBack={handleBackFromPostCreate} onPostCreated={handlePostCreated} />
      case 'gymList':
        return <GymListPage onNavigateToGymDetail={handleNavigateToGymDetail} onBack={handleBackFromGymList} />
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
          <AuthPage onNavigateToHome={handleNavigateToHome} />
        ) : (
          <>
            {currentPage !== 'gymDetail' && currentPage !== 'postCreate' && currentPage !== 'gymList' && <Header onNavigateToAuth={handleNavigateToAuth} />}
            <Box sx={{ pb: (currentPage === 'gymDetail' || currentPage === 'postCreate' || currentPage === 'gymList') ? 0 : 10 }}>
              {renderCurrentPage()}
            </Box>
            {currentPage !== 'gymDetail' && currentPage !== 'postCreate' && currentPage !== 'gymList' && <FloatingActionButton onClick={handleNavigateToPostCreate} />}
            {currentPage !== 'gymDetail' && currentPage !== 'postCreate' && currentPage !== 'gymList' && <BottomNavigation currentTab={currentTab} onTabChange={handleTabChange} />}
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
