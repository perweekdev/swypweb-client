/**
 * 앱 전역 라우트 경로 상수 (docs/IA.csv 기준, 영문 slug)
 * 하단 탭 루트 5개 + MY 도메인 하위 화면.
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
