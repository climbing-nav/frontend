import { useSelector } from 'react-redux'
import PostForm from '../../components/community/PostForm/PostForm'

function PostCreatePage({ onNavigateBack, onPostCreated }) {
  const { loading } = useSelector(state => state.community)

  const handleSubmit = (postData) => {
    console.log('Post submitted:', postData)
    // PostForm 내부에서 Redux 처리가 완료되면
    // 성공 시 커뮤니티 페이지로 돌아가기
    if (onPostCreated) {
      onPostCreated()
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
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      isLoading={loading}
    />
  )
}

export default PostCreatePage