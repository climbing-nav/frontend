import { createSlice } from '@reduxjs/toolkit'
import { communityService } from '../../services/communityService'

const initialState = {
  posts: [],
  selectedPost: null,
  comments: [],
  loading: false,
  error: null,
  success: null,
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

    // 게시글 생성 액션
    createPostStart: (state) => {
      state.loading = true
      state.error = null
      state.success = null
    },
    createPostSuccess: (state, action) => {
      state.loading = false
      state.posts.unshift(action.payload) // 새 게시글을 맨 위에 추가
      state.success = '게시글이 작성되었습니다'
    },
    createPostFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // 게시글 단건 조회 액션
    fetchPostStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchPostSuccess: (state, action) => {
      state.loading = false
      state.selectedPost = action.payload
    },
    fetchPostFailure: (state, action) => {
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
    clearSuccess: (state) => {
      state.success = null
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
  createPostStart,
  createPostSuccess,
  createPostFailure,
  fetchPostStart,
  fetchPostSuccess,
  fetchPostFailure,
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
  clearSuccess,
  resetCommunity,
  likePost,
  unlikePost,
  bookmarkPost,
  unbookmarkPost
} = communitySlice.actions

// Thunk Actions (비동기 액션)
/**
 * 게시글 생성 Thunk
 */
export const createPostAsync = (postData) => async (dispatch) => {
  try {
    dispatch(createPostStart())
    const newPost = await communityService.createPost(postData)
    dispatch(createPostSuccess(newPost))
    return newPost
  } catch (error) {
    const errorMessage = error.response?.data?.message || '게시글 작성에 실패했습니다'
    dispatch(createPostFailure(errorMessage))
    throw error
  }
}

/**
 * 게시글 조회 Thunk
 */
export const fetchPostAsync = (postId) => async (dispatch) => {
  try {
    dispatch(fetchPostStart())
    const post = await communityService.getPostById(postId)
    dispatch(fetchPostSuccess(post))
    return post
  } catch (error) {
    const errorMessage = error.response?.data?.message || '게시글을 불러오는데 실패했습니다'
    dispatch(fetchPostFailure(errorMessage))
    throw error
  }
}

export default communitySlice.reducer