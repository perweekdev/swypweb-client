'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { DetailActionBar } from '@components/common/detail-action-bar';
import { EmptyState } from '@components/common/empty-state';
import { getTradeSetDetail } from '@lib/api/trade-sets';
import { queryKeys } from '@lib/query-keys';
import { EXCHANGE_ROUTES } from '@constants/routes';

/**
 * EX-005 매칭 결과 상세 (조회 + 제안 진입).
 *
 * 경로의 id는 **상대의 교환 세트 id**다. 매칭 목록 응답의 카드에는 이름 정보가 없어(§7.6)
 * 여기서는 교환 세트 상세(§7.3)로 **상대 세트 전체**를 조회해 보여준다.
 * ⚠️ 그래서 "매칭된 카드만" 강조되지는 않는다 — 서버가 매칭 카드에 이름을 주면 좁힐 수 있다.
 * 상대 정보는 상세 응답이 함께 준다.
 */
export function MatchDetailView() {
  const tradeSetId = String(useParams().id ?? '');

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.tradeSets.detail(tradeSetId),
    queryFn: () => getTradeSetDetail(tradeSetId),
    enabled: tradeSetId.length > 0,
    throwOnError: false,
  });

  return (
    <>
      <Header title="매치 상세 정보" />

      {isPending && (
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          불러오는 중...
        </p>
      )}

      {isError && (
        <EmptyState
          title="매칭 정보를 불러오지 못했어요."
          description="삭제되었거나 잠시 문제가 생겼어요."
        />
      )}

      {data && (
        <>
          <div className="flex-1 px-4 pb-4 pt-1">
            <ExchangeCardSections haveCards={data.haveCards} wantCards={data.wantCards} />
          </div>
          <DetailActionBar
            name={data.author.nickname}
            avatarUrl={data.author.avatarUrl}
            groups={data.groupName}
            label="제안하기"
            href={EXCHANGE_ROUTES.matchSelect(data.id)}
          />
        </>
      )}
    </>
  );
}
