// 쿠키 유틸리티 함수

/**
 * 쿠키에서 특정 이름의 값을 가져오는 함수
 * @param {string} name - 쿠키 이름
 * @returns {string|null} - 쿠키 값 또는 null
 */
export const getCookie = (name) => {
  // 서버 사이드 렌더링 환경 체크
  if (typeof document === 'undefined') {
    return null
  }

  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop().split(';').shift()
    }
    return null
  } catch (error) {
    console.error('쿠키 읽기 실패:', error)
    return null
  }
}

/**
 * 쿠키 삭제 함수
 * @param {string} name - 삭제할 쿠키 이름
 */
export const deleteCookie = (name) => {
  if (typeof document === 'undefined') {
    return
  }

  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  } catch (error) {
    console.error('쿠키 삭제 실패:', error)
  }
}

/**
 * REFRESH 토큰 가져오기
 *
 * ⚠️ 주의: HttpOnly 쿠키는 JavaScript(document.cookie)로 읽을 수 없습니다!
 * 이 함수는 HttpOnly가 아닌 일반 쿠키에만 작동합니다.
 * HttpOnly 쿠키는 브라우저가 자동으로 전송하므로 확인할 필요가 없습니다.
 *
 * @deprecated HttpOnly 쿠키 사용 시 이 함수는 항상 null을 반환합니다.
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  return getCookie('REFRESH')
}

/**
 * 인증 쿠키 삭제 (REFRESH 토큰만 삭제)
 * ACCESS 토큰은 localStorage에서 관리
 */
export const clearAuthCookies = () => {
  deleteCookie('REFRESH')
}
