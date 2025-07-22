import { Box, Typography, Chip, Paper } from '@mui/material'
import { ThumbUp, Chat, Visibility } from '@mui/icons-material'

function PostCard({ post }) {
  return (
    <Paper sx={{
      borderRadius: 1.5,
      p: 2,
      my: 1.5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1
      }}>
        <Chip
          label={post.category}
          size="small"
          sx={{
            bgcolor: '#667eea',
            color: 'white',
            fontSize: 12,
            fontWeight: 500,
            height: 24
          }}
        />
        <Typography variant="caption" sx={{
          fontSize: 12,
          color: '#9ca3af'
        }}>
          {post.time}
        </Typography>
      </Box>

      <Typography variant="body1" sx={{
        fontSize: 16,
        fontWeight: 600,
        color: '#1f2937',
        mb: 1,
        lineHeight: 1.4
      }}>
        {post.title}
      </Typography>

      <Typography variant="body2" sx={{
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 1.5,
        mb: 1.5
      }}>
        {post.preview}
      </Typography>

      <Box sx={{
        display: 'flex',
        gap: 2,
        fontSize: 12,
        color: '#9ca3af'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ThumbUp sx={{ fontSize: 12 }} />
          <Typography variant="caption">{post.likes}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chat sx={{ fontSize: 12 }} />
          <Typography variant="caption">{post.comments}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Visibility sx={{ fontSize: 12 }} />
          <Typography variant="caption">{post.views}</Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default PostCard