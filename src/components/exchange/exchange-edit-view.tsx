'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@components/layout/header';
import { EmptyState } from '@components/common/empty-state';
import { ExchangeRegisterEditor } from '@components/exchange/exchange-register-editor';
import { getTradeSetDetail } from '@lib/api/trade-sets';
import { queryKeys } from '@lib/query-keys';
import { useExchangeDraftStore } from '@store/exchange-draft-store';

/**
 * EX-009 교환 세트 수정.
 *
 * 등록(EX-007)과 고르는 화면이 같으므로 에디터를 그대로 재사용하고,
 * 진입 시 **기존 세트의 선택으로 드래프트를 채운다.** 이후 조작은 등록과 동일하고,
 * 완료 시에만 등록 대신 수정(`PUT`)으로 갈린다.
 *
 * ⚠️ 시딩은 세트당 한 번만 한다. 매 렌더마다 채우면 사용자가 뺀 카드가 되살아난다.
 * (드래프트는 등록 성공 시 비워지므로, 시딩 직전에 이전 값이 잠깐 보일 여지는 사실상 없다)
 */
export function ExchangeEditView() {
  const tradeSetId = String(useParams().id ?? '');
  const setSelection = useExchangeDraftStore((s) => s.setSelection);
  const seededFor = useRef<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.tradeSets.detail(tradeSetId),
    queryFn: () => getTradeSetDetail(tradeSetId),
    enabled: tradeSetId.length > 0,
    throwOnError: false,
  });

  useEffect(() => {
    if (!data || seededFor.current === data.id) return;
    seededFor.current = data.id;
    setSelection(
      data.haveCards.map((card) => card.id),
      data.wantCards.map((card) => card.id)
    );
  }, [data, setSelection]);

  if (isPending) {
    return (
      <>
        <Header title="교환 세트 수정" />
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          불러오는 중...
        </p>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <Header title="교환 세트 수정" />
        <EmptyState
          title="교환 세트를 불러오지 못했어요."
          description="삭제되었거나 잠시 문제가 생겼어요."
        />
      </>
    );
  }

  return <ExchangeRegisterEditor groupId={data.groupId} tradeSetId={data.id} />;
}
