import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { initializeAuthAsync, kakaoLoginAsync, googleLoginAsync, selectIsAuthInitialized, selectIsAuthenticated, setAuthError } from './store/slices/authSlice'
import { fetchPostsAsync, fetchPostAsync } from './store/slices/communitySlice'
import Header from './components/common/Header/Header'
import BottomNavigation from './components/common/BottomNavigation/BottomNavigation'
import FloatingActionButton from './components/common/FAB/FAB'
import OAuthCallbackLoading from './components/common/OAuthCallbackLoading/OAuthCallbackLoading'
import BackofficeLoadingScreen from './components/common/BackofficeLoadingScreen/BackofficeLoadingScreen'
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
import LandingPage from './pages/LandingPage'
import FavoriteGymsPage from './pages/Profile/FavoriteGyms/FavoriteGymsPage'
import MyPostsPage from './pages/Profile/MyPosts/MyPostsPage'
import VisitHistoryPage from './pages/Profile/VisitHistory/VisitHistoryPage'
import SettingsPage from './pages/Profile/Settings/SettingsPage'
import CustomerSupportPage from './pages/Profile/CustomerSupport/CustomerSupportPage'
import TermsAndPoliciesPage from './pages/Profile/TermsAndPolicies/TermsAndPoliciesPage'
import BackofficeLayout from './pages/Backoffice/Layout/BackofficeLayout'
import BackofficeDashboard from './pages/Backoffice/Dashboard/BackofficeDashboard'
import BackofficeGyms from './pages/Backoffice/Gyms/BackofficeGyms'
import BackofficeCongestion from './pages/Backoffice/Congestion/BackofficeCongestion'
import BackofficeSettings from './pages/Backoffice/Settings/BackofficeSettings'

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

// URL 기반으로 초기 페이지 결정
const getInitialPageFromURL = () => {
  const path = window.location.pathname
  const params = new URLSearchParams(window.location.search)

  // OAuth 콜백 처리 중이면 landing
  if (path.includes('/auth/kakao/callback') || path.includes('/auth/google/callback')) {
    return 'landing'
  }

  // 백오피스 경로 확인
  if (path.includes('/backoffice')) {
    return 'backoffice'
  }

  // URL 경로에서 페이지 결정
  if (path === '/' || path === '') {
    // localStorage에 토큰이 있으면 home, 없으면 landing
    const token = localStorage.getItem('token')
    return token ? 'home' : 'landing'
  }
  if (path.includes('/community')) return 'community'
  if (path.includes('/map')) return 'map'
  if (path.includes('/mypage') || path.includes('/profile')) return 'mypage'
  if (path.includes('/auth')) return 'auth'

  // 기본값
  const token = localStorage.getItem('token')
  return token ? 'home' : 'landing'
}

