'use client';

import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTradeSet,
  deleteTradeSet,
  getMyTradeSets,
  getTradeSetDetail,
  type TradeSetPayload,
} from '@lib/api/trade-sets';
import { queryKeys } from '@lib/query-keys';
import { useAuthStore } from '@store/auth-store';

function useAuthReady() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return hydrated && isAuthenticated;
}

/** 내 교환 세트 목록(그룹 단위). 축별 대표 카드 1장만 온다. */
export function useMyTradeSets(groupId: number | null) {
  const ready = useAuthReady();

  return useQuery({
    queryKey: queryKeys.tradeSets.list(groupId ?? 0),
    queryFn: () => getMyTradeSets(groupId as number),
    enabled: ready && groupId !== null,
    throwOnError: false,
  });
}

/**
 * 여러 세트의 상세를 한 번에.
 * EX-003은 세트마다 있어요/구해요 **전체 카드**를 보여주는데 목록 API는 대표 1장만 주므로,
 * 목록으로 받은 id들의 상세를 병렬 조회한다. (세트 수가 적어 부담이 크지 않다)
 */
export function useTradeSetDetails(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.tradeSets.detail(id),
      queryFn: () => getTradeSetDetail(id),
      throwOnError: false,
    })),
  });
}

function useInvalidateTradeSets() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.tradeSets.all });
    // 홈 피드에도 내 교환글이 노출되므로 함께 갱신한다.
    void queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
  };
}

export function useCreateTradeSet(groupId: number | null) {
  const invalidate = useInvalidateTradeSets();

  return useMutation({
    mutationFn: (payload: TradeSetPayload) => createTradeSet(groupId as number, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteTradeSet() {
  const invalidate = useInvalidateTradeSets();

  return useMutation({
    mutationFn: (tradeSetId: string) => deleteTradeSet(tradeSetId),
    onSuccess: invalidate,
  });
}
