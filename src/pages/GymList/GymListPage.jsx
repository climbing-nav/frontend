import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, IconButton, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import PropTypes from 'prop-types'
import GymList from '../../components/gym/GymList'
import { fetchGymsStart, fetchGymsSuccess } from '../../store/slices/gymSlice'
import { mockGyms } from '../../data/mockGyms'

function GymListPage({ onNavigateToGymDetail, onBack }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.gym)

  // Load initial gym data
  useEffect(() => {
    dispatch(fetchGymsStart())
    // Simulate API call - replace with actual API call later
    setTimeout(() => {
      dispatch(fetchGymsSuccess({ 
        gyms: mockGyms.map((gym, index) => ({
          ...gym,
          // Map data structure to match GymCard expectations
          crowdedness: gym.congestion, // Map congestion to crowdedness
          distance: 0.5 + (index * 0.3), // Add mock distance
          tags: gym.tags || [gym.type] // Use existing tags or fallback to type
        })), 
        hasMore: false, 
        page: 1 
      }))
    }, 500)
  }, [dispatch])

  return (
    <Box sx={{ 
      width: '393px',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* Header */}
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        bgcolor: 'white',
        borderBottom: '1px solid #e5e7eb',
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <IconButton 
          onClick={onBack}
          size="small"
          sx={{ mr: 1 }}
          aria-label="뒤로 가기"
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
            체육관 리스트
          </Typography>
          <Typography variant="caption" color="text.secondary">
            원하는 체육관을 찾아보세요
          </Typography>
        </Box>
      </Box>

      {/* Gym List Component */}
      <GymList />
    </Box>
  )
}

GymListPage.propTypes = {
  onNavigateToGymDetail: PropTypes.func,
  onBack: PropTypes.func.isRequired
}

export default GymListPage