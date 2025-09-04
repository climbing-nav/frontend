// Mock gym data for testing
export const mockGyms = [
  {
    id: 1,
    name: "더클라임 홍대점",
    address: "서울특별시 마포구 홍익로6길 16",
    lat: 37.5563,
    lng: 126.9236,
    congestion: "comfortable", // comfortable, normal, crowded
    rating: 4.5,
    phone: "02-336-1234",
    operatingHours: "06:00-23:00",
    facilities: ["볼더링", "리드클라이밍", "샤워실", "주차장"],
    image: "/images/gym1.jpg"
  },
  {
    id: 2,
    name: "클라이밍파크 강남점",
    address: "서울특별시 강남구 테헤란로 123",
    lat: 37.5665,
    lng: 127.0278,
    congestion: "normal",
    rating: 4.3,
    phone: "02-555-9876",
    operatingHours: "07:00-22:30",
    facilities: ["볼더링", "리드클라이밍", "키즈존"],
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