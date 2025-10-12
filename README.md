# 🧗‍♀️ 클라이밍 서울 (Climbing Seoul) - Frontend

> 서울 지역 클라이밍 애호가들을 위한 모바일 웹 애플리케이션

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Material-UI](https://img.shields.io/badge/MUI-7.2.0-007FFF?style=for-the-badge&logo=mui)
![Redux](https://img.shields.io/badge/Redux-2.8.2-764ABC?style=for-the-badge&logo=redux)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite)

## 🌐 배포 정보

- **프로덕션 URL**: https://climbing-dev.kro.kr
- **CI/CD**: GitHub Actions (자동 배포)
- **인프라**: Docker + Nginx + SSL (Let's Encrypt)

## 📋 프로젝트 개요

클라이밍 서울은 서울 및 수도권의 클라이밍 암장 정보를 제공하고, 클라이밍 커뮤니티를 연결하는 모바일 우선 웹 애플리케이션입니다.

### 🎯 주요 기능

- 🗺️ **암장 지도**: 카카오맵 기반 암장 위치 및 실시간 혼잡도 확인
- 🏠 **홈**: 주변 암장 지도 미리보기와 추천 암장 목록
- 💬 **커뮤니티**: 탭별 게시물 필터링 (전체/질문/팁/후기) 및 상세보기
- 👤 **프로필**: 개인 프로필 및 클라이밍 기록 관리
- 🔐 **인증**: 소셜 로그인 (카카오) 및 회원가입

## 🛠️ 기술 스택

### Frontend Framework
- **React** 19.1.0 - 최신 React 기능 활용
- **Vite** 7.0.4 - 빠른 개발 환경 및 빌드

### UI/UX
- **Material-UI** 7.2.0 - 일관된 Material Design
- **Framer Motion** 12.23.3 - 부드러운 애니메이션
- **모바일 최적화** - 393px 기준 반응형 디자인

### 상태 관리
- **Redux Toolkit** 2.8.2 - 효율적인 상태 관리
- **React-Redux** 9.2.0 - React-Redux 연동

### HTTP 통신
- **Axios** 1.10.0 - API 통신 및 인터셉터

### 지도 & 위치
- **Kakao Maps API** - 지도 표시 및 마커
- **Geolocation API** - 사용자 위치 기반 기능

### 개발 도구
- **ESLint** - 코드 품질 관리
- **React Hook Form** 7.53.2 - 폼 관리
- **Docker** - 컨테이너화 및 배포
- **GitHub Actions** - CI/CD 파이프라인

## 🏗️ 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── auth/            # 인증 관련 컴포넌트
│   │   ├── LoginForm/   # 로그인 폼 ✅
│   │   ├── RegisterForm/# 회원가입 폼
│   │   └── SocialLogin/ # 소셜 로그인
│   ├── common/          # 공통 컴포넌트
│   │   ├── Header/      # 상단 헤더 ✅
│   │   ├── BottomNavigation/ # 하단 네비게이션 ✅
│   │   ├── FAB/         # 플로팅 액션 버튼 ✅
│   │   ├── Loading/     # 로딩 컴포넌트
│   │   ├── Modal/       # 모달 컴포넌트
│   │   └── Footer/      # 푸터
│   ├── community/       # 커뮤니티 관련 컴포넌트
│   │   ├── PostCard/    # 게시글 카드 ✅
│   │   ├── PostForm/    # 게시글 작성
│   │   ├── PostList/    # 게시글 목록
│   │   ├── CommentForm/ # 댓글 작성
│   │   └── CommentList/ # 댓글 목록
│   ├── gym/             # 암장 관련 컴포넌트
│   │   ├── GymCard/     # 암장 카드 ✅
│   │   ├── GymDetail/   # 암장 상세
│   │   └── GymList/     # 암장 목록
│   └── map/             # 지도 관련 컴포넌트
│       ├── KakaoMap/    # 카카오 지도
│       ├── GymMarker/   # 암장 마커
│       └── CongestionBadge/ # 혼잡도 배지
├── pages/               # 페이지 컴포넌트
│   ├── Home/           # 홈페이지 ✅
│   ├── Map/            # 지도 페이지
│   ├── Community/      # 커뮤니티 페이지 ✅
│   ├── Profile/        # 프로필 페이지 ✅
│   └── Auth/           # 인증 페이지 ✅
├── store/              # Redux 상태 관리
│   ├── slices/         # Redux 슬라이스
│   │   ├── authSlice.js    # 인증 상태 ✅
│   │   ├── gymSlice.js     # 암장 상태 ✅
│   │   ├── communitySlice.js # 커뮤니티 상태 ✅
│   │   └── mapSlice.js     # 지도 상태 ✅
│   └── index.js        # 스토어 설정 ✅
├── services/           # API 서비스
│   ├── api.js          # 공통 API 설정 ✅
│   ├── authService.js  # 인증 서비스 ✅
│   ├── gymService.js   # 암장 서비스 ✅
│   └── communityService.js # 커뮤니티 서비스 ✅
├── hooks/              # 커스텀 훅
│   ├── useAuth.js      # 인증 훅 ✅
│   ├── useGyms.js      # 암장 훅 ✅
│   ├── useMap.js       # 지도 훅 ✅
│   └── usePosts.js     # 게시글 훅 ✅
├── utils/              # 유틸리티 함수
│   ├── constants.js    # 상수 정의 ✅
│   ├── formatters.js   # 포맷터 함수 ✅
│   ├── helpers.js      # 도우미 함수 ✅
│   └── validators.js   # 유효성 검사 ✅
└── styles/             # 스타일 관련
    ├── globals.css     # 전역 스타일 ✅
    └── theme.js        # Material-UI 테마 ✅
```

## 🚀 시작하기

### 필수 조건

- **Node.js** 18.x 이상
- **npm** 또는 **yarn**

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/climbing-nav/frontend.git
   cd frontend
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   - `.env` 파일 생성 및 설정
   ```bash
   VITE_API_URL=https://climbing-dev.kro.kr
   VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   - `http://localhost:5173`에서 애플리케이션 확인

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 코드 린트 검사
npm run lint
```

### Docker로 실행

```bash
# Docker 이미지 빌드
docker build -t climbing-map .

# 컨테이너 실행
docker run -p 5173:5173 climbing-map
```

## 📱 화면 구성

### 🏠 홈페이지
- 서울 암장 통계 (24개 암장, 12개 쾌적한 곳) ✅
- 내 주변 암장 지도 미리보기 (카카오맵 연동) ✅
- 추천 암장 목록 (어썸클라이밍, 볼더링스튜디오 등) ✅

### 🗺️ 지도 페이지
- 카카오맵 API 기반 암장 위치 표시 ✅
- 실시간 혼잡도 정보 (쾌적/보통/혼잡) ✅
- 현재 위치 기반 주변 암장 검색 ✅
- 모바일 최적화된 마커 렌더링 ✅

### 💬 커뮤니티 페이지
- 탭 기반 필터링 (전체/질문/팁/후기) ✅
- 게시글 목록 및 카드 UI ✅
- 게시글 상세보기 페이지 ✅
- 게시글 작성 페이지 ✅
- 댓글 시스템 (개발 중)

### 👤 프로필 페이지
- 사용자 프로필 정보 표시 ✅
- 클라이밍 레벨 및 성취도 ✅
- 설정 및 고객센터 메뉴 ✅

### 🔐 인증 페이지
- 로그인/회원가입 UI ✅
- 카카오 소셜 로그인 (HTTPS) ✅
- 인증 상태 관리 (Redux) ✅
- 회원가입 라우팅 ✅

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: `#667eea` (보라빛 파랑)
- **Secondary**: `#764ba2` (진한 보라)
- **Background**: `#f8f9fa` (밝은 회색)

### 타이포그래피
- **Font Family**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **반응형 디자인**: 모바일 우선 (393px 기준)

## 📊 개발 현황

### ✅ 완료된 기능 (진행률 75%)

#### 페이지
- [x] **HomePage** - 통계, 지도 미리보기, 추천 암장 목록
- [x] **MapPage** - 카카오맵 기반 암장 지도 (모바일 최적화)
- [x] **CommunityPage** - 탭 필터링, 게시글 목록
- [x] **PostDetailPage** - 게시글 상세보기
- [x] **PostCreatePage** - 게시글 작성
- [x] **ProfilePage** - 사용자 프로필, 메뉴
- [x] **AuthPage** - 로그인/회원가입
- [x] **GymDetailPage** - 암장 상세 정보
- [x] **GymListPage** - 암장 목록

#### 공통 컴포넌트
- [x] **Header** - 검색바, 프로필 버튼
- [x] **BottomNavigation** - 4개 탭 네비게이션
- [x] **FAB** - 플로팅 액션 버튼
- [x] **CongestionBadge** - 혼잡도 표시 컴포넌트

#### 인증 시스템
- [x] **LoginForm** - 로그인 폼 (유효성 검사)
- [x] **RegisterForm** - 회원가입 폼
- [x] **SocialLogin** - 카카오 OAuth (HTTPS)
- [x] **AuthInitializer** - 인증 상태 초기화
- [x] **EmailVerification** - 이메일 인증

#### 지도 기능
- [x] **KakaoMap** - 카카오맵 API 연동
- [x] **GymMarker** - 암장 마커 렌더링
- [x] **모바일 최적화** - 메모리 효율적인 마커 관리

#### 상태 관리 & 서비스
- [x] **Redux Slices** - auth, gym, community, map
- [x] **Custom Hooks** - useAuth, useGyms, useMap, usePosts, useKakaoAuth
- [x] **API Services** - 백엔드 API 통신 레이어

#### 인프라 & 배포
- [x] **Docker** - 컨테이너화
- [x] **Nginx** - 리버스 프록시 및 SSL
- [x] **GitHub Actions** - CI/CD 파이프라인
- [x] **도메인 & SSL** - HTTPS 적용 (climbing-dev.kro.kr)

### 🚧 개발 중인 기능

#### 커뮤니티
- [ ] **CommentForm** - 댓글 작성 기능
- [ ] **CommentList** - 댓글 목록 및 대댓글
- [ ] **게시글 수정/삭제** - CRUD 완성

#### 추가 기능
- [ ] **알림 시스템** - 실시간 알림
- [ ] **검색 기능** - 암장/게시글 통합 검색
- [ ] **북마크** - 암장 즐겨찾기

## 🛣️ 로드맵

### Phase 1: 핵심 기능 완성 ✅ (완료)
- [x] 인증 시스템 구현 (카카오 소셜 로그인)
- [x] 지도 기능 (카카오맵 API, 모바일 최적화)
- [x] 암장 상세 정보 페이지
- [x] 배포 인프라 구축 (Docker, Nginx, SSL)

### Phase 2: 커뮤니티 기능 구현 🚧 (진행 중)
- [x] 게시글 CRUD 시스템
- [x] 탭별 필터링 기능
- [ ] 댓글 및 대댓글 기능
- [ ] 통합 검색 기능

### Phase 3: 사용자 경험 향상 (예정)
- [ ] 실시간 알림 시스템
- [ ] 암장 북마크 기능
- [ ] 성능 최적화 (이미지 lazy loading, 코드 스플리팅)
- [ ] PWA 기능 (오프라인 지원)

## 🤝 기여 방법

1. **이슈 확인**: [GitHub Issues](https://github.com/climbing-nav/frontend/issues)
2. **브랜치 생성**: `feature/기능명` 또는 `fix/버그명`
3. **커밋 컨벤션** (Emoji 포함):
   - `✨ feat: 새로운 기능`
   - `🐛 fix: 버그 수정`
   - `📝 docs: 문서 수정`
   - `🎨 style: 코드 포맷팅`
   - `♻️ refactor: 리팩토링`
   - `🔧 chore: 설정 변경`
   - `🔥 hotfix: 긴급 수정`
4. **Pull Request 생성**
5. **자동 배포**: main 브랜치 머지 시 자동 배포됨

## 📞 문의 및 지원

- **GitHub Issues**: [버그 리포트 및 기능 요청](https://github.com/climbing-nav/frontend/issues)
- **이메일**: 추후 추가

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

**🧗‍♀️ 클라이밍 서울과 함께 서울의 모든 클라이밍 암장을 탐험하세요!**

> Made with ❤️ by Climbing Seoul Team