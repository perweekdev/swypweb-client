'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { DetailActionBar } from '@components/common/detail-action-bar';
import { EmptyState } from '@components/common/empty-state';
import { getTradeSetDetail } from '@lib/api/trade-sets';
import { queryKeys } from '@lib/query-keys';
import { useMyProfile } from '@hooks/use-my-profile';
import { POST_ROUTES } from '@constants/routes';

/**
 * HOME-003 교환글 상세.
 * 경로의 id는 교환 세트 id이며, 작성자 정보는 상세 API가 함께 준다(§7.3).
 */
export function PostDetailView() {
  const tradeSetId = String(useParams().id ?? '');

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.tradeSets.detail(tradeSetId),
    queryFn: () => getTradeSetDetail(tradeSetId),
    enabled: tradeSetId.length > 0,
    throwOnError: false,
  });

  // 내 교환글에는 제안할 수 없다(서버 AUTH_006) → CTA 자체를 숨긴다.
  const { data: myProfile } = useMyProfile();
  const isMine =
    data !== undefined && myProfile !== undefined && data.author.id === String(myProfile.userId);

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
          {isMine ? (
            <p className="sticky bottom-0 bg-background px-4 pb-8 pt-3 text-center text-body3 text-secondary-500">
              내가 등록한 교환글이에요.
            </p>
          ) : (
            <DetailActionBar
              name={data.author.nickname}
              avatarUrl={data.author.avatarUrl}
              groups={data.groupName}
              label="교환할 포카 선택하기"
              href={POST_ROUTES.select(data.id)}
            />
          )}
        </>
      )}
    </>
  );
}
