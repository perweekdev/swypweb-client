'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addInterestGroups,
  getAllGroups,
  getInterestGroups,
  removeInterestGroup,
} from '@lib/api/groups';
import { queryKeys } from '@lib/query-keys';
import { useAuthStore } from '@store/auth-store';

/**
 * 그룹 관련 훅.
 * 인증이 필요한 목록이므로 세션 복구(`hydrated`) 후에만 요청한다(I1 참고).
 */
function useAuthReady() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return hydrated && isAuthenticated;
}

/**
 * 전체 그룹 목록은 **공개 API**라 로그인 없이도 부를 수 있다.
 * 다만 세션 복구 전에 쏘면 로그인 사용자의 요청에 토큰이 빠지므로 `hydrated`는 기다린다.
 */
function useHydrated() {
  return useAuthStore((s) => s.hydrated);
}

/** 내 관심 그룹 */
export function useInterestGroups() {
  const enabled = useAuthReady();

  return useQuery({
    queryKey: queryKeys.groups.interest(),
    queryFn: getInterestGroups,
    enabled,
    throwOnError: false,
  });
}

/**
 * 전체 그룹 (홈 그룹 필터 · 관심 그룹 추가 화면).
 *
 * 비로그인도 조회할 수 있다(2026-08-02 서버 `permitAll` 적용, 실측 200).
 * 관심 여부(`interested`)는 쓰지 않고 `useInterestGroups()`로 따로 판단하므로,
 * 회원/비회원이 같은 캐시를 공유해도 하트 표시가 어긋나지 않는다.
 */
export function useAllGroups() {
  const enabled = useHydrated();

  return useQuery({
    queryKey: queryKeys.groups.list(),
    queryFn: getAllGroups,
    enabled,
    throwOnError: false,
  });
}

/** 관심 그룹 변경 후에는 그룹 목록과 홈 피드를 함께 갱신한다(피드가 그룹 필터에 묶여 있다). */
function useInvalidateGroups() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
  };
}

export function useAddInterestGroups() {
  const invalidate = useInvalidateGroups();

  return useMutation({
    mutationFn: (groupIds: number[]) => addInterestGroups(groupIds),
    onSuccess: invalidate,
  });
}

export function useRemoveInterestGroup() {
  const invalidate = useInvalidateGroups();

  return useMutation({
    mutationFn: (groupId: number) => removeInterestGroup(groupId),
    onSuccess: invalidate,
  });
}
