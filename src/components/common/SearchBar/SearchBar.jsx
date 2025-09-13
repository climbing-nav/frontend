import { useState, useEffect, useCallback } from 'react'
import { 
  TextField, 
  InputAdornment, 
  IconButton,
  Box,
  Typography,
  Fade
} from '@mui/material'
import { Search, Clear } from '@mui/icons-material'
import PropTypes from 'prop-types'

/**
 * Reusable SearchBar Component
 * Enhanced version supporting different themes and result display
 * 
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.debounceMs - Debounce delay in milliseconds
 * @param {string} props.variant - Visual variant ('gym' | 'community')
 * @param {number} props.resultCount - Number of search results
 * @param {boolean} props.isSearching - Whether search is in progress
 * @param {boolean} props.showResults - Whether to show result info
 */

function SearchBar({ 
  value, 
  onChange, 
  placeholder = "검색...", 
  debounceMs = 300,
  variant = 'gym',
  resultCount = 0,
  isSearching = false,
  showResults = false
}) {
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
    if (event.key === 'Escape') {
      handleClear()
    }
  }, [inputValue, onChange, handleClear])

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'community':
        return {
          container: {
            px: 2,
            py: 1.5,
            bgcolor: 'white',
            borderBottom: '1px solid #f0f0f0'
          },
          input: {
            borderRadius: 3,
            bgcolor: '#fafafa',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0'
            },
            '&:hover': {
              bgcolor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea'
              }
            },
            '&.Mui-focused': {
              bgcolor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
                borderWidth: 2
              }
            }
          },
          searchIcon: {
            color: inputValue ? '#667eea' : '#999',
            fontSize: 24
          }
        }
      default: // gym
        return {
          container: {
            position: 'relative'
          },
          input: {
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
          },
          searchIcon: {
            color: '#9ca3af'
          }
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Box sx={styles.container}>
      <TextField
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        variant="outlined"
        size={variant === 'community' ? 'medium' : 'small'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={styles.searchIcon} />
            </InputAdornment>
          ),
          endAdornment: inputValue ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                size="small"
                sx={{ 
                  p: 0.5,
                  color: '#999',
                  '&:hover': {
                    color: variant === 'community' ? '#667eea' : '#3b82f6',
                    bgcolor: variant === 'community' ? 'rgba(102, 126, 234, 0.04)' : 'rgba(59, 130, 246, 0.04)'
                  }
                }}
                aria-label="검색어 지우기"
              >
                <Clear sx={{ fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          ) : null,
          sx: styles.input
        }}
        sx={{
          '& .MuiInputBase-input': {
            py: variant === 'community' ? 1.5 : 1.5,
            fontSize: variant === 'community' ? '1rem' : '0.9rem',
            '&::placeholder': {
              color: '#999',
              opacity: 1
            }
          }
        }}
      />

      {/* Search Results Info - Community variant only */}
      {variant === 'community' && showResults && (
        <Fade in={inputValue.trim().length > 0}>
          <Box
            sx={{
              mt: 1,
              display: inputValue.trim().length > 0 ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {isSearching ? (
                <>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      border: '2px solid #f3f3f3',
                      borderTop: '2px solid #667eea',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }}
                  />
                  검색 중...
                </>
              ) : (
                <>
                  <Search sx={{ fontSize: 14, color: '#667eea' }} />
                  {resultCount > 0 ? (
                    <>
                      <strong>{resultCount.toLocaleString()}</strong>개의 검색 결과
                    </>
                  ) : inputValue.trim() ? (
                    '검색 결과가 없습니다'
                  ) : null}
                </>
              )}
            </Typography>

            {/* Search term highlight */}
            {inputValue.trim() && !isSearching && (
              <Typography
                variant="caption"
                sx={{
                  color: '#667eea',
                  bgcolor: 'rgba(102, 126, 234, 0.08)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                '{inputValue}'
              </Typography>
            )}
          </Box>
        </Fade>
      )}
    </Box>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  debounceMs: PropTypes.number,
  variant: PropTypes.oneOf(['gym', 'community']),
  resultCount: PropTypes.number,
  isSearching: PropTypes.bool,
  showResults: PropTypes.bool
}

export default SearchBar