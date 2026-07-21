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
  /** 홈 플로팅 CTA '교환 등록하기' → EX 도메인(미설계). 현재 placeholder. */
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

/** 채팅방 하위 라우트 (CHAT-002 / 003 / 004) */
export const CHAT_ROUTES = {
  /** CHAT-002 채팅방 */
  room: (id: string) => `${ROUTES.chat}/${id}`,
  /** CHAT-003 교환 포카 정보 */
  roomDetail: (id: string) => `${ROUTES.chat}/${id}/detail`,
  /** CHAT-004 교환 완료 포카 선택 */
  roomComplete: (id: string) => `${ROUTES.chat}/${id}/complete`,
} as const;
