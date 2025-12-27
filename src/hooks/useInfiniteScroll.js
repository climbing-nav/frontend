import { useEffect, useRef, useCallback } from 'react'

/**
 * 무한 스크롤 커스텀 훅
 * @param {Function} onLoadMore - 더 로드할 때 호출될 함수
 * @param {boolean} hasMore - 더 로드할 데이터가 있는지 여부
 * @param {boolean} loading - 현재 로딩 중인지 여부
 * @param {number} threshold - 하단에서 몇 px 전에 로드할지 (기본값: 200px)
 * @returns {Function} lastElementRef - 마지막 요소에 연결할 ref callback
 */
export const useInfiniteScroll = (onLoadMore, hasMore, loading, threshold = 200) => {
  const observerRef = useRef(null)

  const lastElementRef = useCallback(
    (node) => {
      // 로딩 중이면 observer 설정 안 함
      if (loading) return

      // 기존 observer가 있으면 disconnect
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // 새로운 IntersectionObserver 생성
      observerRef.current = new IntersectionObserver((entries) => {
        // 마지막 요소가 화면에 보이고, 더 로드할 데이터가 있으면 onLoadMore 호출
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore()
        }
      }, {
        // threshold px 전에 미리 로드 시작
        rootMargin: `${threshold}px`
      })

      // node가 있으면 observe 시작
      if (node) {
        observerRef.current.observe(node)
      }
    },
    [loading, hasMore, onLoadMore, threshold]
  )

  // cleanup: 컴포넌트 unmount 시 observer disconnect
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return lastElementRef
}
