// Mock gym data for testing
export const mockGyms = [
  {
    id: 1,
    name: "더클라임 홍대점",
    address: "서울특별시 마포구 홍익로6길 16",
    addressDetail: "홍대입구역 9번 출구 도보 3분",
    lat: 37.5563,
    lng: 126.9236,
    congestion: "comfortable", // comfortable, normal, crowded
    rating: 4.5,
    reviewCount: 128,
    phone: "02-336-1234",
    website: "https://theclimb-hongdae.com",
    type: "실내 클라이밍",
    operatingHours: {
      weekdays: "06:00-23:00",
      weekend: "07:00-22:00",
      holidays: "08:00-21:00",
      notes: "매월 둘째 월요일 휴무"
    },
    facilities: ["볼더링", "리드클라이밍", "샤워실", "주차장", "락커룸", "카페"],
    accessibility: ["엘리베이터 접근", "휠체어 접근 가능", "장애인 화장실"],
    tags: ["초보자 환영", "강습 가능", "24시간"],
    description: "홍대 최대 규모의 클라이밍 센터입니다. 초보자부터 고급자까지 다양한 루트를 제공하며, 전문 강사진의 체계적인 강습을 받을 수 있습니다.",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop", 
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop"
    ],
    reviews: [
      {
        id: 1,
        userId: "user1",
        userName: "클라이머김",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2024-01-15",
        content: "홍대에서 가장 좋은 클라이밍 센터입니다! 루트도 다양하고 시설도 깨끗해요. 특히 초보자 강습이 정말 체계적이라서 추천합니다.",
        helpfulCount: 12,
        isHelpful: false
      },
      {
        id: 2,
        userId: "user2", 
        userName: "암벽소녀",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "2024-01-10",
        content: "시설은 좋은데 주말에는 너무 사람이 많아요. 평일 저녁이 베스트! 샤워실도 깨끗하고 락커룸도 넓어서 좋습니다.",
        helpfulCount: 8,
        isHelpful: true
      },
      {
        id: 3,
        userId: "user3",
        userName: "볼더링매니아",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2024-01-05",
        content: "볼더링 루트가 정말 다양해서 매번 올 때마다 새로운 도전을 할 수 있어요. 난이도별로 잘 구성되어 있고, 카페도 있어서 휴식하기 좋습니다.",
        helpfulCount: 15,
        isHelpful: false
      },
      {
        id: 4,
        userId: "user4",
        userName: "리드클라이머",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "2023-12-28",
        content: "리드 클라이밍 루트가 좀 아쉬워요. 볼더링은 정말 좋은데 리드는 조금 더 다양했으면 좋겠습니다. 그래도 전체적으로 만족!",
        helpfulCount: 6,
        isHelpful: true
      }
    ],
    image: "/images/gym1.jpg"
  },
  {
    id: 2,
    name: "클라이밍파크 강남점",
    address: "서울특별시 강남구 테헤란로 123",
    addressDetail: "강남역 2번 출구 도보 5분",
    lat: 37.5665,
    lng: 127.0278,
    congestion: "normal",
    rating: 4.3,
    reviewCount: 95,
    phone: "02-555-9876",
    website: "https://climbingpark-gangnam.co.kr",
    type: "실내 클라이밍",
    operatingHours: {
      weekdays: "07:00-22:30",
      weekend: "08:00-22:00"
    },
    facilities: ["볼더링", "리드클라이밍", "키즈존", "샤워실"],
    tags: ["패밀리 친화", "키즈 전용", "주차 가능"],
    description: "강남 중심가에 위치한 가족 단위 방문객을 위한 클라이밍 파크입니다. 어린이 전용 구역과 다양한 난이도의 루트를 제공합니다.",
    image: "/images/gym2.jpg"
  },
  {
    id: 3,
    name: "락클라이밍센터 건대점",
    address: "서울특별시 광진구 능동로 120",
    lat: 37.5406,
    lng: 127.0697,
    congestion: "crowded",
    rating: 4.2,
    phone: "02-444-5555",
    operatingHours: "06:30-23:30",
    facilities: ["볼더링", "리드클라이밍", "샤워실", "카페"],
    image: "/images/gym3.jpg"
  },
  {
    id: 4,
    name: "베이스캠프 성수점",
    address: "서울특별시 성동구 성수일로 77",
    lat: 37.5447,
    lng: 127.0557,
    congestion: "comfortable",
    rating: 4.7,
    phone: "02-333-7777",
    operatingHours: "24시간",
    facilities: ["볼더링", "리드클라이밍", "샤워실", "주차장", "카페"],
    image: "/images/gym4.jpg"
  },
  {
    id: 5,
    name: "클라이밍짐 이태원점",
    address: "서울특별시 용산구 이태원로 200",
    lat: 37.5346,
    lng: 126.9947,
    congestion: "normal",
    rating: 4.1,
    phone: "02-222-8888",
    operatingHours: "08:00-22:00",
    facilities: ["볼더링", "샤워실"],
    image: "/images/gym5.jpg"
  },
  {
    id: 6,
    name: "더벽 잠실점",
    address: "서울특별시 송파구 올림픽로 300",
    lat: 37.5133,
    lng: 127.1028,
    congestion: "crowded",
    rating: 4.4,
    phone: "02-111-9999",
    operatingHours: "06:00-24:00",
    facilities: ["볼더링", "리드클라이밍", "샤워실", "주차장", "키즈존"],
    image: "/images/gym6.jpg"
  },
  {
    id: 7,
    name: "암벽등반센터 신촌점",
    address: "서울특별시 서대문구 연세로 50",
    lat: 37.5595,
    lng: 126.9425,
    congestion: "comfortable",
    rating: 4.0,
    phone: "02-777-1111",
    operatingHours: "07:00-23:00",
    facilities: ["볼더링", "리드클라이밍"],
    image: "/images/gym7.jpg"
  },
  {
    id: 8,
    name: "클라이밍월드 노원점",
    address: "서울특별시 노원구 노해로 400",
    lat: 37.6544,
    lng: 127.0617,
    congestion: "normal",
    rating: 4.3,
    phone: "02-888-2222",
    operatingHours: "06:00-22:00",
    facilities: ["볼더링", "리드클라이밍", "샤워실", "주차장"],
    image: "/images/gym8.jpg"
  }
]

// Congestion status helper
export const getCongestionColor = (congestion) => {
  switch (congestion) {
    case 'comfortable':
      return '#4CAF50' // Green
    case 'normal':
      return '#FF9800' // Orange
    case 'crowded':
      return '#F44336' // Red
    default:
      return '#9E9E9E' // Grey
  }
}

export const getCongestionText = (congestion) => {
  switch (congestion) {
    case 'comfortable':
      return '쾌적'
    case 'normal':
      return '보통'
    case 'crowded':
      return '혼잡'
    default:
      return '정보없음'
  }
}