function App() {
  const dispatch = useDispatch()
  const processRef = useRef(false)
  const isAuthInitialized = useSelector(selectIsAuthInitialized)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [currentTab, setCurrentTab] = useState(() => {
    const initialPage = getInitialPageFromURL()
    return ['home', 'map', 'community', 'mypage'].includes(initialPage) ? initialPage : 'home'
  })
  const [currentPage, setCurrentPage] = useState(getInitialPageFromURL) // 'landing', 'home', 'map', 'community', 'mypage', 'auth', 'gymDetail', 'postCreate', 'gymList', 'postDetail', 'postEdit', 'favoriteGyms', 'myPosts', 'visitHistory', 'settings', 'customerSupport', 'termsAndPolicies'
  const [selectedGym, setSelectedGym] = useState(null)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [editingPost, setEditingPost] = useState(null) // 수정 중인 게시글
  const [isOAuthProcessing, setIsOAuthProcessing] = useState(false) // OAuth 콜백 처리 중 상태
  const [oauthProvider, setOauthProvider] = useState(null) // 'kakao' | 'google'
  const [isBackofficeLoading, setIsBackofficeLoading] = useState(false) // 백오피스 로딩 상태

  // 앱 시작 시 localStorage 기반 인증 상태 확인
  useEffect(() => {
    if (!isAuthInitialized) {
      dispatch(initializeAuthAsync())
    }
  }, [dispatch, isAuthInitialized])

  // 브라우저 뒤로가기/앞으로가기 지원
  useEffect(() => {
    const handlePopState = () => {
      const newPage = getInitialPageFromURL()
      setCurrentPage(newPage)
      if (['home', 'map', 'community', 'mypage'].includes(newPage)) {
        setCurrentTab(newPage)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // 백오피스 페이지 전환 시 로딩 화면 표시
  useEffect(() => {
    if (currentPage === 'backoffice') {
      setIsBackofficeLoading(true)
      // 로딩 화면을 1초간 표시
      const timer = setTimeout(() => {
        setIsBackofficeLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentPage])

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
      case 'landing':
        return (
          <LandingPage
            onNavigateToMap={() => {
              setCurrentPage('map')
              setCurrentTab('map')
            }}
            onNavigateToAuth={() => {
              setCurrentPage('auth')
            }}
            onNavigateToCommunity={() => {
              setCurrentPage('community')
              setCurrentTab('community')
            }}
          />
        )
      case 'home':
        return <HomePage onNavigateToGymList={handleNavigateToGymList} />
      case 'map':
        return <MapPage onNavigateToGymDetail={handleNavigateToGymDetail} />
      case 'community':
        return <CommunityPage onNavigateToPostDetail={handleNavigateToPostDetail} />
      case 'mypage':
        return <ProfilePage onNavigateToAuth={handleNavigateToAuth} onNavigateToSubPage={handleNavigateToProfileSubPage} />
      case 'favoriteGyms':
        return <FavoriteGymsPage onNavigateToGym={handleNavigateToGymDetail} onBack={handleBackFromProfileSubPage} />
      case 'myPosts':
        return <MyPostsPage onNavigateToPost={handleNavigateToPostDetail} onNavigateToEdit={handleNavigateToPostEdit} onBack={handleBackFromProfileSubPage} />
      case 'visitHistory':
        return <VisitHistoryPage onNavigateToGym={handleNavigateToGymDetail} onBack={handleBackFromProfileSubPage} />
      case 'settings':
        return <SettingsPage onNavigateToProfile={handleNavigateToProfile} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} onBack={handleBackFromProfileSubPage} />
      case 'customerSupport':
        return <CustomerSupportPage onNavigateToInquiry={() => console.log('Navigate to inquiry')} onBack={handleBackFromProfileSubPage} />
      case 'termsAndPolicies':
        return <TermsAndPoliciesPage onNavigateToPolicy={(policy) => console.log('Navigate to policy:', policy)} onBack={handleBackFromProfileSubPage} />
      case 'auth':
        return <AuthPage />
      case 'gymDetail':
        return <GymDetailPage gym={selectedGym} onBack={handleBackFromGymDetail} />
      case 'postCreate':
        return <PostCreatePage onNavigateBack={handleBackFromPostCreate} onPostCreated={handlePostCreated} />
      case 'postEdit':
        return <PostCreatePage post={editingPost} onNavigateBack={handleBackFromPostEdit} onPostCreated={handlePostUpdated} />
      case 'gymList':
        return <GymListPage onNavigateToGymDetail={handleNavigateToGymDetail} onBack={handleBackFromGymList} />
      case 'postDetail':
        return <PostDetailPage postId={selectedPostId} onBack={handleBackFromPostDetail} onEdit={handleNavigateToPostEdit} />
      case 'backoffice':
        return (
          <BrowserRouter>
            <Routes>
              <Route path="/backoffice" element={<BackofficeLayout />}>
                <Route index element={<BackofficeDashboard />} />
                <Route path="gyms" element={<BackofficeGyms />} />
                <Route path="congestion" element={<BackofficeCongestion />} />
                <Route path="settings" element={<BackofficeSettings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        )
      default:
        return <HomePage onNavigateToGymList={handleNavigateToGymList} />
    }
  }

  const handleTabChange = (tab) => {
    setCurrentTab(tab)
    setCurrentPage(tab)
    // URL 업데이트
    const path = tab === 'home' ? '/' : `/${tab}`
    window.history.pushState({}, '', path)
  }

  const handleNavigateToAuth = () => {
    setCurrentPage('auth')
    window.history.pushState({}, '', '/auth')
  }

  const handleNavigateToProfile = () => {
    setCurrentPage('mypage')
    setCurrentTab('mypage')
    window.history.pushState({}, '', '/mypage')
  }

  const handleNavigateToHome = () => {
    setCurrentPage('home')
    setCurrentTab('home')
    window.history.pushState({}, '', '/')
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
    setSelectedPostId(post.id)
    dispatch(fetchPostAsync(post.id))
    setCurrentPage('postDetail')
  }

  const handleBackFromPostDetail = () => {
    setSelectedPostId(null)
    setCurrentPage('community')
    setCurrentTab('community')
  }

  const handleNavigateToPostEdit = (post) => {
    setEditingPost(post)
    setCurrentPage('postEdit')
  }

  const handleBackFromPostEdit = () => {
    setEditingPost(null)
    setCurrentPage('postDetail')
  }

  const handlePostUpdated = async () => {
    // 게시글 수정 완료 후 상세 페이지로 돌아가기
    try {
      // 수정된 게시글 다시 조회하여 Redux 업데이트
      if (selectedPostId) {
        await dispatch(fetchPostAsync(selectedPostId))
      }
      // 게시글 목록도 새로고침
      dispatch(fetchPostsAsync())
    } catch (error) {
      console.error('게시글 새로고침 실패:', error)
    }
    setEditingPost(null)
    setCurrentPage('postDetail')
  }

  const handleNavigateToProfileSubPage = (page) => {
    setCurrentPage(page)
    window.history.pushState({}, '', `/profile/${page}`)
  }

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('token')
    setCurrentPage('landing')
    setCurrentTab('home')
    window.history.pushState({}, '', '/')
  }

  const handleDeleteAccount = () => {
    // 회원 탈퇴 처리
    localStorage.removeItem('token')
    setCurrentPage('landing')
    setCurrentTab('home')
    window.history.pushState({}, '', '/')
  }

  const handleBackFromProfileSubPage = () => {
    setCurrentPage('mypage')
    setCurrentTab('mypage')
    window.history.pushState({}, '', '/mypage')
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
        ) : isBackofficeLoading ? (
          <BackofficeLoadingScreen />
        ) : currentPage === 'auth' ? (
          <AuthPage onNavigateToHome={handleNavigateToHome} />
        ) : currentPage === 'landing' ? (
          renderCurrentPage()
        ) : currentPage === 'backoffice' ? (
          renderCurrentPage()
        ) : (
          <>
            {!['gymDetail', 'postCreate', 'postEdit', 'gymList', 'postDetail', 'favoriteGyms', 'myPosts', 'visitHistory', 'settings', 'customerSupport', 'termsAndPolicies'].includes(currentPage) && (
              <Header
                onNavigateToAuth={handleNavigateToAuth}
                onNavigateToProfile={handleNavigateToProfile}
              />
            )}
            <Box sx={{ pb: ['gymDetail', 'postCreate', 'postEdit', 'gymList', 'postDetail', 'favoriteGyms', 'myPosts', 'visitHistory', 'settings', 'customerSupport', 'termsAndPolicies'].includes(currentPage) ? 0 : 10 }}>
              {renderCurrentPage()}
            </Box>
            {!['gymDetail', 'postCreate', 'postEdit', 'gymList', 'postDetail', 'home', 'map', 'mypage', 'favoriteGyms', 'myPosts', 'visitHistory', 'settings', 'customerSupport', 'termsAndPolicies'].includes(currentPage) && <FloatingActionButton onClick={handleNavigateToPostCreate} />}
            {!['gymDetail', 'postCreate', 'postEdit', 'gymList', 'postDetail', 'favoriteGyms', 'myPosts', 'visitHistory', 'settings', 'customerSupport', 'termsAndPolicies'].includes(currentPage) && <BottomNavigation currentTab={currentTab} onTabChange={handleTabChange} />}
          </>
        )}
        {/* 전역 Snackbar */}
        <GlobalSnackbar />
      </Box>
    </ThemeProvider>
  )
}

export default App
