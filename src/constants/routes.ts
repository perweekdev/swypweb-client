/**
 * 앱 전역 라우트 경로 상수 (docs/storyboard 기준, 영문 slug)
 * 하단 탭 루트 5개 + 각 도메인 하위 화면.
 */
export const ROUTES = {
  home: '/',
  collection: '/collection',
  exchange: '/exchange',
  chat: '/chat',
  my: '/my',
  myProfile: '/my/profile',
  myGroups: '/my/groups',
  myGroupsAdd: '/my/groups/add',
  login: '/login',
  signup: '/signup',
  terms: '/terms',
  privacy: '/privacy',
  /** EX-007 교환 세트 등록 (홈/내교환 플로팅 CTA '교환 등록하기') */
  exchangeRegister: '/exchange/register',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * 홈 교환글 하위 라우트 (HOME-003 상세 / HOME-004 교환할 포카 선택).
 * ⚠️ 교환 API 리소스명 미확정 → 제안값 `/posts`. 확정 시 이 상수만 수정.
 * 자세한 규칙: docs/routing-conventions.md
 */
export const POST_ROUTES = {
  /** HOME-003 교환글 상세 */
  detail: (id: string) => `/posts/${id}`,
  /** HOME-004 교환할 포카 선택 */
  select: (id: string) => `/posts/${id}/select`,
} as const;

/**
 * 내교환 하위 라우트 (EX-003 / 005 / 006 / 008).
 * 자세한 규칙: docs/routing-conventions.md
 */
export const EXCHANGE_ROUTES = {
  /** EX-003 나의 교환 세트 관리 */
  sets: `${ROUTES.exchange}/sets`,
  /** EX-004 나의 교환 세트 상세 — ⚠️ 디자인 미핸드오프, 경로만 예약 */
  setDetail: (id: string) => `${ROUTES.exchange}/sets/${id}`,
  /** EX-005 매칭 결과 상세 */
  matchDetail: (id: string) => `${ROUTES.exchange}/matches/${id}`,
  /** EX-006 교환할 포카 선택 */
  matchSelect: (id: string) => `${ROUTES.exchange}/matches/${id}/select`,
  /** EX-008 교환 세트 확인 */
  registerConfirm: `${ROUTES.exchangeRegister}/confirm`,
} as const;

/**
 * 컬렉션 하위 라우트 (COL-003).
 * 편집 대상 그룹은 필터라 라우트가 아닌 **쿼리 파라미터**로 넘긴다(새로고침·뒤로가기 안전).
 * 자세한 규칙: docs/routing-conventions.md
 */
export const COLLECTION_ROUTES = {
  /** COL-003 컬렉션 편집 */
  edit: (groupId: string) => `${ROUTES.collection}/edit?group=${encodeURIComponent(groupId)}`,
} as const;

/** 채팅방 하위 라우트 (CHAT-002 / 003 / 004) */
export const CHAT_ROUTES = {
  /** CHAT-002 채팅방 */
  room: (id: string) => `${ROUTES.chat}/${id}`,
  /** CHAT-003 교환 포카 정보 */
  roomDetail: (id: string) => `${ROUTES.chat}/${id}/detail`,
  /** CHAT-004 교환 완료 포카 선택 */
  roomComplete: (id: string) => `${ROUTES.chat}/${id}/complete`,
} as const;
