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

// 코드로 이름 찾기 헬퍼 함수
export const getBoardName = (code) => {
  return BOARD_CODES[code]?.name || '알 수 없음'
}

// 유효성 검사 헬퍼 함수
export const isValidBoardCode = (code) => {
  return Object.keys(BOARD_CODES).includes(code)
}
