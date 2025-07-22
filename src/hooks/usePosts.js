import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
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
  clearError
} from '../store/slices/communitySlice'
import { communityService } from '../services/communityService'

export const usePosts = () => {
  const dispatch = useDispatch()
  const { 
    posts, 
    selectedPost, 
    comments, 
    loading, 
    error, 
    pagination 
  } = useSelector(state => state.community)

  const fetchPosts = useCallback(async (page = 1, limit = 10) => {
    try {
      dispatch(fetchPostsStart())
      const response = await communityService.getPosts(page, limit)
      dispatch(fetchPostsSuccess(response))
      return { success: true, data: response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '게시글을 불러오는데 실패했습니다.'
      dispatch(fetchPostsFailure(errorMessage))
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const getPostById = useCallback(async (id) => {
    try {
      const response = await communityService.getPostById(id)
      dispatch(selectPost(response.post || response))
      return { success: true, post: response.post || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '게시글을 불러오는데 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const createPost = useCallback(async (postData) => {
    try {
      const response = await communityService.createPost(postData)
      dispatch(addPost(response.post || response))
      return { success: true, post: response.post || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '게시글 작성에 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const editPost = useCallback(async (id, postData) => {
    try {
      const response = await communityService.updatePost(id, postData)
      dispatch(updatePost(response.post || response))
      return { success: true, post: response.post || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '게시글 수정에 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const removePost = useCallback(async (id) => {
    try {
      await communityService.deletePost(id)
      dispatch(deletePost(id))
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '게시글 삭제에 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const fetchComments = useCallback(async (postId) => {
    try {
      dispatch(fetchCommentsStart())
      const response = await communityService.getComments(postId)
      dispatch(fetchCommentsSuccess(response.comments || response))
      return { success: true, comments: response.comments || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '댓글을 불러오는데 실패했습니다.'
      dispatch(fetchCommentsFailure(errorMessage))
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const createComment = useCallback(async (postId, commentData) => {
    try {
      const response = await communityService.createComment(postId, commentData)
      dispatch(addComment(response.comment || response))
      return { success: true, comment: response.comment || response }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '댓글 작성에 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const removeComment = useCallback(async (postId, commentId) => {
    try {
      await communityService.deleteComment(postId, commentId)
      dispatch(deleteComment(commentId))
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '댓글 삭제에 실패했습니다.'
      return { success: false, error: errorMessage }
    }
  }, [dispatch])

  const selectPostById = useCallback((post) => {
    dispatch(selectPost(post))
  }, [dispatch])

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    posts,
    selectedPost,
    comments,
    loading,
    error,
    pagination,
    fetchPosts,
    getPostById,
    createPost,
    editPost,
    removePost,
    fetchComments,
    createComment,
    removeComment,
    selectPost: selectPostById,
    clearError: clearErrorMessage
  }
}