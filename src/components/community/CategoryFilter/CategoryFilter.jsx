import { useMemo } from 'react'
import {
  Box,
  Tabs,
  Tab,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  All as AllIcon,
  Chat as GeneralIcon,
  Route as RouteIcon,
  Build as GearIcon,
  FitnessCenter as TrainingIcon,
  Event as EventIcon,
  School as TechniqueIcon,
  Security as SafetyIcon,
  Group as CommunityIcon
} from '@mui/icons-material'
import PropTypes from 'prop-types'

/**
 * CategoryFilter Component
 * Tab-based category filter with dynamic filtering of posts by category
 * 
 * @param {Object} props
 * @param {string} props.selectedCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Handler for category selection
 * @param {Array} props.posts - Array of posts for counting
 * @param {boolean} props.showCounts - Whether to show post counts
 */

// Category configuration
const CATEGORIES = [
  {
    value: 'all',
    label: '전체',
    icon: AllIcon,
    color: '#667eea'
  },
  {
    value: 'general',
    label: '일반',
    icon: GeneralIcon,
    color: '#667eea'
  },
  {
    value: 'climbing-tips',
    label: '클라이밍 팁',
    icon: TechniqueIcon,
    color: '#f093fb'
  },
  {
    value: 'gear-review',
    label: '장비 리뷰',
    icon: GearIcon,
    color: '#4facfe'
  },
  {
    value: 'route-info',
    label: '루트 정보',
    icon: RouteIcon,
    color: '#43e97b'
  },
  {
    value: 'gym-review',
    label: '짐 리뷰',
    icon: TrainingIcon,
    color: '#fa709a'
  },
  {
    value: 'technique',
    label: '기술 공유',
    icon: TechniqueIcon,
    color: '#ffecd2'
  },
  {
    value: 'safety',
    label: '안전 수칙',
    icon: SafetyIcon,
    color: '#ff9a9e'
  },
  {
    value: 'community',
    label: '커뮤니티',
    icon: CommunityIcon,
    color: '#a8edea'
  }
]

function CategoryFilter({ 
  selectedCategory = 'all',
  onCategoryChange,
  posts = [],
  showCounts = true
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Calculate post counts for each category
  const categoryCounts = useMemo(() => {
    const counts = {}
    
    // Initialize all categories with 0
    CATEGORIES.forEach(category => {
      counts[category.value] = 0
    })
    
    // Count posts by category
    posts.forEach(post => {
      const category = post.category || 'general'
      if (counts.hasOwnProperty(category)) {
        counts[category]++
      }
      // Also count for 'all'
      counts.all++
    })
    
    return counts
  }, [posts])

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    const category = CATEGORIES[newValue]
    if (category) {
      onCategoryChange(category.value)
    }
  }

  // Get selected tab index
  const selectedIndex = CATEGORIES.findIndex(cat => cat.value === selectedCategory)

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
      }}
    >
      <Tabs
        value={selectedIndex >= 0 ? selectedIndex : 0}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          px: 2,
          minHeight: 56,
          '& .MuiTabs-flexContainer': {
            gap: isMobile ? 1 : 2
          },
          '& .MuiTab-root': {
            minWidth: 'auto',
            minHeight: 56,
            px: isMobile ? 1.5 : 2,
            py: 1,
            textTransform: 'none',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: 500,
            color: '#666',
            borderRadius: '8px 8px 0 0',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(102, 126, 234, 0.04)',
              color: '#667eea'
            },
            '&.Mui-selected': {
              color: '#667eea',
              fontWeight: 600,
              bgcolor: 'rgba(102, 126, 234, 0.08)'
            }
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            bgcolor: '#667eea'
          },
          '& .MuiTabs-scrollButtons': {
            color: '#667eea',
            '&.Mui-disabled': {
              opacity: 0.3
            }
          }
        }}
      >
        {CATEGORIES.map((category, index) => {
          const IconComponent = category.icon
          const count = categoryCounts[category.value] || 0
          
          return (
            <Tab
              key={category.value}
              value={index}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    flexDirection: isMobile ? 'column' : 'row'
                  }}
                >
                  <IconComponent 
                    sx={{ 
                      fontSize: isMobile ? 16 : 18,
                      color: selectedCategory === category.value 
                        ? category.color 
                        : 'inherit',
                      mb: isMobile ? 0.5 : 0
                    }} 
                  />
                  {showCounts && count > 0 && (
                    <Badge
                      badgeContent={count > 99 ? '99+' : count}
                      sx={{
                        '& .MuiBadge-badge': {
                          bgcolor: selectedCategory === category.value 
                            ? category.color 
                            : '#ccc',
                          color: 'white',
                          fontSize: '0.65rem',
                          height: 16,
                          minWidth: 16,
                          borderRadius: '8px',
                          fontWeight: 600,
                          transform: 'scale(0.9)',
                          position: 'static',
                          transform: 'none'
                        }
                      }}
                    />
                  )}
                </Box>
              }
              label={category.label}
              iconPosition={isMobile ? "top" : "start"}
              sx={{
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 0 : 0.5,
                '& .MuiTab-iconWrapper': {
                  mb: isMobile ? 0 : 0
                }
              }}
            />
          )
        })}
      </Tabs>
    </Box>
  )
}

CategoryFilter.propTypes = {
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string
  })),
  showCounts: PropTypes.bool
}

export default CategoryFilter