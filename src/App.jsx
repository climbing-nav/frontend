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
  const [currentPage, setCurrentPage] = useState('map') // 'home', 'map', 'community', 'mypage', 'auth'

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'map':
        return <MapPage />
      case 'community':
        return <CommunityPage />
      case 'mypage':
        return <ProfilePage />
      case 'auth':
        return <AuthPage />
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
          <AuthPage />
        ) : (
          <>
            <Header onNavigateToAuth={handleNavigateToAuth} />
            <Box sx={{ pb: 10 }}>
              {renderCurrentPage()}
            </Box>
            <FloatingActionButton />
            <BottomNavigation currentTab={currentTab} onTabChange={handleTabChange} />
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
