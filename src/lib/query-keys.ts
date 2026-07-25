/**
 * Query Key Factory. 도메인별로 청크 진행에 맞춰 추가한다.
 * 무효화는 상위 키(`all`)로 걸어 하위를 한 번에 만료시킨다.
 */
export const queryKeys = {
  users: {
    all: ['users'] as const,
    /** GET /users/me */
    me: () => [...queryKeys.users.all, 'me'] as const,
  },
  groups: {
    all: ['groups'] as const,
    /** GET /users/groups */
    list: () => [...queryKeys.groups.all, 'list'] as const,
    /** GET /users/me/interest-groups */
    interest: () => [...queryKeys.groups.all, 'interest'] as const,
  },
  collections: {
    all: ['collections'] as const,
    /** 그룹의 앨범 목록 */
    albums: (groupId: number) => [...queryKeys.collections.all, 'albums', groupId] as const,
    /** 앨범의 버전 목록 */
    versions: (albumId: number) => [...queryKeys.collections.all, 'versions', albumId] as const,
    /** 버전의 포카 목록 */
    photocards: (versionId: number) =>
      [...queryKeys.collections.all, 'photocards', versionId] as const,
    /** COL-003 편집용 전체 트리 */
    tree: (groupId: number) => [...queryKeys.collections.all, 'tree', groupId] as const,
  },
  matches: {
    all: ['matches'] as const,
    /** GET /trade-sets/{id}/matches */
    list: (tradeSetId: string) => [...queryKeys.matches.all, 'list', tradeSetId] as const,
  },
  home: {
    all: ['home'] as const,
    /** GET /home/trade-sets — groupId가 바뀌면 별도 캐시 */
    feed: (groupId?: number) => [...queryKeys.home.all, 'feed', groupId ?? null] as const,
  },
  tradeSets: {
    all: ['trade-sets'] as const,
    /** GET /trade-sets?groupId= */
    list: (groupId: number) => [...queryKeys.tradeSets.all, 'list', groupId] as const,
    /** GET /trade-sets/{id} */
    detail: (id: string) => [...queryKeys.tradeSets.all, 'detail', id] as const,
  },
};
