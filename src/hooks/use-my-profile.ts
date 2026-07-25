'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@lib/api/users';
import { queryKeys } from '@lib/query-keys';
import { useAuthStore } from '@store/auth-store';

/**
 * 내 프로필. 로그인 사용자 정보의 단일 소스다.
 *
 * `hydrated`를 기다리는 이유: 세션 복구(AuthProvider) 전에 요청이 나가면 토큰 없이 호출되어 401이 된다.
 * (I1에서 확인 — React가 자식 effect를 부모보다 먼저 실행한다.)
 *
 * 전역 기본값이 `throwOnError: true`라 여기서만 꺼둔다. 프로필 조회 실패로 화면 전체가
 * 에러 바운더리에 넘어가는 것보다, 저장된 닉네임으로 degrade하는 편이 낫다.
 */
export function useMyProfile() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: getMyProfile,
    enabled: hydrated && isAuthenticated,
    throwOnError: false,
  });
}
