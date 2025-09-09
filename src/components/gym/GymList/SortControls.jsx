import { 
  Box, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography
} from '@mui/material'
import { 
  SwapVert,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material'

const sortOptions = [
  { value: 'distance', label: '거리순' },
  { value: 'rating', label: '평점순' },
  { value: 'name', label: '이름순' }
]

function SortControls({ sortBy, sortOrder, onChange }) {
  const handleSortFieldChange = (event) => {
    onChange(event.target.value, sortOrder)
  }

  const handleSortOrderToggle = () => {
    onChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const getSortOrderLabel = () => {
    if (sortBy === 'distance') {
      return sortOrder === 'asc' ? '가까운 순' : '먼 순'
    }
    if (sortBy === 'rating') {
      return sortOrder === 'asc' ? '낮은 평점 순' : '높은 평점 순'
    }
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? 'ㄱ-ㅎ' : 'ㅎ-ㄱ'
    }
    return sortOrder === 'asc' ? '오름차순' : '내림차순'
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      mb: 1
    }}>
      <SwapVert sx={{ fontSize: 20, color: '#6b7280' }} />
      
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>정렬</InputLabel>
        <Select
          value={sortBy}
          label="정렬"
          onChange={handleSortFieldChange}
        >
          {sortOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 0.5,
        cursor: 'pointer',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        '&:hover': {
          bgcolor: '#f3f4f6'
        }
      }}
      onClick={handleSortOrderToggle}
      >
        <IconButton 
          size="small" 
          sx={{ p: 0.25 }}
          aria-label="정렬 순서 변경"
        >
          {sortOrder === 'asc' ? 
            <KeyboardArrowUp sx={{ fontSize: 18 }} /> : 
            <KeyboardArrowDown sx={{ fontSize: 18 }} />
          }
        </IconButton>
        <Typography variant="caption" sx={{ 
          color: '#6b7280',
          fontWeight: 500,
          userSelect: 'none'
        }}>
          {getSortOrderLabel()}
        </Typography>
      </Box>
    </Box>
  )
}

export default SortControls