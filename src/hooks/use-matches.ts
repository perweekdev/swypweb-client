'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getMatches } from '@lib/api/matches';
import { getNextCursorParam } from '@lib/cursor';
import { queryKeys } from '@lib/query-keys';
import { useAuthStore } from '@store/auth-store';

/**
 * 내 교환 세트 1개에 대한 추천 매칭.
 * 매칭은 **교환 세트 단위**로 계산되므로 세트를 지정해야 한다(그룹 단위가 아니다).
 */
export function useMatches(tradeSetId: string | null) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useInfiniteQuery({
    queryKey: queryKeys.matches.list(tradeSetId ?? ''),
    queryFn: ({ pageParam }) => getMatches({ tradeSetId: tradeSetId as string, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: getNextCursorParam,
    enabled: hydrated && isAuthenticated && tradeSetId !== null,
    throwOnError: false,
  });
}
