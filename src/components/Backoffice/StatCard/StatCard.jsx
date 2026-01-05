import { Box, Paper, Typography } from '@mui/material';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid #e8eaed',
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: color,
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: 24, color }} />
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: '#6b7280', fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 500 }}
        >
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a1f2e', mt: 0.5 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

export default StatCard;
