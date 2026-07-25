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
};
