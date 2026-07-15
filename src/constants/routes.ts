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
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** 채팅방 하위 라우트 (CHAT-002 / 003 / 004) */
export const CHAT_ROUTES = {
  /** CHAT-002 채팅방 */
  room: (id: string) => `${ROUTES.chat}/${id}`,
  /** CHAT-003 교환 포카 정보 */
  roomDetail: (id: string) => `${ROUTES.chat}/${id}/detail`,
  /** CHAT-004 교환 완료 포카 선택 */
  roomComplete: (id: string) => `${ROUTES.chat}/${id}/complete`,
} as const;
