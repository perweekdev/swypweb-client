'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { DetailActionBar } from '@components/common/detail-action-bar';
import { EmptyState } from '@components/common/empty-state';
import { getTradeSetDetail } from '@lib/api/trade-sets';
import { queryKeys } from '@lib/query-keys';
import { POST_ROUTES } from '@constants/routes';

/**
 * HOME-003 교환글 상세.
 *
 * 상세 API(`GET /trade-sets/{id}`)는 공개지만 **작성자 정보를 주지 않는다**(api-reference §7.3).
 * 그래서 피드에서 넘겨준 닉네임·그룹명을 쿼리에서 읽어 하단 액션바에 쓴다.
 * 서버가 author 필드를 추가하면 쿼리 전달을 없애고 응답 값으로 바꾼다.
 */
export function PostDetailView() {
  const tradeSetId = String(useParams().id ?? '');
  const searchParams = useSearchParams();
  const nickname = searchParams.get('n') ?? '';
  const groups = searchParams.get('g') ?? undefined;

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.tradeSets.detail(tradeSetId),
    queryFn: () => getTradeSetDetail(tradeSetId),
    enabled: tradeSetId.length > 0,
    throwOnError: false,
  });

  return (
    <>
      <Header title="상세 정보" />

      {isPending && (
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          불러오는 중...
        </p>
      )}

      {isError && (
        <EmptyState
          title="교환글을 불러오지 못했어요."
          description="삭제되었거나 잠시 문제가 생겼어요."
        />
      )}

      {data && (
        <>
          <div className="flex-1 px-4 pb-4 pt-1">
            <ExchangeCardSections haveCards={data.haveCards} wantCards={data.wantCards} />
          </div>
          <DetailActionBar
            name={nickname}
            groups={groups}
            label="교환할 포카 선택하기"
            href={POST_ROUTES.select(data.id)}
          />
        </>
      )}
    </>
  );
}
