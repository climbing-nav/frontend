import { Box, Typography, Grid, Paper, Button } from '@mui/material'
import PropTypes from 'prop-types'
import GymCard from '../../components/gym/GymCard/GymCard'

const mockGyms = [
  {
    id: 1,
    name: '어썸클라이밍 강남점',
    address: '서울 강남구 테헤란로',
    tags: ['볼더링', '리드'],
    crowdedness: 'comfortable',
    logo: 'A'
  },
  {
    id: 2,
    name: '볼더링스튜디오 홍대',
    address: '서울 마포구 와우산로',
    tags: ['볼더링', '24시간'],
    crowdedness: 'moderate',
    logo: 'B'
  },
  {
    id: 3,
    name: '클라임플러스 성수',
    address: '서울 성동구 성수일로',
    tags: ['볼더링', '루프톱'],
    crowdedness: 'crowded',
    logo: 'C'
  }
]

function HomePage({ onNavigateToGymList }) {
  const handleMoreButtonClick = () => {
    if (onNavigateToGymList) {
      onNavigateToGymList()
    }
  }
  
  return (
    <Box sx={{ width: '393px' }}>
      {/* Quick Stats */}
      <Grid container spacing={1.5} sx={{ px: 2, py: 2.5, mt: -1.25, justifyContent: 'space-around'}}>
        <Grid sx={{ width: '45%'}}>
          <Paper sx={{
            p: 2.5,
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: '#667eea',
              mb: 0.5
            }}>
              24
            </Typography>
            <Typography variant="body2" color="text.secondary">
              서울 암장
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ width: '45%'}}>
          <Paper sx={{
            p: 2.5,
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: '#667eea',
              mb: 0.5
            }}>
              12
            </Typography>
            <Typography variant="body2" color="text.secondary">
              쾌적한 곳
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Map Section */}
      <Box sx={{ px: 2, pb: 2.5 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
            내 주변 암장
          </Typography>
          <Button variant="text" sx={{ color: '#667eea', fontSize: 14, fontWeight: 500 }}>
            전체보기
          </Button>
        </Box>
        
        <Box sx={{
          height: 200,
          background: 'linear-gradient(45deg, #e3f2fd 0%, #f1f8e9 100%)',
          borderRadius: 1.5,
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #e5e7eb'
        }}>
          {/* Map markers */}
          <Box sx={{
            position: 'absolute',
            top: '30%',
            left: '25%',
            width: 24,
            height: 24,
            bgcolor: '#10b981',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }} />
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '60%',
            width: 24,
            height: 24,
            bgcolor: '#f59e0b',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }} />
          <Box sx={{
            position: 'absolute',
            top: '70%',
            left: '35%',
            width: 24,
            height: 24,
            bgcolor: '#ef4444',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }} />
        </Box>
      </Box>

      {/* Gym List */}
      <Box sx={{ px: 2 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
            추천 암장
          </Typography>
          <Button 
            variant="text" 
            sx={{ color: '#667eea', fontSize: 14, fontWeight: 500 }}
            onClick={handleMoreButtonClick}
          >
            더보기
          </Button>
        </Box>
        
        {mockGyms.map((gym) => (
          <GymCard key={gym.id} gym={gym} />
        ))}
      </Box>
    </Box>
  )
}

HomePage.propTypes = {
  onNavigateToGymList: PropTypes.func
}

export default HomePage