import { useState } from 'react'
import { 
  Box, 
  Chip, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Collapse,
  Divider
} from '@mui/material'
import { 
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear
} from '@mui/icons-material'

const locationOptions = [
  { value: '', label: '전체 지역' },
  { value: '강남', label: '강남구' },
  { value: '홍대', label: '홍대' },
  { value: '신촌', label: '신촌' },
  { value: '건대', label: '건대' },
  { value: '성수', label: '성수동' }
]

const typeOptions = [
  { value: '', label: '전체 유형' },
  { value: '볼더링', label: '볼더링' },
  { value: '리드', label: '리드클라이밍' },
  { value: '스피드', label: '스피드클라이밍' },
  { value: '키즈', label: '키즈클라이밍' }
]

const congestionOptions = [
  { value: '', label: '전체 혼잡도' },
  { value: 'comfortable', label: '쾌적' },
  { value: 'moderate', label: '보통' },
  { value: 'crowded', label: '혼잡' }
]

function FilterControls({ filters, onChange }) {
  const [expanded, setExpanded] = useState(false)

  const handleFilterChange = (filterType, value) => {
    onChange({ [filterType]: value })
  }

  const handleClearFilters = () => {
    onChange({ 
      location: '', 
      type: '', 
      congestion: '' 
    })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const getActiveFilterChips = () => {
    const chips = []
    
    if (filters.location) {
      const label = locationOptions.find(opt => opt.value === filters.location)?.label
      chips.push({
        key: 'location',
        label: label || filters.location,
        onDelete: () => handleFilterChange('location', '')
      })
    }
    
    if (filters.type) {
      const label = typeOptions.find(opt => opt.value === filters.type)?.label
      chips.push({
        key: 'type',
        label: label || filters.type,
        onDelete: () => handleFilterChange('type', '')
      })
    }
    
    if (filters.congestion) {
      const label = congestionOptions.find(opt => opt.value === filters.congestion)?.label
      chips.push({
        key: 'congestion',
        label: label || filters.congestion,
        onDelete: () => handleFilterChange('congestion', '')
      })
    }
    
    return chips
  }

  return (
    <Box>
      {/* Filter Toggle Button */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 1 
      }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            cursor: 'pointer'
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <FilterList sx={{ fontSize: 20, color: '#6b7280' }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
            필터
            {activeFiltersCount > 0 && (
              <Chip 
                label={activeFiltersCount}
                size="small"
                color="primary"
                sx={{ ml: 1, height: 20, fontSize: 11 }}
              />
            )}
          </Typography>
          {expanded ? 
            <ExpandLess sx={{ fontSize: 20, color: '#6b7280' }} /> :
            <ExpandMore sx={{ fontSize: 20, color: '#6b7280' }} />
          }
        </Box>
        
        {activeFiltersCount > 0 && (
          <IconButton 
            onClick={handleClearFilters} 
            size="small"
            sx={{ color: '#6b7280' }}
          >
            <Clear sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {getActiveFilterChips().map(chip => (
              <Chip
                key={chip.key}
                label={chip.label}
                onDelete={chip.onDelete}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: 28 }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Filter Controls */}
      <Collapse in={expanded}>
        <Box sx={{ 
          p: 2, 
          bgcolor: '#f9fafb', 
          borderRadius: 2,
          border: '1px solid #e5e7eb'
        }}>
          <Box sx={{ 
            display: 'grid', 
            gap: 2, 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(3, 1fr)' 
            } 
          }}>
            <FormControl size="small" fullWidth>
              <InputLabel>지역</InputLabel>
              <Select
                value={filters.location}
                label="지역"
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                {locationOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>유형</InputLabel>
              <Select
                value={filters.type}
                label="유형"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {typeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>혼잡도</InputLabel>
              <Select
                value={filters.congestion}
                label="혼잡도"
                onChange={(e) => handleFilterChange('congestion', e.target.value)}
              >
                {congestionOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
      </Collapse>
    </Box>
  )
}

export default FilterControls