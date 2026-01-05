// 실시간 혼잡도 차트 데이터
export const congestionData = [
  { time: '06:00', today: 12, yesterday: 8 },
  { time: '08:00', today: 35, yesterday: 28 },
  { time: '10:00', today: 58, yesterday: 52 },
  { time: '12:00', today: 82, yesterday: 75 },
  { time: '14:00', today: 95, yesterday: 88, isPeak: true },
  { time: '16:00', today: 78, yesterday: 82 },
  { time: '18:00', today: 120, yesterday: 115, isPeak: true },
  { time: '20:00', today: 102, yesterday: 98 },
  { time: '22:00', today: 45, yesterday: 52 },
];

// 최근 암장 등록
export const recentGyms = [
  { id: 1, name: '클라임 하우스 강남', location: '서울 강남구', time: '5분 전', avatar: 'CH', color: '#ff6b35' },
  { id: 2, name: '더클라임 홍대', location: '서울 마포구', time: '12분 전', avatar: 'TC', color: '#667eea' },
  { id: 3, name: '볼더링 파크', location: '서울 송파구', time: '25분 전', avatar: 'BP', color: '#48bb78' },
  { id: 4, name: '스파이더 클라임', location: '경기 성남시', time: '1시간 전', avatar: 'SC', color: '#f59e0b' },
  { id: 5, name: '락앤클라임', location: '서울 강서구', time: '2시간 전', avatar: 'RC', color: '#ec4899' },
];

// 최근 회원 가입
export const recentMembers = [
  { id: 1, name: '김민수', time: '방금 전', level: '초급' },
  { id: 2, name: '이지은', time: '3분 전', level: '중급' },
  { id: 3, name: '박준호', time: '8분 전', level: '초급' },
  { id: 4, name: '최서연', time: '15분 전', level: '고급' },
  { id: 5, name: '정우진', time: '22분 전', level: '중급' },
];

// 최근 문제 등록
export const recentProblems = [
  { id: 1, gym: '클라임 하우스', grade: 'V4', color: '#48bb78', time: '10분 전' },
  { id: 2, gym: '더클라임', grade: 'V7', color: '#f59e0b', time: '18분 전' },
  { id: 3, gym: '볼더링 파크', grade: 'V3', color: '#667eea', time: '32분 전' },
  { id: 4, gym: '스파이더', grade: 'V9', color: '#ff6b35', time: '45분 전' },
  { id: 5, gym: '락앤클라임', grade: 'V5', color: '#ec4899', time: '1시간 전' },
];

// 인기 암장 순위 (주간)
export const popularGymsWeekly = [
  { id: 1, name: '클라임 하우스 강남', location: '서울 강남구', visitors: 1250, rating: 4.8, change: 'up', avatar: 'CH' },
  { id: 2, name: '더클라임 홍대', location: '서울 마포구', visitors: 1180, rating: 4.7, change: 'up', avatar: 'TC' },
  { id: 3, name: '볼더링 파크', location: '서울 송파구', visitors: 980, rating: 4.6, change: 'down', avatar: 'BP' },
  { id: 4, name: '스파이더 클라임', location: '경기 성남시', visitors: 890, rating: 4.5, change: 'same', avatar: 'SC' },
  { id: 5, name: '락앤클라임', location: '서울 강서구', visitors: 750, rating: 4.4, change: 'up', avatar: 'RC' },
];

// 인기 암장 순위 (월간)
export const popularGymsMonthly = [
  { id: 1, name: '더클라임 홍대', location: '서울 마포구', visitors: 4820, rating: 4.7, change: 'up', avatar: 'TC' },
  { id: 2, name: '클라임 하우스 강남', location: '서울 강남구', visitors: 4650, rating: 4.8, change: 'down', avatar: 'CH' },
  { id: 3, name: '스파이더 클라임', location: '경기 성남시', visitors: 3890, rating: 4.5, change: 'up', avatar: 'SC' },
  { id: 4, name: '볼더링 파크', location: '서울 송파구', visitors: 3540, rating: 4.6, change: 'down', avatar: 'BP' },
  { id: 5, name: '클라이밍 팩토리', location: '서울 영등포구', visitors: 3120, rating: 4.3, change: 'up', avatar: 'CF' },
];

// 회원 활동 분석 - 일간
export const dailyActivityData = [
  { date: '12/29', active: 245, newSignups: 18 },
  { date: '12/30', active: 312, newSignups: 24 },
  { date: '12/31', active: 198, newSignups: 12 },
  { date: '01/01', active: 156, newSignups: 8 },
  { date: '01/02', active: 389, newSignups: 32 },
  { date: '01/03', active: 425, newSignups: 28 },
  { date: '01/04', active: 478, newSignups: 35 },
];

