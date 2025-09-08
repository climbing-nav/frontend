import { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Stack,
  IconButton,
  Link
} from '@mui/material'
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Language as WebsiteIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  Accessible as AccessibleIcon,
  FitnessCenter as GymIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import CongestionBadge from '../../common/CongestionBadge'

/**
 * GymInfo Component
 * Displays comprehensive gym information including ratings, contact details, and facilities
 */
function GymInfo({ gym, showExpandableHours = true }) {
  const [hoursExpanded, setHoursExpanded] = useState(false)

  // Format operating hours for display
  const formatOperatingHours = (hours) => {
    if (!hours) return '영업시간 정보 없음'
    
    if (typeof hours === 'string') return hours
    
    if (typeof hours === 'object') {
      if (hours.weekdays && hours.weekend) {
        return {
          summary: `평일: ${hours.weekdays}`,
          details: [
            `평일: ${hours.weekdays}`,
            `주말: ${hours.weekend}`,
            ...(hours.holidays ? [`공휴일: ${hours.holidays}`] : []),
            ...(hours.notes ? [`비고: ${hours.notes}`] : [])
          ]
        }
      }
      
      if (hours.monday || hours.tuesday) {
        // Detailed daily hours
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        const dayNames = ['월', '화', '수', '목', '금', '토', '일']
        const details = days.map((day, index) => 
          hours[day] ? `${dayNames[index]}: ${hours[day]}` : null
        ).filter(Boolean)
        
        return {
          summary: details[0] || '영업시간 확인 필요',
          details
        }
      }
    }
    
    return '영업시간 정보 없음'
  }

  const operatingHours = useMemo(() => formatOperatingHours(gym.operatingHours), [gym.operatingHours])

  // Handle phone call
  const handleCall = () => {
    if (gym.phone) {
      window.location.href = `tel:${gym.phone}`
    }
  }

  // Handle website visit
  const handleWebsite = () => {
    if (gym.website) {
      window.open(gym.website, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ p: 2 }}
    >
      {/* Gym Name and Rating */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: 1.2,
            mb: 1
          }}
        >
          {gym.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {gym.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating 
                value={gym.rating} 
                precision={0.1} 
                readOnly 
                size="small"
                sx={{ color: 'warning.main' }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {gym.rating.toFixed(1)}
              </Typography>
              {gym.reviewCount && (
                <Typography variant="body2" color="text.secondary">
                  ({gym.reviewCount}개 리뷰)
                </Typography>
              )}
            </Box>
          )}
          
          <CongestionBadge 
            congestion={gym.congestion}
            variant="chip"
            size="small"
          />
        </Box>

        {/* Gym Type and Tags */}
        {(gym.tags || gym.type) && (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {gym.type && (
              <Chip
                icon={<GymIcon />}
                label={gym.type}
                size="small"
                variant="filled"
                sx={{
                  fontSize: '11px',
                  height: 24,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              />
            )}
            {gym.tags && gym.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '11px',
                  height: 24,
                  color: 'text.secondary',
                  borderColor: 'grey.300'
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Contact Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          연락처 및 위치
        </Typography>

        {/* Address */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
          <LocationIcon sx={{ color: 'text.secondary', mt: 0.2, fontSize: 20 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {gym.address || '주소 정보 없음'}
            </Typography>
            {gym.addressDetail && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mt: 0.5 }}>
                {gym.addressDetail}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Phone */}
        {gym.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Link
              component="button"
              variant="body2"
              onClick={handleCall}
              sx={{
                textAlign: 'left',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {gym.phone}
            </Link>
          </Box>
        )}

        {/* Website */}
        {gym.website && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <WebsiteIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Link
              component="button"
              variant="body2"
              onClick={handleWebsite}
              sx={{
                textAlign: 'left',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              웹사이트 방문
            </Link>
          </Box>
        )}
      </Box>

      {/* Operating Hours */}
      <Box sx={{ mb: 3 }}>
        {showExpandableHours && typeof operatingHours === 'object' && operatingHours.details ? (
          <Accordion 
            expanded={hoursExpanded} 
            onChange={() => setHoursExpanded(!hoursExpanded)}
            sx={{ 
              boxShadow: 'none', 
              border: '1px solid', 
              borderColor: 'divider',
              '&:before': { display: 'none' },
              borderRadius: 1
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ px: 0 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2">
                  {operatingHours.summary}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pt: 0 }}>
              <Box sx={{ pl: 3 }}>
                {operatingHours.details.map((detail, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                    {detail}
                  </Typography>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <ScheduleIcon sx={{ color: 'text.secondary', mt: 0.2, fontSize: 20 }} />
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {typeof operatingHours === 'string' ? operatingHours : operatingHours.summary}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Facilities */}
      {gym.facilities && gym.facilities.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            시설 및 편의시설
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {gym.facilities.map((facility, index) => (
              <Chip
                key={index}
                label={facility}
                size="small"
                sx={{
                  fontSize: '11px',
                  height: 24,
                  backgroundColor: 'success.50',
                  color: 'success.main',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Accessibility Features */}
      {gym.accessibility && gym.accessibility.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AccessibleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              접근성 정보
            </Typography>
          </Box>
          <Stack spacing={0.5}>
            {gym.accessibility.map((feature, index) => (
              <Typography key={index} variant="body2" sx={{ pl: 3 }}>
                • {feature}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}

      {/* Description */}
      {gym.description && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            소개
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
            {gym.description}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

GymInfo.propTypes = {
  gym: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    congestion: PropTypes.string.isRequired,
    type: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.string,
    addressDetail: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    operatingHours: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    facilities: PropTypes.arrayOf(PropTypes.string),
    accessibility: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string
  }).isRequired,
  showExpandableHours: PropTypes.bool
}

export default GymInfo