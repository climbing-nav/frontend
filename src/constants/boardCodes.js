/**
 * 게시판 코드 상수 정의
 * 백엔드 DB boardCode와 매핑
 */

export const BOARD_CODES = {
  FREE: { code: 'FREE', name: '자유게시판' },
  REVIEW: { code: 'REVIEW', name: '후기' },
  TIP: { code: 'TIP', name: '팁&노하우' },
  TRADE: { code: 'TRADE', name: '중고거래' },
  RECRUIT: { code: 'RECRUIT', name: '메이트 모집' }
}

// 배열 형태로 변환 (드롭다운/셀렉트에서 사용)
export const BOARD_CODE_LIST = Object.values(BOARD_CODES)

// 코드 또는 이름을 받아서 이름 반환 (통합 함수)
export const getBoardName = (codeOrName) => {
  // 영문 코드이면 매핑된 한글 이름 반환
  if (BOARD_CODES[codeOrName]) {
    return BOARD_CODES[codeOrName].name
  }
  // 이미 한글 이름이거나 다른 값이면 그대로 반환
  return codeOrName || '알 수 없음'
}

// 유효성 검사 헬퍼 함수
export const isValidBoardCode = (code) => {
  return Object.keys(BOARD_CODES).includes(code)
}
