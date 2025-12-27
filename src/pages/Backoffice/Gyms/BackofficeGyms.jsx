import { Box, Typography, Paper, Button } from '@mui/material';
import { Add, FitnessCenter } from '@mui/icons-material';

const BackofficeGyms = () => {
  return (
    <Box>
      {/* Page Header */}
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
          startIcon={<Add />}
          sx={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
            borderRadius: '12px',
            textTransform: 'none',
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)',
            },
          }}
        >
          암장 추가
        </Button>
      </Box>

      {/* Placeholder Content */}
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
          <FitnessCenter sx={{ fontSize: 40, color: '#ff6b35' }} />
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
          암장 관리 기능 준비 중
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: '#9ca3af',
          }}
        >
          암장 목록, 추가, 수정, 삭제 기능이 곧 제공됩니다
        </Typography>
      </Paper>
    </Box>
  );
};

export default BackofficeGyms;
