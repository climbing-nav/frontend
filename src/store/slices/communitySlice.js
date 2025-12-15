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
      // API 응답 구조: { data: { posts: [], hasNext, nextCursorId } }
      const responseData = action.payload.data || action.payload
      const posts = responseData.posts || []
      state.posts = Array.isArray(posts) ? posts : []

      // 페이지네이션 정보 업데이트
      if (responseData.hasNext !== undefined) {
        state.pagination = {
          ...state.pagination,
          hasNextPage: responseData.hasNext,
          nextCursorId: responseData.nextCursorId
        }
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
      // 게시글 목록은 fetchPostsAsync로 새로고침하므로 여기서는 추가하지 않음
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
      state.selectedPost = null  // 새 게시글 로드 시 이전 데이터 초기화
    },
    fetchPostSuccess: (state, action) => {
      state.loading = false
      // API 응답 구조: { code, message, data }
      // data 부분만 저장
      state.selectedPost = action.payload.data || action.payload
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
    toggleLike: (state, action) => {
      const { postId, isLiked, likeCount } = action.payload

      // posts 배열 업데이트
      const post = state.posts.find(p => p.id === postId)
      if (post) {
        post.likeCount = likeCount
        post.isLiked = isLiked
      }

      // selectedPost 업데이트
      if (state.selectedPost && state.selectedPost.id === postId) {
        state.selectedPost.likeCount = likeCount
        state.selectedPost.isLiked = isLiked
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
  toggleLike,
  bookmarkPost,
  unbookmarkPost
} = communitySlice.actions

// Thunk Actions (비동기 액션)
/**
 * 게시글 목록 조회 Thunk
 * @param {string} boardCode - 게시판 코드 (null이면 전체 조회)
 */
export const fetchPostsAsync = (boardCode = null) => async (dispatch) => {
  try {
    dispatch(fetchPostsStart())
    const data = await communityService.getPosts(boardCode)
    dispatch(fetchPostsSuccess(data))
    return data
  } catch (error) {
    const errorMessage = error.response?.data?.message || '게시글 목록을 불러오는데 실패했습니다'
    dispatch(fetchPostsFailure(errorMessage))
    throw error
  }
}

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

/**
 * 게시글 삭제 Thunk
 */
export const deletePostAsync = (postId) => async (dispatch) => {
  try {
    await communityService.deletePost(postId)
    dispatch(deletePost(postId))
    return postId
  } catch (error) {
    const errorMessage = error.response?.data?.message || '게시글 삭제에 실패했습니다'
    dispatch(fetchPostsFailure(errorMessage))
    throw error
  }
}

/**
 * 댓글 작성 Thunk
 * @param {Object} commentData
 * @param {number|string} commentData.postId - 게시글 ID
 * @param {string} commentData.author - 작성자
 * @param {string} commentData.content - 댓글 내용
 */
export const createCommentAsync = (commentData) => async (dispatch) => {
  try {
    const data = await communityService.createComment(commentData)
    // API 응답 구조: { code, message, data }
    const newComment = data.data || data
    dispatch(addComment(newComment))
    return newComment
  } catch (error) {
    const errorMessage = error.response?.data?.message || '댓글 작성에 실패했습니다'
    throw new Error(errorMessage)
  }
}

/**
 * 댓글 삭제 Thunk
 * @param {number|string} postId - 게시글 ID
 * @param {number|string} commentId - 댓글 ID
 */
export const deleteCommentAsync = (postId, commentId) => async (dispatch) => {
  try {
    await communityService.deleteComment(postId, commentId)
    dispatch(deleteComment(commentId))
    return commentId
  } catch (error) {
    const errorMessage = error.response?.data?.message || '댓글 삭제에 실패했습니다'
    throw new Error(errorMessage)
  }
}

/**
 * 게시글 좋아요 토글 Thunk
 * @param {number|string} postId - 게시글 ID
 */
export const toggleLikeAsync = (postId) => async (dispatch) => {
  try {
    const response = await communityService.likePost(postId)
    // API 응답 구조: { code, message, data: { isLiked, likeCount } }
    const { isLiked, likeCount } = response.data
    dispatch(toggleLike({ postId, isLiked, likeCount }))
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.message || '좋아요 처리에 실패했습니다'
    throw new Error(errorMessage)
  }
}

export default communitySlice.reducer