import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Fade,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import LocationPickerMap from '../map/LocationPickerMap';

const facilityOptions = [
  { id: 'restroom', label: '화장실' },
  { id: 'shower', label: '샤워실' },
  { id: 'lounge', label: '라운지' },
  { id: 'cafe', label: '카페' },
  { id: 'parking', label: '주차장' },
  { id: 'lockers', label: '락커' },
];

const commonTags = [
  '실내',
  '실외',
  '초보자',
  '중급자',
  '전문가',
  '볼더링',
  '리드클라이밍',
  '톱로프',
];

const gymTypes = [
  { value: 'bouldering', label: '볼더링' },
  { value: 'lead', label: '리드클라이밍' },
  { value: 'toprope', label: '톱로프' },
  { value: 'mixed', label: '복합' },
];

const congestionLevels = [
  { value: 'comfortable', label: '쾌적' },
  { value: 'normal', label: '보통' },
  { value: 'crowded', label: '혼잡' },
];

const accessibilityOptions = [
  '휠체어 접근 가능',
  '엘리베이터 있음',
  '경사로 설치',
  '장애인 화장실',
  '장애인 주차구역',
];

function GymRegistrationModal({ open, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [images, setImages] = useState([]);
  const [logoImage, setLogoImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    addressDetail: '',
    phone: '',
    website: '',
    lat: '',
    lng: '',
    congestion: 'comfortable',
    weekdayHours: '10:00-22:00',
    weekendHours: '09:00-23:00',
    holidays: '',
    operatingNotes: '',
    facilities: [],
    tags: [],
    accessibility: [],
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleFacilityToggle = (facilityId) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter((id) => id !== facilityId)
        : [...prev.facilities, facilityId],
    }));
  };

  const handleTagAdd = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAccessibilityToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      accessibility: prev.accessibility.includes(feature)
        ? prev.accessibility.filter((f) => f !== feature)
        : [...prev.accessibility, feature],
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const logo = {
        id: Math.random(),
        file,
        preview: URL.createObjectURL(file),
      };
      setLogoImage(logo);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      id: Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages.slice(0, 5 - prev.length)]);
  };

  const handleImageRemove = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleLogoRemove = () => {
    if (logoImage) {
      URL.revokeObjectURL(logoImage.preview);
      setLogoImage(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = '암장명은 필수입니다.';
    if (!formData.type) newErrors.type = '암장 유형을 선택해주세요.';
    if (!formData.address.trim()) newErrors.address = '주소는 필수입니다.';
    if (!formData.phone.trim()) newErrors.phone = '전화번호는 필수입니다.';
    if (!formData.congestion) newErrors.congestion = '혼잡도를 선택해주세요.';
    if (formData.facilities.length === 0) newErrors.facilities = '최소 하나의 시설을 선택해주세요.';
    if (formData.tags.length === 0) newErrors.tags = '최소 하나의 특징을 선택해주세요.';

    // 위도/경도 검증 (선택사항이지만 입력했다면 형식 검증)
    if (formData.lat && (isNaN(formData.lat) || formData.lat < -90 || formData.lat > 90)) {
      newErrors.lat = '유효한 위도를 입력해주세요 (-90 ~ 90).';
    }
    if (formData.lng && (isNaN(formData.lng) || formData.lng < -180 || formData.lng > 180)) {
      newErrors.lng = '유효한 경도를 입력해주세요 (-180 ~ 180).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Prepare submission data
      const submissionData = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
        operatingHours: {
          weekdays: formData.weekdayHours,
          weekend: formData.weekendHours,
          holidays: formData.holidays,
          notes: formData.operatingNotes,
        },
        logo: logoImage?.preview,
        images: images.map(img => img.preview),
        rating: 0, // 초기 별점
        reviewCount: 0, // 초기 리뷰 수
      };

      onSubmit(submissionData);

      setSubmitStatus({
        type: 'success',
        message: '암장이 성공적으로 등록되었습니다.',
      });

      setTimeout(() => {
        resetModal();
        onClose();
      }, 1500);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: '등록 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setFormData({
      name: '',
      type: '',
      address: '',
      addressDetail: '',
      phone: '',
      website: '',
      lat: '',
      lng: '',
      congestion: 'comfortable',
      weekdayHours: '10:00-22:00',
      weekendHours: '09:00-23:00',
      holidays: '',
      operatingNotes: '',
      facilities: [],
      tags: [],
      accessibility: [],
      description: '',
    });
    setImages([]);
    setLogoImage(null);
    setErrors({});
    setSubmitStatus(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetModal();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          maxHeight: '85vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          pb: 0,
          pt: 3,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              color: '#1a1f2e',
              fontSize: '20px',
              mb: 0.5,
            }}
          >
            암장 정보 등록
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: '#6b7280',
              display: 'block',
            }}
          >
            새로운 클라이밍 암장 정보를 입력해주세요
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            color: '#6b7280',
            '&:hover': {
              color: '#ff6b35',
              backgroundColor: 'rgba(255, 107, 53, 0.08)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          px: 3,
          py: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 107, 53, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 107, 53, 0.5)',
            },
          },
        }}
      >
        <AnimatePresence mode="wait">
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert
                severity={submitStatus.type}
                icon={
                  submitStatus.type === 'success' ? (
                    <CheckCircleIcon />
                  ) : (
                    <InfoIcon />
                  )
                }
                sx={{
                  mb: 2,
                  borderRadius: '12px',
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                {submitStatus.message}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Stack spacing={3}>
          {/* Logo Upload Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                color: '#1a1f2e',
                mb: 1.5,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              로고 이미지
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {logoImage ? (
                <Box sx={{ position: 'relative' }}>
                  <Paper
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '2px solid #ff6b35',
                    }}
                  >
                    <Box
                      component="img"
                      src={logoImage.preview}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Paper>
                  <IconButton
                    size="small"
                    onClick={handleLogoRemove}
                    disabled={isSubmitting}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: '#ff6b35',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#ff5722',
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Paper
                  component="label"
                  sx={{
                    width: 80,
                    height: 80,
                    border: '2px dashed #e8eaed',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': isSubmitting
                      ? {}
                      : {
                          borderColor: '#ff6b35',
                          backgroundColor: 'rgba(255, 107, 53, 0.02)',
                        },
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                    disabled={isSubmitting}
                  />
                  <ImageIcon sx={{ fontSize: 24, color: '#ff6b35', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '10px' }}>
                    로고
                  </Typography>
                </Paper>
              )}
              <Typography
                variant="caption"
                sx={{
                  color: '#6b7280',
                  fontSize: '12px',
                  flex: 1,
                }}
              >
                암장의 로고 또는 대표 이미지를 업로드하세요
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Basic Information Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                color: '#1a1f2e',
                mb: 2,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              기본 정보
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="암장명"
                placeholder="예: 클라임코어 강남점"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                disabled={isSubmitting}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />

              <FormControl
                fullWidth
                size="small"
                error={!!errors.type}
                disabled={isSubmitting}
              >
                <InputLabel>암장 유형</InputLabel>
                <Select
                  value={formData.type}
                  onChange={handleInputChange('type')}
                  label="암장 유형"
                  sx={{
                    borderRadius: '10px',
                  }}
                >
                  {gymTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>

              <TextField
                fullWidth
                label="주소"
                placeholder="예: 서울시 강남구 역삼동"
                value={formData.address}
                onChange={handleInputChange('address')}
                error={!!errors.address}
                helperText={errors.address}
                disabled={isSubmitting}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />

              <TextField
                fullWidth
                label="상세주소"
                placeholder="예: 5층, 동관"
                value={formData.addressDetail}
                onChange={handleInputChange('addressDetail')}
                disabled={isSubmitting}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />

              <TextField
                fullWidth
                label="전화번호"
                placeholder="예: 02-1234-5678"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={isSubmitting}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />

              <FormControl
                fullWidth
                size="small"
                error={!!errors.congestion}
                disabled={isSubmitting}
              >
                <InputLabel>현재 혼잡도</InputLabel>
                <Select
                  value={formData.congestion}
                  onChange={handleInputChange('congestion')}
                  label="현재 혼잡도"
                  sx={{
                    borderRadius: '10px',
                  }}
                >
                  {congestionLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.congestion && <FormHelperText>{errors.congestion}</FormHelperText>}
              </FormControl>
            </Stack>
          </Box>

          <Divider />

          {/* Location Picker Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                color: '#1a1f2e',
                mb: 1.5,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              암장 위치 선택
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#6b7280',
                mb: 2,
                fontSize: '12px',
              }}
            >
              지도에서 암장 위치를 클릭하거나 주소를 검색하세요
            </Typography>

            <LocationPickerMap
              height={220}
              initialLocation={
                formData.lat && formData.lng
                  ? { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) }
                  : null
              }
              onLocationSelect={(location) => {
                setFormData((prev) => ({
                  ...prev,
                  lat: location.lat.toString(),
                  lng: location.lng.toString(),
                }));
                if (errors.lat || errors.lng) {
                  setErrors((prev) => ({
                    ...prev,
                    lat: '',
                    lng: '',
                  }));
                }
              }}
              disabled={isSubmitting}
            />

            {(errors.lat || errors.lng) && (
              <Typography
                variant="caption"
                sx={{ color: '#ef4444', mt: 1, display: 'block' }}
              >
                {errors.lat || errors.lng}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Facilities & Tags Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                color: '#1a1f2e',
                mb: 2,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              시설 & 특징
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: '#6b7280',
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  시설
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {facilityOptions.map((facility) => (
                    <Chip
                      key={facility.id}
                      label={facility.label}
                      onClick={() => handleFacilityToggle(facility.id)}
                      variant={
                        formData.facilities.includes(facility.id)
                          ? 'filled'
                          : 'outlined'
                      }
                      disabled={isSubmitting}
                      sx={{
                        backgroundColor: formData.facilities.includes(
                          facility.id
                        )
                          ? 'rgba(255, 107, 53, 0.12)'
                          : 'transparent',
                        color: formData.facilities.includes(facility.id)
                          ? '#ff6b35'
                          : '#6b7280',
                        borderColor: formData.facilities.includes(
                          facility.id
                        )
                          ? '#ff6b35'
                          : '#e8eaed',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '12px',
                      }}
                    />
                  ))}
                </Box>
                {errors.facilities && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#ef4444', mt: 1, display: 'block' }}
                  >
                    {errors.facilities}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: '#6b7280',
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  특징
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() =>
                        formData.tags.includes(tag)
                          ? handleTagRemove(tag)
                          : handleTagAdd(tag)
                      }
                      variant={
                        formData.tags.includes(tag) ? 'filled' : 'outlined'
                      }
                      disabled={isSubmitting}
                      sx={{
                        background: formData.tags.includes(tag)
                          ? 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)'
                          : 'transparent',
                        color: formData.tags.includes(tag)
                          ? 'white'
                          : '#6b7280',
                        borderColor: formData.tags.includes(tag)
                          ? 'transparent'
                          : '#e8eaed',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '12px',
                      }}
                    />
                  ))}
                </Box>
                {errors.tags && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#ef4444', mt: 1, display: 'block' }}
                  >
                    {errors.tags}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Accessibility Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                color: '#1a1f2e',
                mb: 2,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              접근성 정보 (선택사항)
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {accessibilityOptions.map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  onClick={() => handleAccessibilityToggle(feature)}
                  variant={
                    formData.accessibility.includes(feature)
                      ? 'filled'
                      : 'outlined'
                  }
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: formData.accessibility.includes(feature)
                      ? 'rgba(16, 185, 129, 0.12)'
                      : 'transparent',
                    color: formData.accessibility.includes(feature)
                      ? '#10b981'
                      : '#6b7280',
                    borderColor: formData.accessibility.includes(feature)
                      ? '#10b981'
                      : '#e8eaed',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '12px',
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Image Upload Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                color: '#1a1f2e',
                mb: 2,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              추가 이미지 업로드
            </Typography>

            <Paper
              component="label"
              sx={{
                border: '2px dashed #e8eaed',
                borderRadius: '12px',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': isSubmitting
                  ? {}
                  : {
                      borderColor: '#ff6b35',
                      backgroundColor: 'rgba(255, 107, 53, 0.02)',
                    },
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
              <CloudUploadIcon
                sx={{
                  fontSize: 32,
                  color: '#ff6b35',
                  mb: 1,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#1a1f2e',
                  mb: 0.5,
                  fontSize: '13px',
                }}
              >
                이미지를 클릭하여 업로드
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#6b7280', fontSize: '11px' }}
              >
                최대 5개, PNG/JPG 형식
              </Typography>
            </Paper>

            {/* Image Preview */}
            {images.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: 1,
                }}
              >
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Paper
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '10px',
                        paddingBottom: '100%',
                      }}
                    >
                      <Box
                        component="img"
                        src={image.preview}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleImageRemove(image.id)}
                        disabled={isSubmitting}
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            )}
          </Box>

          <Divider />

          {/* Additional Information Section */}
          <Accordion
            defaultExpanded={false}
            sx={{
              background: 'transparent',
              boxShadow: 'none',
              border: '1px solid #e8eaed',
              borderRadius: '12px',
              '&.Mui-expanded': {
                margin: 0,
              },
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                py: 1.5,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.02)',
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                  color: '#1a1f2e',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                추가 정보
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                pt: 1.5,
                px: 2,
                pb: 2,
              }}
            >
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="웹사이트"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={handleInputChange('website')}
                  disabled={isSubmitting}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="평일 영업시간"
                  placeholder="10:00-22:00"
                  value={formData.weekdayHours}
                  onChange={handleInputChange('weekdayHours')}
                  disabled={isSubmitting}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="주말 영업시간"
                  placeholder="09:00-23:00"
                  value={formData.weekendHours}
                  onChange={handleInputChange('weekendHours')}
                  disabled={isSubmitting}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="공휴일 영업시간"
                  placeholder="예: 휴무 또는 10:00-18:00"
                  value={formData.holidays}
                  onChange={handleInputChange('holidays')}
                  disabled={isSubmitting}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="영업시간 비고"
                  placeholder="예: 매주 월요일 휴무"
                  value={formData.operatingNotes}
                  onChange={handleInputChange('operatingNotes')}
                  disabled={isSubmitting}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="소개"
                  placeholder="암장에 대해 소개해주세요"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  disabled={isSubmitting}
                  multiline
                  rows={3}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
          borderTop: '1px solid #e8eaed',
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            borderColor: '#e8eaed',
            color: '#6b7280',
            borderRadius: '10px',
            textTransform: 'none',
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#ff6b35',
              backgroundColor: 'rgba(255, 107, 53, 0.02)',
            },
          }}
          variant="outlined"
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            background: isSubmitting
              ? '#d1d5db'
              : 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
            borderRadius: '10px',
            textTransform: 'none',
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            color: 'white',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
            '&:hover': isSubmitting
              ? {}
              : {
                  background: 'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)',
                  boxShadow: '0 6px 16px rgba(255, 107, 53, 0.4)',
                },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
          variant="contained"
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={18} sx={{ color: '#fff' }} />
              등록 중...
            </>
          ) : (
            '등록하기'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GymRegistrationModal;
