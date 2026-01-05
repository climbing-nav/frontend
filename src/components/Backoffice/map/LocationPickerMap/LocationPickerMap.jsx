import { useEffect, useRef, useState, useCallback, memo } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Fade,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  MyLocation as MyLocationIcon,
  Place as PlaceIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// 커스텀 마커 SVG 생성 - 암장 위치 선택용 핀
const createLocationMarkerImage = () => {
  const svg = `<svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
      </filter>
      <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff6b35"/>
        <stop offset="100%" style="stop-color:#ff8f66"/>
      </linearGradient>
    </defs>
    <path d="M20 0C9 0 0 9 0 20C0 35 20 52 20 52S40 35 40 20C40 9 31 0 20 0Z"
          fill="url(#pinGradient)" filter="url(#shadow)"/>
    <circle cx="20" cy="20" r="10" fill="white"/>
    <circle cx="20" cy="20" r="5" fill="#ff6b35"/>
    <path d="M16 20L19 23L24 17" stroke="#ff6b35" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
};

// 바운스 애니메이션이 있는 마커
const createAnimatedMarkerImage = () => {
  const svg = `<svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadowAnim" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#ff6b35" flood-opacity="0.4"/>
      </filter>
      <linearGradient id="pinGradientAnim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff6b35"/>
        <stop offset="100%" style="stop-color:#ff5722"/>
      </linearGradient>
    </defs>
    <path d="M20 0C9 0 0 9 0 20C0 35 20 52 20 52S40 35 40 20C40 9 31 0 20 0Z"
          fill="url(#pinGradientAnim)" filter="url(#shadowAnim)"/>
    <circle cx="20" cy="20" r="12" fill="white"/>
    <circle cx="20" cy="20" r="6" fill="#ff6b35">
      <animate attributeName="r" values="6;8;6" dur="1s" repeatCount="indefinite"/>
    </circle>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
};

