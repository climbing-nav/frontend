import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
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
  const [currentTab, setCurrentTab] = useState('home')
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'map', 'community', 'mypage', 'auth', 'gymDetail', 'postCreate'
  const [selectedGym, setSelectedGym] = useState(null)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
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
      default:
        return <HomePage />
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
            {currentPage !== 'gymDetail' && currentPage !== 'postCreate' && <Header onNavigateToAuth={handleNavigateToAuth} />}
            <Box sx={{ pb: (currentPage === 'gymDetail' || currentPage === 'postCreate') ? 0 : 10 }}>
              {renderCurrentPage()}
            </Box>
            {currentPage !== 'gymDetail' && currentPage !== 'postCreate' && <FloatingActionButton onClick={handleNavigateToPostCreate} />}
            {currentPage !== 'gymDetail' && currentPage !== 'postCreate' && <BottomNavigation currentTab={currentTab} onTabChange={handleTabChange} />}
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
