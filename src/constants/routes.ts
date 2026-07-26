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
  /** 구글 로그인 성공/온보딩 콜백 — 서버가 프래그먼트(#)로 토큰을 실어 보낸다 */
  oauthCallback: '/oauth/callback',
  /** 탈퇴 회원 콜백 — 서버가 이 경로로만 쿼리(?error=WITHDRAWN_USER)를 보낸다 */
  loginCallback: '/login/callback',
  signup: '/signup',
  terms: '/terms',
  privacy: '/privacy',
  /** EX-007 교환 세트 등록 (홈/내교환 플로팅 CTA '교환 등록하기') */
  exchangeRegister: '/exchange/register',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * 홈 교환글 하위 라우트 (HOME-003 상세 / HOME-004 교환할 포카 선택).
 * `id`는 서버의 `tradeSetId`다. (경로명 `/posts`는 유지 — 화면 IA 기준)
 * 자세한 규칙: docs/routing-conventions.md
 */
export const POST_ROUTES = {
  /** HOME-003 교환글 상세 (작성자 정보는 상세 API가 함께 준다) */
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
  /** EX-010 교환 세트 이미지로 저장하기 */
  setImage: (id: string) => `${ROUTES.exchange}/sets/${id}/image`,
  /** EX-005 매칭 결과 상세. `id`는 **상대의 교환 세트 id**다(상대 정보는 상세 API가 함께 준다) */
  matchDetail: (id: string) => `${ROUTES.exchange}/matches/${id}`,
  /** EX-006 교환할 포카 선택 */
  matchSelect: (id: string) => `${ROUTES.exchange}/matches/${id}/select`,
  /** EX-007 교환 세트 등록 — 등록 API가 그룹 단위라 대상 그룹을 쿼리로 넘긴다 */
  register: (groupId: string) => `${ROUTES.exchangeRegister}?group=${encodeURIComponent(groupId)}`,
  /**
   * EX-008 교환 세트 확인 (등록/수정 API가 그룹 단위라 그룹을 함께 넘긴다).
   * `tradeSetId`가 있으면 등록이 아니라 **수정**으로 처리한다(EX-009).
   */
  registerConfirm: (groupId: string, tradeSetId?: string) => {
    const query = new URLSearchParams({ group: groupId });
    if (tradeSetId) query.set('edit', tradeSetId);
    return `${ROUTES.exchangeRegister}/confirm?${query}`;
  },
  /** EX-009 교환 세트 수정 */
  setEdit: (id: string) => `${ROUTES.exchange}/sets/${id}/edit`,
  /** EX-003 나의 교환 세트 관리 (그룹 단위 목록) */
  setsOf: (groupId: string) => `${ROUTES.exchange}/sets?group=${encodeURIComponent(groupId)}`,
} as const;

/**
 * 컬렉션 하위 라우트 (COL-003).
 * 편집 대상 그룹은 필터라 라우트가 아닌 **쿼리 파라미터**로 넘긴다(새로고침·뒤로가기 안전).
 * 자세한 규칙: docs/routing-conventions.md
 */
export const COLLECTION_ROUTES = {
  /** COL-003 컬렉션 편집 */
  edit: (groupId: string) => `${ROUTES.collection}/edit?group=${encodeURIComponent(groupId)}`,
  /**
   * COL-001 컬렉션 메인. 편집을 마치고 돌아올 때 **보던 그룹을 유지**하려고 그룹을 실어 보낸다.
   * (탭 화면이라 평소에는 쿼리 없이 `/collection`으로 접근한다)
   */
  list: (groupId?: string) =>
    groupId ? `${ROUTES.collection}?group=${encodeURIComponent(groupId)}` : ROUTES.collection,
} as const;

/** 채팅방 하위 라우트 (CHAT-002 / 003 / 004) */
export const CHAT_ROUTES = {
  /** CHAT-002 채팅방 */
  room: (id: string) => `${ROUTES.chat}/${id}`,
  /**
   * 제안 직후 새로 만들어진 채팅방.
   * 뒤로가기를 채팅 목록으로 보내기 위한 표시다 — 제안은 이미 끝난 요청이라
   * 카드 선택 화면이나 그 이전 화면으로 되돌아가면 흐름이 어색해진다.
   */
  createdRoom: (id: string) => `${ROUTES.chat}/${id}?new=1`,
  /** CHAT-003 교환 포카 정보 */
  roomDetail: (id: string) => `${ROUTES.chat}/${id}/detail`,
  /** CHAT-004 교환 완료 포카 선택 */
  roomComplete: (id: string) => `${ROUTES.chat}/${id}/complete`,
} as const;
