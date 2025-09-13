import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts: [],
  selectedPost: null,
  comments: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false
  }
}

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchPostsSuccess: (state, action) => {
      state.loading = false
      state.posts = action.payload.posts || action.payload
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination
      }
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload)
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id)
      if (index !== -1) {
        state.posts[index] = action.payload
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload)
    },
    selectPost: (state, action) => {
      state.selectedPost = action.payload
    },
    
    fetchCommentsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchCommentsSuccess: (state, action) => {
      state.loading = false
      state.comments = action.payload
    },
    fetchCommentsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    addComment: (state, action) => {
      state.comments.push(action.payload)
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(comment => comment.id !== action.payload)
    },
    
    clearError: (state) => {
      state.error = null
    },
    resetCommunity: (state) => {
      return initialState
    },
    
    // Like functionality
    likePost: (state, action) => {
      const post = state.posts.find(post => post.id === action.payload)
      if (post) {
        post.likes = (post.likes || 0) + 1
        post.isLiked = true
      }
    },
    unlikePost: (state, action) => {
      const post = state.posts.find(post => post.id === action.payload)
      if (post) {
        post.likes = Math.max((post.likes || 0) - 1, 0)
        post.isLiked = false
      }
    },
    
    // Bookmark functionality
    bookmarkPost: (state, action) => {
      const post = state.posts.find(post => post.id === action.payload)
      if (post) {
        post.isBookmarked = true
      }
    },
    unbookmarkPost: (state, action) => {
      const post = state.posts.find(post => post.id === action.payload)
      if (post) {
        post.isBookmarked = false
      }
    }
  },
})

export const {
  fetchPostsStart,
  fetchPostsSuccess, 
  fetchPostsFailure,
  addPost,
  updatePost,
  deletePost,
  selectPost,
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addComment,
  deleteComment,
  clearError,
  resetCommunity,
  likePost,
  unlikePost,
  bookmarkPost,
  unbookmarkPost
} = communitySlice.actions

export default communitySlice.reducer