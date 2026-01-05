import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  FitnessCenter as GymIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import GymRegistrationModal from '../../../components/Backoffice/GymRegistrationModal/GymRegistrationModal';

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
    // 여기서 API 호출을 통해 암장 정보를 저장합니다
    console.log('암장 등록:', formData);

    // 성공 후 목록에 추가
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

  return (
    <Box>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700,
                color: '#1a1f2e',
                mb: 1,
              }}
            >
              암장 관리
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: '#6b7280',
              }}
            >
              등록된 클라이밍 암장을 관리합니다
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)',
                boxShadow: '0 6px 16px rgba(255, 107, 53, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            암장 추가
          </Button>
        </Box>
      </motion.div>

      {/* Empty State */}
      {gyms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '2px dashed #e8eaed',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 143, 102, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2,
              }}
            >
              <GymIcon sx={{ fontSize: 40, color: '#ff6b35' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                color: '#1a1f2e',
                mb: 1,
              }}
            >
              등록된 암장이 없습니다
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: '#9ca3af',
                mb: 3,
              }}
            >
              "암장 추가" 버튼을 클릭하여 새로운 암장을 등록하세요
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              sx={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
                borderRadius: '10px',
                textTransform: 'none',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)',
                },
              }}
            >
              첫 암장 등록하기
            </Button>
          </Paper>
        </motion.div>
      ) : (
        /* Gyms Table */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid #e8eaed',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
                  <TableCell
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 600,
                      color: '#1a1f2e',
                      borderBottom: '1px solid #e8eaed',
                    }}
                  >
                    암장명
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 600,
                      color: '#1a1f2e',
                      borderBottom: '1px solid #e8eaed',
                    }}
                  >
                    유형
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 600,
                      color: '#1a1f2e',
                      borderBottom: '1px solid #e8eaed',
                    }}
                  >
                    위치
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 600,
                      color: '#1a1f2e',
                      borderBottom: '1px solid #e8eaed',
                    }}
                  >
                    연락처
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 600,
                      color: '#1a1f2e',
                      borderBottom: '1px solid #e8eaed',
                    }}
                  >
                    혼잡도
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 600,
                      color: '#1a1f2e',
                      borderBottom: '1px solid #e8eaed',
                    }}
                  >
                    등록일
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 600,
                      color: '#1a1f2e',
                      borderBottom: '1px solid #e8eaed',
                    }}
                  >
                    작업
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gyms.map((gym) => {
                  // 암장 유형 한글 변환
                  const typeLabels = {
                    bouldering: '볼더링',
                    lead: '리드',
                    toprope: '톱로프',
                    mixed: '복합',
                  };

                  // 혼잡도 라벨과 색상
                  const congestionConfig = {
                    comfortable: { label: '쾌적', color: '#10b981' },
                    normal: { label: '보통', color: '#f59e0b' },
                    crowded: { label: '혼잡', color: '#ef4444' },
                  };

                  const congestion = congestionConfig[gym.congestion] || congestionConfig.comfortable;

                  return (
                    <TableRow
                      key={gym.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 53, 0.02)',
                        },
                        borderBottom: '1px solid #e8eaed',
                      }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 500,
                          color: '#1a1f2e',
                        }}
                      >
                        {gym.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: '#6b7280',
                          fontSize: '14px',
                        }}
                      >
                        {typeLabels[gym.type] || '-'}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: '#6b7280',
                          fontSize: '14px',
                        }}
                      >
                        {gym.address}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: '#6b7280',
                          fontSize: '14px',
                        }}
                      >
                        {gym.phone}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={congestion.label}
                          size="small"
                          sx={{
                            backgroundColor: congestion.color,
                            color: 'white',
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: '#9ca3af',
                          fontSize: '13px',
                        }}
                      >
                        {gym.createdAt}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          sx={{
                            color: '#6b7280',
                            '&:hover': {
                              color: '#ff6b35',
                              backgroundColor: 'rgba(255, 107, 53, 0.08)',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteGym(gym.id)}
                          sx={{
                            color: '#6b7280',
                            '&:hover': {
                              color: '#ef4444',
                              backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
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
