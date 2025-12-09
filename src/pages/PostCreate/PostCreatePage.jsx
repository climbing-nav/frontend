import { useSelector } from 'react-redux'
import PostForm from '../../components/community/PostForm/PostForm'
import PropTypes from 'prop-types'

function PostCreatePage({ post, onNavigateBack, onPostCreated }) {
  const { loading } = useSelector(state => state.community)
  const isEditing = Boolean(post)

  const handleSubmit = (postData) => {
    console.log(isEditing ? 'Post updated:' : 'Post submitted:', postData)
    // PostForm 내부에서 Redux 처리가 완료되면
    // 성공 시 커뮤니티 페이지로 돌아가기
    if (onPostCreated) {
      console.log(`Navigating back to ${isEditing ? 'post detail' : 'community'} page...`)
      onPostCreated()
    } else {
      console.warn('onPostCreated callback not provided')
    }
  }

  const handleCancel = () => {
    if (onNavigateBack) {
      onNavigateBack()
    }
  }

  const handleSaveDraft = (draftData) => {
    console.log('Draft saved:', draftData)
    // 임시저장 완료 피드백 (선택사항)
  }

  return (
    <PostForm
      post={post}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      isLoading={loading}
    />
  )
}

PostCreatePage.propTypes = {
  post: PropTypes.object,
  onNavigateBack: PropTypes.func,
  onPostCreated: PropTypes.func
}

export default PostCreatePage