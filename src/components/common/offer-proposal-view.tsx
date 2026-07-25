'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { EmptyState } from '@components/common/empty-state';
import { OfferCardSelector } from '@components/common/offer-card-selector';
import { getTradeSetDetail } from '@lib/api/trade-sets';
import { queryKeys } from '@lib/query-keys';

/**
 * 교환할 포카 선택 화면의 데이터 로더. **HOME-004 / EX-006이 같은 화면**이라 공유한다.
 *
 * 경로의 id는 **상대의 교환 세트 id**다. 상대 세트에서 두 그리드를 만든다:
 *  - **상대방 포카** = 상대의 `haveCards` (내가 받을 수 있는 것)
 *  - **내 포카** = 상대의 `wantCards` (상대가 구하는 것 = 내가 줄 수 있는 것)
 *
 * ⚠️ 서버가 "내 보유분"으로 걸러주지 않으므로, 내가 실제로 가진 카드인지는 사용자가 판단한다.
 */
export function OfferProposalView() {
  const tradeSetId = String(useParams().id ?? '');

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.tradeSets.detail(tradeSetId),
    queryFn: () => getTradeSetDetail(tradeSetId),
    enabled: tradeSetId.length > 0,
    throwOnError: false,
  });

  if (isPending) {
    return (
      <>
        <Header title="교환 포카 선택" />
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          불러오는 중...
        </p>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <Header title="교환 포카 선택" />
        <EmptyState
          title="교환 정보를 불러오지 못했어요."
          description="삭제되었거나 잠시 문제가 생겼어요."
        />
      </>
    );
  }

  return (
    <OfferCardSelector
      targetTradeSetId={data.id}
      myCards={data.wantCards}
      partnerCards={data.haveCards}
    />
  );
}
