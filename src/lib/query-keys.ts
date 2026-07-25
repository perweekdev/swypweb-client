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
  home: {
    all: ['home'] as const,
    /** GET /home/trade-sets — groupId가 바뀌면 별도 캐시 */
    feed: (groupId?: number) => [...queryKeys.home.all, 'feed', groupId ?? null] as const,
  },
  tradeSets: {
    all: ['trade-sets'] as const,
    /** GET /trade-sets/{id} */
    detail: (id: string) => [...queryKeys.tradeSets.all, 'detail', id] as const,
  },
};
