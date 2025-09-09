import { useState, useEffect, useCallback } from 'react'
import { 
  TextField, 
  InputAdornment, 
  IconButton,
  Box 
} from '@mui/material'
import { Search, Clear } from '@mui/icons-material'

function SearchBar({ value, onChange, placeholder = "검색...", debounceMs = 300 }) {
  const [inputValue, setInputValue] = useState(value || '')
  
  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onChange && inputValue !== value) {
        onChange(inputValue)
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [inputValue, debounceMs, onChange, value])

  const handleInputChange = useCallback((event) => {
    setInputValue(event.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setInputValue('')
    if (onChange) {
      onChange('')
    }
  }, [onChange])

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (onChange) {
        onChange(inputValue)
      }
    }
  }, [inputValue, onChange])

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#9ca3af' }} />
            </InputAdornment>
          ),
          endAdornment: inputValue ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                size="small"
                sx={{ p: 0.5 }}
                aria-label="검색어 지우기"
              >
                <Clear sx={{ fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          ) : null,
          sx: {
            borderRadius: 2,
            bgcolor: '#f9fafb',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e5e7eb'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#d1d5db'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
              borderWidth: 2
            }
          }
        }}
        sx={{
          '& .MuiInputBase-input': {
            py: 1.5
          }
        }}
      />
    </Box>
  )
}

export default SearchBar