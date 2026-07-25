/**
 * 서버 에러 코드. 근거: docs/api-reference.md §1.5 (코드에서 실제 확인된 값)
 *
 * ⚠️ not-found가 `RESOURCE_001`과 문자열 `"404"`로 혼재한다. 유효성 실패도
 * `VALIDATION_00x`와 문자열 `"400"`이 섞인다. 프론트에서 코드로 분기할 때는
 * 반드시 아래 헬퍼를 써서 두 경우를 모두 처리한다. (서버 통일 요청: be-request-list.md P2-2)
 */
export const API_ERROR_CODES = {
  /** 404 — 그룹/앨범/버전/교환세트/채팅방 없음 */
  RESOURCE_NOT_FOUND: 'RESOURCE_001',
  /** 409 — 닉네임 중복 */
  NICKNAME_DUPLICATED: 'RESOURCE_002',
  /** 409 — 교환 세트 내 카드 중복 */
  TRADE_SET_CARD_DUPLICATED: 'RESOURCE_004',

  /** 400 — 유효하지 않은 포토카드 ID(컬렉션 저장) */
  INVALID_PHOTOCARD: 'VALIDATION_007',
  /** 400 — 유효하지 않은 교환 세트 카드 */
  INVALID_TRADE_SET_CARD: 'VALIDATION_008',
  /** 400 — 유효하지 않은 receive(받을) 카드 */
  INVALID_RECEIVE_CARD: 'VALIDATION_009',
  /** 400 — 유효하지 않은 give(줄) 카드 */
  INVALID_GIVE_CARD: 'VALIDATION_010',

  /** 403 — 교환 세트 소유자 아님 */
  NOT_TRADE_SET_OWNER: 'AUTH_005',
  /** 403 — 본인 교환 세트에 채팅 제안(자기 자신과 교환) */
  SELF_TRADE_NOT_ALLOWED: 'AUTH_006',
  /** 403 — 채팅방 참여자 아님 */
  NOT_CHAT_ROOM_MEMBER: 'AUTH_007',

  /** 404 — 일부 not-found가 이 문자열로 온다(사용자/약관/교환세트 상세) */
  LITERAL_NOT_FOUND: '404',
  /** 400 — 관심 그룹 ID 유효성 실패가 이 문자열로 온다 */
  LITERAL_BAD_REQUEST: '400',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

/** not-found 판별. `RESOURCE_001`과 `"404"`를 모두 처리한다. */
export function isNotFoundCode(code: string): boolean {
  return code === API_ERROR_CODES.RESOURCE_NOT_FOUND || code === API_ERROR_CODES.LITERAL_NOT_FOUND;
}

/** 닉네임 중복(409) 판별. 회원가입·닉네임 수정에서 사용. */
export function isNicknameDuplicatedCode(code: string): boolean {
  return code === API_ERROR_CODES.NICKNAME_DUPLICATED;
}
