import { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  FormHelperText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput
} from '@mui/material'
import {
  Save as SaveIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import { addPost, updatePost, fetchPostsStart, fetchPostsSuccess, fetchPostsFailure, createPostAsync } from '../../../store/slices/communitySlice'
import { communityService } from '../../../services/communityService'
import { BOARD_CODE_LIST } from '../../../constants/boardCodes'

/**
 * PostForm Component
 * Creates and edits posts with comprehensive form functionality
 *
 * @param {Object} props
 * @param {Object} props.post - Existing post data for editing (optional)
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {Function} props.onSaveDraft - Save draft handler
 * @param {boolean} props.isLoading - Loading state
 */

// Form validation constants
const VALIDATION_RULES = {
  title: {
    required: '제목을 입력해주세요',
    maxLength: {
      value: 100,
      message: '제목은 100자 이내로 입력해주세요'
    },
    minLength: {
      value: 2,
      message: '제목은 2자 이상 입력해주세요'
    }
  },
  content: {
    required: '내용을 입력해주세요',
    maxLength: {
      value: 2000,
      message: '내용은 2000자 이내로 입력해주세요'
    },
    minLength: {
      value: 10,
      message: '내용은 10자 이상 입력해주세요'
    }
  },
  boardCode: {
    required: '게시판을 선택해주세요'
  }
}

function PostForm({ 
  post = null,
  onSubmit = () => {},
  onCancel = () => {},
  onSaveDraft = () => {},
  isLoading = false
}) {
  const dispatch = useDispatch()
  const { loading: reduxLoading, error: reduxError } = useSelector(state => state.community)
  const isEditing = Boolean(post)

  // Tag input state
  const [tagInput, setTagInput] = useState('')
  
  // Image upload state
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploadError, setUploadError] = useState('')
  
  // Draft save state
  const [lastSaved, setLastSaved] = useState(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    reset,
    getValues
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      boardCode: post?.boardCode || 'FREE',
      tags: post?.tags || [],
      images: post?.images || []
    }
  })

  // Watch field values for character counting
  const watchedTitle = watch('title', '')
  const watchedContent = watch('content', '')
  const watchedTags = watch('tags', [])

  // Draft key for localStorage
  const draftKey = `post-draft-${isEditing ? post?.id : 'new'}`

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(draftKey)
      if (savedDraft && !isEditing) {
        const draft = JSON.parse(savedDraft)
        reset(draft)
        setLastSaved(new Date(draft.lastSaved))
        return true
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
    return false
  }, [draftKey, reset, isEditing])

  // Save draft to localStorage with debouncing
  const saveDraft = useCallback((data, manual = false) => {
    if (!autoSaveEnabled && !manual) return
    
    try {
      const draftData = {
        ...data,
        lastSaved: Date.now()
      }
      localStorage.setItem(draftKey, JSON.stringify(draftData))
      setLastSaved(new Date())
      
      if (manual) {
        // Show save confirmation
        console.log('Draft saved manually')
      }
    } catch (error) {
      console.error('Error saving draft:', error)
    }
  }, [draftKey, autoSaveEnabled])

  // Auto-save with debouncing
  const debouncedSaveDraft = useCallback(
    debounce((data) => saveDraft(data), 2000),
    [saveDraft]
  )

  // Update form when post prop changes (for editing)
  useEffect(() => {
    if (post) {
      reset({
        title: post.title || '',
        content: post.content || '',
        boardCode: post.boardCode || 'FREE',
        tags: post.tags || [],
        images: post.images || []
      })
    } else {
      // Try to load draft for new posts
      loadDraft()
    }
  }, [post, reset, loadDraft])

  // Auto-save on form changes
  useEffect(() => {
    const subscription = watch((data) => {
      // 제출 완료 후에는 auto-save 비활성화
      if (!isEditing && !isSubmitted && (data.title?.trim() || data.content?.trim())) {
        debouncedSaveDraft(data)
      }
    })
    return () => {
      subscription.unsubscribe()
      // ⭐ 컴포넌트 unmount 시 pending된 auto-save 취소
      debouncedSaveDraft.cancel?.()
    }
  }, [watch, debouncedSaveDraft, isEditing, isSubmitted])

  // Debounce utility function with cancel method
  function debounce(func, wait) {
    let timeout
    const executedFunction = function(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
    executedFunction.cancel = function() {
      clearTimeout(timeout)
    }
    return executedFunction
  }

  // Tag management functions
  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (!trimmedTag) return
    
    const currentTags = getValues('tags')
    
    // Validate tag
    if (trimmedTag.length > 20) {
      alert('태그는 20자 이내로 입력해주세요')
      return
    }
    
    if (currentTags.includes(trimmedTag)) {
      alert('이미 추가된 태그입니다')
      return
    }
    
    if (currentTags.length >= 5) {
      alert('태그는 최대 5개까지 추가할 수 있습니다')
      return
    }
    
    setValue('tags', [...currentTags, trimmedTag])
    setTagInput('')
  }

  const removeTag = (tagToRemove) => {
    const currentTags = getValues('tags')
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTag()
    }
  }

  // Image upload functions
  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    if (!allowedTypes.includes(file.type)) {
      return '지원되는 이미지 형식: JPG, PNG, WebP'
    }
    
    if (file.size > maxSize) {
      return '이미지 크기는 5MB 이하여야 합니다'
    }
    
    return null
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    setUploadError('')
    
    if (imageFiles.length + files.length > 3) {
      setUploadError('최대 3개의 이미지만 업로드할 수 있습니다')
      return
    }
    
    const validFiles = []
    const validPreviews = []
    
    for (const file of files) {
      const error = validateImage(file)
      if (error) {
        setUploadError(error)
        return
      }
      
      validFiles.push(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        validPreviews.push({
          file,
          url: e.target.result,
          id: Date.now() + Math.random()
        })
        
        if (validPreviews.length === validFiles.length) {
          setImageFiles(prev => [...prev, ...validFiles])
          setImagePreviews(prev => [...prev, ...validPreviews])
          setValue('images', [...getValues('images'), ...validFiles])
        }
      }
      reader.readAsDataURL(file)
    }
    
    // Reset input value
    event.target.value = ''
  }

  const removeImage = (indexToRemove) => {
    const newImageFiles = imageFiles.filter((_, index) => index !== indexToRemove)
    const newImagePreviews = imagePreviews.filter((_, index) => index !== indexToRemove)
    
    setImageFiles(newImageFiles)
    setImagePreviews(newImagePreviews)
    setValue('images', newImageFiles)
    setUploadError('')
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    const mockEvent = { target: { files } }
    handleImageUpload(mockEvent)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const onFormSubmit = async (data) => {
    try {
      // ⭐ 제출 시작 시 즉시 auto-save 비활성화 및 draft 삭제
      setIsSubmitted(true)
      if (!isEditing) {
        localStorage.removeItem(draftKey)
        setLastSaved(null)
      }

      // 백엔드 API 스펙에 맞는 데이터 구조
      const postData = {
        title: data.title,
        content: data.content,
        boardCode: data.boardCode
      }

      if (isEditing) {
        // 게시글 수정 - 이미지 파일 포함
        const updatedPost = await communityService.updatePost(post.id, postData, imageFiles)

        // Redux store 업데이트는 하지 않음 (App.jsx에서 fetchPostAsync로 다시 조회)
        // dispatch(updatePost(updatedPost))

        // Reset form after successful update
        reset()
        setImageFiles([])
        setImagePreviews([])
        setTagInput('')

        // Call parent onSubmit if provided
        onSubmit(updatedPost)
      } else {
        // 게시글 생성 - 이미지 파일 포함
        const response = await communityService.createPost(postData, imageFiles)

        // 성공 시 Redux store에 반영하기 위해 게시글 목록 다시 조회
        if (response) {
          // Reset form after successful submission
          reset()
          setImageFiles([])
          setImagePreviews([])
          setTagInput('')

          // Call parent onSubmit if provided
          onSubmit(response)
        } else {
          // 제출 실패 시 플래그 리셋 (다시 auto-save 활성화)
          setIsSubmitted(false)
        }
      }

    } catch (error) {
      console.error(isEditing ? '게시글 수정 실패:' : '게시글 작성 실패:', error)
      // 에러 발생 시 플래그 리셋 (다시 auto-save 활성화)
      setIsSubmitted(false)
      // 사용자에게 에러 메시지 표시
      setUploadError(error.response?.data?.message || '게시글 작성에 실패했습니다')
    }
  }

  const handleSaveDraft = () => {
    const currentValues = {
      title: watchedTitle,
      content: watchedContent,
      boardCode: watch('boardCode'),
      tags: watch('tags'),
      images: watch('images')
    }
    saveDraft(currentValues, true)
    onSaveDraft(currentValues)
  }

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey)
      setLastSaved(null)
      reset()
      setImageFiles([])
      setImagePreviews([])
      setTagInput('')
    } catch (error) {
      console.error('Error clearing draft:', error)
    }
  }

  return (
    <Container 
      maxWidth={false}
      sx={{ 
        width: '393px',
        px: 2,
        py: 3,
        minHeight: '100vh',
        bgcolor: '#fafafa'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'white',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: '#333',
              mb: 1
            }}
          >
            {isEditing ? '게시글 수정' : '새 게시글 작성'}
          </Typography>
          
          {/* Draft Status */}
          {lastSaved && !isEditing && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              • 임시저장됨: {lastSaved.toLocaleTimeString()}
            </Typography>
          )}
          
          {/* Error Display */}
          {reduxError && (
            <Typography 
              variant="body2" 
              color="error" 
              sx={{ 
                mt: 1,
                p: 1,
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(244, 67, 54, 0.2)'
              }}
            >
              {reduxError}
            </Typography>
          )}
        </Box>

        {/* Form */}
        <Box 
          component="form" 
          onSubmit={handleSubmit(onFormSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {/* Title Input */}
          <Box>
            <Controller
              name="title"
              control={control}
              rules={VALIDATION_RULES.title}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="제목"
                  variant="outlined"
                  fullWidth
                  placeholder="게시글 제목을 입력하세요"
                  error={!!errors.title}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 0.5
            }}>
              {errors.title && (
                <FormHelperText error sx={{ margin: 0 }}>
                  {errors.title.message}
                </FormHelperText>
              )}
              <Typography 
                variant="caption" 
                color={watchedTitle.length > 100 ? 'error' : 'text.secondary'}
                sx={{ 
                  ml: 'auto',
                  fontSize: '0.75rem',
                  fontWeight: watchedTitle.length > 90 ? 600 : 400
                }}
              >
                {watchedTitle.length}/100
              </Typography>
            </Box>
          </Box>

          {/* Content Textarea */}
          <Box>
            <Controller
              name="content"
              control={control}
              rules={VALIDATION_RULES.content}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="내용"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={8}
                  placeholder="게시글 내용을 입력하세요"
                  error={!!errors.content}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 0.5
            }}>
              {errors.content && (
                <FormHelperText error sx={{ margin: 0 }}>
                  {errors.content.message}
                </FormHelperText>
              )}
              <Typography 
                variant="caption" 
                color={watchedContent.length > 2000 ? 'error' : 'text.secondary'}
                sx={{ 
                  ml: 'auto',
                  fontSize: '0.75rem',
                  fontWeight: watchedContent.length > 1800 ? 600 : 400
                }}
              >
                {watchedContent.length}/2000
              </Typography>
            </Box>
          </Box>

          {/* Board Code Selection */}
          <Box>
            <Controller
              name="boardCode"
              control={control}
              rules={VALIDATION_RULES.boardCode}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.boardCode}>
                  <InputLabel id="boardCode-label">게시판</InputLabel>
                  <Select
                    {...field}
                    labelId="boardCode-label"
                    label="게시판"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    {BOARD_CODE_LIST.map((board) => (
                      <MenuItem key={board.code} value={board.code}>
                        {board.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.boardCode && (
                    <FormHelperText>{errors.boardCode.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>

          {/* Tag Input System */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>
              태그
            </Typography>
            
            {/* Tag Input Field */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="태그를 입력하세요 (최대 20자)"
                variant="outlined"
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                inputProps={{ maxLength: 20 }}
              />
              <Button
                onClick={addTag}
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                disabled={!tagInput.trim() || watchedTags.length >= 5}
                sx={{
                  borderRadius: 2,
                  minWidth: 80,
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5a6fd8',
                    bgcolor: 'rgba(102, 126, 234, 0.04)'
                  }
                }}
              >
                추가
              </Button>
            </Box>

            {/* Tag Display */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40 }}>
              {watchedTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => removeTag(tag)}
                  deleteIcon={<CloseIcon />}
                  sx={{
                    bgcolor: '#667eea',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: 'white'
                      }
                    }
                  }}
                />
              ))}
              {watchedTags.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ py: 1 }}>
                  태그를 추가해보세요 (최대 5개)
                </Typography>
              )}
            </Box>

            <Typography 
              variant="caption" 
              color={watchedTags.length >= 5 ? 'error' : 'text.secondary'}
              sx={{ mt: 0.5, display: 'block' }}
            >
              {watchedTags.length}/5개 태그
            </Typography>
          </Box>

          {/* Image Upload Section */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>
              이미지 첨부
            </Typography>
            
            {/* Upload Area */}
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: '2px dashed #ddd',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                bgcolor: '#fafafa',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#667eea',
                  bgcolor: 'rgba(102, 126, 234, 0.02)'
                }
              }}
              onClick={() => document.getElementById('image-upload').click()}
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              
              <CloudUploadIcon 
                sx={{ 
                  fontSize: 48, 
                  color: '#bbb', 
                  mb: 1,
                  display: 'block',
                  mx: 'auto'
                }} 
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                이미지를 드래그하여 올리거나 클릭하여 선택하세요
              </Typography>
              
              <Typography variant="caption" color="text.secondary">
                JPG, PNG, WebP 형식, 최대 5MB, 최대 3개
              </Typography>
            </Box>

            {/* Upload Error */}
            {uploadError && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {uploadError}
              </Typography>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  업로드된 이미지 ({imagePreviews.length}/3)
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {imagePreviews.map((preview, index) => (
                    <Box
                      key={preview.id}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid #ddd'
                      }}
                    >
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      
                      {/* Delete Button */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(255, 0, 0, 0.8)'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                      >
                        <DeleteIcon 
                          sx={{ 
                            fontSize: 16, 
                            color: 'white' 
                          }} 
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1.5,
              mt: 2,
              flexDirection: 'column'
            }}
          >
            {/* Primary Actions */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SendIcon />}
                disabled={isLoading || reduxLoading || !isValid || !watchedTitle.trim() || !watchedContent.trim()}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#667eea',
                  '&:hover': {
                    bgcolor: '#5a6fd8'
                  },
                  '&:disabled': {
                    bgcolor: '#ccc',
                    color: '#666'
                  }
                }}
              >
                {reduxLoading ? '처리 중...' : isEditing ? '수정하기' : '게시하기'}
              </Button>

              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleSaveDraft}
                disabled={isLoading || reduxLoading}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5a6fd8',
                    bgcolor: 'rgba(102, 126, 234, 0.04)'
                  }
                }}
              >
                임시저장
              </Button>
            </Box>

            {/* Secondary Actions */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {lastSaved && !isEditing && (
                <Button
                  variant="text"
                  onClick={clearDraft}
                  disabled={isLoading || reduxLoading}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    color: '#f44336',
                    '&:hover': {
                      bgcolor: 'rgba(244, 67, 54, 0.04)'
                    }
                  }}
                >
                  임시저장 삭제
                </Button>
              )}
              
              <Button
                variant="text"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                disabled={isLoading || reduxLoading}
                sx={{
                  flex: lastSaved && !isEditing ? 1 : 'auto',
                  py: 1.5,
                  borderRadius: 2,
                  color: '#666'
                }}
              >
                취소
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

PostForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    content: PropTypes.string,
    boardCode: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
    likes: PropTypes.number,
    comments: PropTypes.number,
    views: PropTypes.number
  }),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onSaveDraft: PropTypes.func,
  isLoading: PropTypes.bool
}

export default PostForm