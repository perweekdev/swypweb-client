'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getHomeFeed } from '@lib/api/home';
import { getNextCursorParam } from '@lib/cursor';
import { queryKeys } from '@lib/query-keys';

/**
 * 홈 피드 무한 스크롤.
 * 공개 API라 로그인 여부와 무관하게 조회한다(세션 복구를 기다리지 않아도 된다).
 */
export function useHomeFeed(groupId?: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.home.feed(groupId),
    queryFn: ({ pageParam }) => getHomeFeed({ cursor: pageParam, groupId }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: getNextCursorParam,
    throwOnError: false,
  });
}

/**
 * 목록 끝 감지용 sentinel ref. 화면에 들어오면 onIntersect를 호출한다.
 * (스크롤 이벤트 대신 IntersectionObserver — 리렌더 부담이 없다)
 */
export function useInfiniteScrollSentinel(onIntersect: () => void, enabled: boolean) {
  const callbackRef = useRef(onIntersect);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 최신 콜백을 참조만 갱신한다(옵저버를 재생성하지 않기 위해).
  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) callbackRef.current();
        },
        // 하단에 닿기 전에 미리 불러온다.
        { rootMargin: '200px' }
      );
      observerRef.current.observe(node);
    },
    [enabled]
  );
}