// 디바운스 유틸리티
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function LocationPickerMap({
  height = 250,
  initialLocation = null,
  onLocationSelect,
  disabled = false,
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedAddress, setSelectedAddress] = useState('');

  // 주소 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 카카오 API 로드 확인
  useEffect(() => {
    let intervalId = null;
    let attempts = 0;
    const maxAttempts = 20;

    const checkKakaoMaps = () => {
      attempts++;
      if (window.kakao?.maps?.LatLng && window.kakao?.maps?.services?.Geocoder) {
        setIsKakaoLoaded(true);
        if (intervalId) clearInterval(intervalId);
        return;
      }

      if (attempts >= maxAttempts) {
        setError('카카오 지도를 로드할 수 없습니다.');
        setIsLoading(false);
        if (intervalId) clearInterval(intervalId);
      }
    };

    checkKakaoMaps();
    intervalId = setInterval(checkKakaoMaps, 300);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // 마커 업데이트 함수
  const updateMarker = useCallback((lat, lng) => {
    if (!mapInstance.current || !window.kakao?.maps) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      const markerImage = new window.kakao.maps.MarkerImage(
        createLocationMarkerImage(),
        new window.kakao.maps.Size(40, 52),
        { offset: new window.kakao.maps.Point(20, 52) }
      );

      const marker = new window.kakao.maps.Marker({
        position,
        image: markerImage,
        zIndex: 100,
      });

      marker.setMap(mapInstance.current);
      markerRef.current = marker;
    }

    // 지도 중심 이동
    mapInstance.current.setCenter(position);
  }, []);

  // 좌표로 주소 가져오기
  const getAddressFromCoords = useCallback((lat, lng) => {
    if (!geocoderRef.current) return;

    const coord = new window.kakao.maps.LatLng(lat, lng);

    geocoderRef.current.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0]?.road_address?.address_name ||
                       result[0]?.address?.address_name || '';
        setSelectedAddress(address);
      }
    });
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isKakaoLoaded || !mapContainer.current || mapInstance.current) return;

    try {
      setIsLoading(true);

      // Geocoder 초기화
      geocoderRef.current = new window.kakao.maps.services.Geocoder();

      // 초기 위치 결정 (initialLocation이 있으면 사용, 없으면 GPS)
      const initializeMap = (centerLat, centerLng) => {
        const options = {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer.current, options);
        mapInstance.current = map;

        // 지도 클릭 이벤트
        window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
          if (disabled) return;

          const latlng = mouseEvent.latLng;
          const lat = latlng.getLat();
          const lng = latlng.getLng();

          setSelectedLocation({ lat, lng });
          updateMarker(lat, lng);
          getAddressFromCoords(lat, lng);

          if (onLocationSelect) {
            onLocationSelect({ lat, lng });
          }
        });

        setIsLoading(false);

        // initialLocation이 있으면 마커 표시
        if (initialLocation?.lat && initialLocation?.lng) {
          setSelectedLocation(initialLocation);
          updateMarker(initialLocation.lat, initialLocation.lng);
          getAddressFromCoords(initialLocation.lat, initialLocation.lng);
        }
      };

      // GPS로 현재 위치 가져오기
      if (initialLocation?.lat && initialLocation?.lng) {
        initializeMap(initialLocation.lat, initialLocation.lng);
      } else if (navigator.geolocation) {
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            initializeMap(latitude, longitude);
            setLocationLoading(false);
          },
          () => {
            // GPS 실패시 서울 시청 기본값
            initializeMap(37.5665, 126.978);
            setLocationLoading(false);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        initializeMap(37.5665, 126.978);
      }
    } catch (err) {
      setError(`지도 초기화 실패: ${err.message}`);
      setIsLoading(false);
    }
  }, [isKakaoLoaded, initialLocation, disabled, updateMarker, getAddressFromCoords, onLocationSelect]);

  // 현재 위치로 이동
  const moveToCurrentLocation = useCallback(() => {
    if (!navigator.geolocation || disabled) return;

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };

        setSelectedLocation(location);
        updateMarker(latitude, longitude);
        getAddressFromCoords(latitude, longitude);

        if (onLocationSelect) {
          onLocationSelect(location);
        }

        setLocationLoading(false);
      },
      (err) => {
        console.error('위치 가져오기 실패:', err);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, [disabled, updateMarker, getAddressFromCoords, onLocationSelect]);

  // 주소 검색 (디바운스 적용)
  const searchAddress = useCallback(
    debounce((query) => {
      if (!query.trim() || !geocoderRef.current) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);

      // 키워드로 장소 검색
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(query, (data, status) => {
        setIsSearching(false);

        if (status === window.kakao.maps.services.Status.OK) {
          const results = data.slice(0, 5).map((place) => ({
            id: place.id,
            name: place.place_name,
            address: place.road_address_name || place.address_name,
            lat: parseFloat(place.y),
            lng: parseFloat(place.x),
          }));
          setSearchResults(results);
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(false);
        }
      });
    }, 300),
    []
  );

  // 검색 결과 선택
  const handleSelectSearchResult = useCallback(
    (result) => {
      if (disabled) return;

      const location = { lat: result.lat, lng: result.lng };
      setSelectedLocation(location);
      setSelectedAddress(result.address);
      updateMarker(result.lat, result.lng);
      setSearchQuery('');
      setShowResults(false);
      setSearchResults([]);

      if (onLocationSelect) {
        onLocationSelect(location);
      }
    },
    [disabled, updateMarker, onLocationSelect]
  );

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchAddress(value);
  };

  // 검색 결과 닫기
  const handleCloseResults = () => {
    setShowResults(false);
    setSearchResults([]);
  };

  // 컴포넌트 정리
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* 주소 검색 입력 */}
      <Box sx={{ mb: 1.5, position: 'relative' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="주소 또는 장소명으로 검색"
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={disabled || isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: isSearching ? (
              <InputAdornment position="end">
                <CircularProgress size={18} />
              </InputAdornment>
            ) : searchQuery ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchQuery('');
                    handleCloseResults();
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#fff',
              fontSize: '14px',
            },
          }}
        />

        {/* 검색 결과 드롭다운 */}
        <Fade in={showResults && searchResults.length > 0}>
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              zIndex: 1100,
              maxHeight: 200,
              overflow: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <List dense disablePadding>
              {searchResults.map((result) => (
                <ListItem key={result.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelectSearchResult(result)}
                    sx={{
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 53, 0.08)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PlaceIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, fontSize: '13px' }}
                        >
                          {result.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ color: '#6b7280', fontSize: '11px' }}
                        >
                          {result.address}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      </Box>

      {/* 지도 컨테이너 */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e8eaed',
        }}
      >
        <div
          ref={mapContainer}
          style={{
            width: '100%',
            height: `${height}px`,
            borderRadius: '12px',
          }}
        />

        {/* 로딩 오버레이 */}
        {(isLoading || locationLoading) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              borderRadius: '12px',
            }}
          >
            <CircularProgress size={32} sx={{ color: '#ff6b35', mb: 1 }} />
            <Typography variant="caption" color="text.secondary">
              {locationLoading ? '현재 위치를 가져오는 중...' : '지도를 불러오는 중...'}
            </Typography>
          </Box>
        )}

        {/* 현재 위치 버튼 */}
        <IconButton
          onClick={moveToCurrentLocation}
          disabled={disabled || isLoading || locationLoading}
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            bgcolor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 50,
            '&:hover': {
              bgcolor: '#fff',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
            },
            '&:disabled': {
              bgcolor: '#f5f5f5',
            },
          }}
        >
          {locationLoading ? (
            <CircularProgress size={20} sx={{ color: '#ff6b35' }} />
          ) : (
            <MyLocationIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
          )}
        </IconButton>

        {/* 안내 메시지 */}
        {!selectedLocation && !isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              right: 60,
              zIndex: 50,
            }}
          >
            <Chip
              label="지도를 클릭하여 암장 위치를 선택하세요"
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                fontSize: '11px',
                fontWeight: 500,
                color: '#1a1f2e',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
          </Box>
        )}
      </Box>

      {/* 선택된 위치 정보 */}
      {selectedLocation && (
        <Fade in>
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              bgcolor: 'rgba(255, 107, 53, 0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 107, 53, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <PlaceIcon sx={{ color: '#ff6b35', fontSize: 18 }} />
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: '#ff6b35', fontSize: '12px' }}
              >
                선택된 위치
              </Typography>
            </Box>
            {selectedAddress && (
              <Typography
                variant="body2"
                sx={{ color: '#1a1f2e', fontSize: '13px', mb: 0.5, fontWeight: 500 }}
              >
                {selectedAddress}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{ color: '#6b7280', fontSize: '11px' }}
            >
              위도: {selectedLocation.lat.toFixed(6)} / 경도: {selectedLocation.lng.toFixed(6)}
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
}

export default memo(LocationPickerMap);
