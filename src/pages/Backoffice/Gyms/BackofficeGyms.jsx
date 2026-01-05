import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Avatar,
  Tooltip,
  ButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  FitnessCenter as GymIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  LocalParking as ParkingIcon,
  Wc as RestroomIcon,
  Shower as ShowerIcon,
  Weekend as LoungeIcon,
  LocalCafe as CafeIcon,
  Lock as LockersIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import GymRegistrationModal from '../../../components/Backoffice/GymRegistrationModal/GymRegistrationModal';

// Facility icon mapping
const facilityIcons = {
  restroom: RestroomIcon,
  shower: ShowerIcon,
  lounge: LoungeIcon,
  cafe: CafeIcon,
  parking: ParkingIcon,
  lockers: LockersIcon,
};

const facilityLabels = {
  restroom: '화장실',
  shower: '샤워실',
  lounge: '라운지',
  cafe: '카페',
  parking: '주차장',
  lockers: '락커',
};

const BackofficeGyms = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [gyms, setGyms] = useState([]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmitGym = (formData) => {
    console.log('암장 등록:', formData);

    const newGym = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      createdAt: new Date().toLocaleDateString('ko-KR'),
    };
    setGyms((prev) => [newGym, ...prev]);
    setModalOpen(false);
  };

  const handleDeleteGym = (id) => {
    setGyms((prev) => prev.filter((gym) => gym.id !== id));
  };

  const handleCongestionChange = (gymId, newCongestion) => {
    setGyms((prev) =>
      prev.map((gym) =>
        gym.id === gymId ? { ...gym, congestion: newCongestion } : gym
      )
    );
  };

  // Type labels
  const typeLabels = {
    bouldering: '볼더링',
    lead: '리드클라이밍',
    toprope: '톱로프',
    mixed: '복합',
  };

  // Congestion config
  const congestionConfig = {
    comfortable: {
      label: '쾌적',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      icon: '😊',
    },
    normal: {
      label: '보통',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      icon: '😐',
    },
    crowded: {
      label: '혼잡',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      icon: '😓',
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700,
                color: '#1a1f2e',
                mb: 0.5,
                letterSpacing: '-0.5px',
              }}
            >
              암장 관리
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: '#6b7280',
                fontSize: '15px',
              }}
            >
              {gyms.length}개의 등록된 클라이밍 암장을 관리합니다
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
              borderRadius: '14px',
              textTransform: 'none',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              px: 3,
              py: 1.25,
              boxShadow: '0 4px 16px rgba(255, 107, 53, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)',
                boxShadow: '0 6px 20px rgba(255, 107, 53, 0.35)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            암장 추가
          </Button>
        </Box>
      </motion.div>

      {/* Empty State */}
      {gyms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 8,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '2px dashed #e8eaed',
              borderRadius: '24px',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '20px',
                background:
                  'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 143, 102, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3,
              }}
            >
              <GymIcon sx={{ fontSize: 50, color: '#ff6b35' }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700,
                color: '#1a1f2e',
                mb: 1.5,
              }}
            >
              등록된 암장이 없습니다
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: '#9ca3af',
                mb: 4,
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              "암장 추가" 버튼을 클릭하여 새로운 클라이밍 암장을 등록하고 관리를
              시작하세요
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
                borderRadius: '12px',
                textTransform: 'none',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              첫 암장 등록하기
            </Button>
          </Paper>
        </motion.div>
      ) : (
        /* Gyms Card Grid */
        <Grid
          container
          spacing={3}
          sx={{
            width: '100%',
            mx: 'auto',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence mode="popLayout">
            {gyms.map((gym, index) => {
              const congestion =
                congestionConfig[gym.congestion] ||
                congestionConfig.comfortable;
              const typeLabel = typeLabels[gym.type] || gym.type;

              return (
                <Grid item xs={12} md={6} lg={4} key={gym.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    layout
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: '20px',
                        border: '1px solid #e8eaed',
                        background:
                          'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'visible',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                          borderColor: 'rgba(255, 107, 53, 0.3)',
                        },
                      }}
                    >
                      {/* Card Header with Logo */}
                      <Box
                        sx={{
                          p: 3,
                          pb: 2,
                          background:
                            'linear-gradient(135deg, rgba(255, 107, 53, 0.03) 0%, rgba(255, 143, 102, 0.01) 100%)',
                          borderBottom: '1px solid #f3f4f6',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          {/* Logo */}
                          {gym.logo ? (
                            <Avatar
                              src={gym.logo}
                              variant="rounded"
                              sx={{
                                width: 64,
                                height: 64,
                                border: '2px solid #fff',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                              }}
                            />
                          ) : (
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 64,
                                height: 64,
                                background:
                                  'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
                                fontSize: '24px',
                                fontWeight: 700,
                                fontFamily: '"Outfit", sans-serif',
                              }}
                            >
                              {gym.name.charAt(0)}
                            </Avatar>
                          )}

                          {/* Name & Type */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 700,
                                color: '#1a1f2e',
                                fontSize: '18px',
                                mb: 0.5,
                                letterSpacing: '-0.3px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {gym.name}
                            </Typography>
                            <Chip
                              label={typeLabel}
                              size="small"
                              sx={{
                                height: '22px',
                                fontSize: '11px',
                                fontWeight: 600,
                                fontFamily: '"DM Sans", sans-serif',
                                background:
                                  'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 143, 102, 0.05) 100%)',
                                color: '#ff6b35',
                                border: '1px solid rgba(255, 107, 53, 0.2)',
                              }}
                            />
                          </Box>

                          {/* Actions */}
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="수정">
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#6b7280',
                                  '&:hover': {
                                    color: '#ff6b35',
                                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="삭제">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteGym(gym.id)}
                                sx={{
                                  color: '#6b7280',
                                  '&:hover': {
                                    color: '#ef4444',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        {/* Contact Info */}
                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <LocationIcon
                              sx={{ fontSize: 18, color: '#9ca3af', mt: 0.2 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: '"DM Sans", sans-serif',
                                color: '#6b7280',
                                fontSize: '13px',
                                lineHeight: 1.6,
                                flex: 1,
                              }}
                            >
                              {gym.address}
                              {gym.addressDetail && ` ${gym.addressDetail}`}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <PhoneIcon
                              sx={{ fontSize: 18, color: '#9ca3af' }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: '"DM Sans", sans-serif',
                                color: '#6b7280',
                                fontSize: '13px',
                              }}
                            >
                              {gym.phone}
                            </Typography>
                          </Box>

                          {gym.operatingHours && (
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                              <ScheduleIcon
                                sx={{ fontSize: 18, color: '#9ca3af' }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    color: '#6b7280',
                                    fontSize: '13px',
                                  }}
                                >
                                  평일: {gym.operatingHours.weekdays}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    color: '#6b7280',
                                    fontSize: '13px',
                                  }}
                                >
                                  주말: {gym.operatingHours.weekend}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* Facilities */}
                        {gym.facilities && gym.facilities.length > 0 && (
                          <Box sx={{ mb: 2.5 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 600,
                                color: '#9ca3af',
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                display: 'block',
                                mb: 1,
                              }}
                            >
                              시설
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                              }}
                            >
                              {gym.facilities.slice(0, 6).map((facilityId) => {
                                const Icon = facilityIcons[facilityId];
                                const label = facilityLabels[facilityId];
                                return Icon ? (
                                  <Tooltip key={facilityId} title={label}>
                                    <Chip
                                      icon={<Icon sx={{ fontSize: 14 }} />}
                                      label={label}
                                      size="small"
                                      sx={{
                                        height: '26px',
                                        fontSize: '11px',
                                        fontFamily: '"DM Sans", sans-serif',
                                        backgroundColor: '#f3f4f6',
                                        color: '#6b7280',
                                        '&:hover': {
                                          backgroundColor: '#e5e7eb',
                                        },
                                      }}
                                    />
                                  </Tooltip>
                                ) : null;
                              })}
                            </Box>
                          </Box>
                        )}

                        {/* Tags */}
                        {gym.tags && gym.tags.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 600,
                                color: '#9ca3af',
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                display: 'block',
                                mb: 1,
                              }}
                            >
                              특징
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.75,
                              }}
                            >
                              {gym.tags.slice(0, 4).map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  sx={{
                                    height: '24px',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    fontFamily: '"DM Sans", sans-serif',
                                    background:
                                      'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(255, 143, 102, 0.04) 100%)',
                                    color: '#ff6b35',
                                    border: 'none',
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* Congestion Control */}
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 600,
                              color: '#9ca3af',
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              display: 'block',
                              mb: 1.5,
                            }}
                          >
                            현재 혼잡도
                          </Typography>
                          <ButtonGroup
                            fullWidth
                            variant="outlined"
                            sx={{
                              borderRadius: '12px',
                              overflow: 'hidden',
                              boxShadow: 'none',
                            }}
                          >
                            {Object.entries(congestionConfig).map(
                              ([key, config]) => (
                                <Button
                                  key={key}
                                  onClick={() =>
                                    handleCongestionChange(gym.id, key)
                                  }
                                  sx={{
                                    py: 1.25,
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    fontFamily: '"DM Sans", sans-serif',
                                    textTransform: 'none',
                                    borderColor:
                                      gym.congestion === key
                                        ? config.color
                                        : '#e5e7eb',
                                    backgroundColor:
                                      gym.congestion === key
                                        ? config.bg
                                        : 'transparent',
                                    color:
                                      gym.congestion === key
                                        ? config.color
                                        : '#9ca3af',
                                    position: 'relative',
                                    outline: 'none',
                                    '&:hover': {
                                      backgroundColor: config.bg,
                                      borderColor: config.color,
                                      color: config.color,
                                      outline: 'none',
                                    },
                                    '&:focus': {
                                      outline: 'none',
                                    },
                                    '&:focus-visible': {
                                      outline: 'none',
                                    },
                                    '&:active': {
                                      outline: 'none',
                                    },
                                    transition: 'all 0.2s ease',
                                    '&::before':
                                      gym.congestion === key
                                        ? {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: config.color,
                                          }
                                        : {},
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.75,
                                    }}
                                  >
                                    <span style={{ fontSize: '16px' }}>
                                      {config.icon}
                                    </span>
                                    {config.label}
                                  </Box>
                                </Button>
                              )
                            )}
                          </ButtonGroup>
                        </Box>

                        {/* Footer Info */}
                        <Box
                          sx={{
                            mt: 2.5,
                            pt: 2,
                            borderTop: '1px solid #f3f4f6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              color: '#9ca3af',
                              fontSize: '11px',
                            }}
                          >
                            등록일: {gym.createdAt}
                          </Typography>
                          {gym.rating !== undefined && (
                            <Box
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily: '"DM Sans", sans-serif',
                                  fontWeight: 600,
                                  color: '#ff6b35',
                                  fontSize: '12px',
                                }}
                              >
                                ⭐ {gym.rating.toFixed(1)}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily: '"DM Sans", sans-serif',
                                  color: '#9ca3af',
                                  fontSize: '11px',
                                }}
                              >
                                ({gym.reviewCount || 0})
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>
      )}

      {/* Gym Registration Modal */}
      <GymRegistrationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitGym}
      />
    </Box>
  );
};

export default BackofficeGyms;