// 회원 활동 분석 - 주간
export const weeklyActivityData = [
  { date: '12월 1주', active: 1850, newSignups: 142 },
  { date: '12월 2주', active: 2120, newSignups: 168 },
  { date: '12월 3주', active: 1980, newSignups: 135 },
  { date: '12월 4주', active: 2450, newSignups: 198 },
  { date: '1월 1주', active: 2680, newSignups: 225 },
];

// 회원 활동 분석 - 월간
export const monthlyActivityData = [
  { date: '9월', active: 6800, newSignups: 520 },
  { date: '10월', active: 7450, newSignups: 612 },
  { date: '11월', active: 8200, newSignups: 698 },
  { date: '12월', active: 9100, newSignups: 785 },
  { date: '1월', active: 8950, newSignups: 742 },
];

// 최근 리뷰
export const recentReviews = [
  {
    id: 1,
    userName: '박서준',
    gymName: '클라임 하우스 강남',
    rating: 5,
    content: '시설이 깨끗하고 직원분들이 너무 친절해요! 초보자도 쉽게 배울 수 있었습니다.',
    time: '10분 전',
    isNegative: false,
  },
  {
    id: 2,
    userName: '김예진',
    gymName: '더클라임 홍대',
    rating: 2,
    content: '주말에 너무 혼잡해서 제대로 운동을 할 수 없었어요. 인원 제한이 필요할 것 같습니다.',
    time: '25분 전',
    isNegative: true,
  },
  {
    id: 3,
    userName: '이동현',
    gymName: '볼더링 파크',
    rating: 4,
    content: '루트 세팅이 다양하고 재미있어요. 다만 샤워실이 조금 좁은 편입니다.',
    time: '1시간 전',
    isNegative: false,
  },
  {
    id: 4,
    userName: '최민지',
    gymName: '스파이더 클라임',
    rating: 1,
    content: '환기가 안 되어서 냄새가 심했습니다. 위생 관리가 필요해 보입니다.',
    time: '2시간 전',
    isNegative: true,
  },
  {
    id: 5,
    userName: '정수현',
    gymName: '락앤클라임',
    rating: 5,
    content: '가성비 최고! 월 정액권 가격도 합리적이고 시설도 좋아요.',
    time: '3시간 전',
    isNegative: false,
  },
];

// 평점 트렌드
export const ratingTrendData = [
  { date: '12/29', rating: 4.2 },
  { date: '12/30', rating: 4.3 },
  { date: '12/31', rating: 4.1 },
  { date: '01/01', rating: 4.4 },
  { date: '01/02', rating: 4.5 },
  { date: '01/03', rating: 4.3 },
  { date: '01/04', rating: 4.6 },
];

// 평점 분포
export const ratingDistribution = [
  { stars: 5, count: 245, percentage: 45 },
  { stars: 4, count: 156, percentage: 29 },
  { stars: 3, count: 78, percentage: 14 },
  { stars: 2, count: 42, percentage: 8 },
  { stars: 1, count: 21, percentage: 4 },
];

// 시스템 알림
export const systemNotifications = [
  {
    id: 1,
    type: 'approval',
    title: '암장 승인 요청',
    description: '클라이밍 센터 판교점이 등록 승인을 요청했습니다.',
    time: '5분 전',
    priority: 'high',
    count: 3,
  },
  {
    id: 2,
    type: 'report',
    title: '부적절한 리뷰 신고',
    description: '더클라임 홍대점 리뷰에 대한 신고가 접수되었습니다.',
    time: '15분 전',
    priority: 'urgent',
  },
  {
    id: 3,
    type: 'maintenance',
    title: '시스템 점검 예정',
    description: '1월 10일 02:00-04:00 서버 점검이 예정되어 있습니다.',
    time: '1시간 전',
    priority: 'normal',
  },
  {
    id: 4,
    type: 'report',
    title: '부적절한 사진 신고',
    description: '볼더링 파크 게시물에 부적절한 사진이 신고되었습니다.',
    time: '2시간 전',
    priority: 'high',
  },
  {
    id: 5,
    type: 'approval',
    title: '암장 정보 수정 요청',
    description: '스파이더 클라임에서 영업시간 정보 수정을 요청했습니다.',
    time: '3시간 전',
    priority: 'normal',
  },
];
