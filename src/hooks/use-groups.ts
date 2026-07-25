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

/** 전체 그룹 (관심 그룹 추가 화면) */
export function useAllGroups() {
  const enabled = useAuthReady();

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
