'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@components/layout/header';
import { IconButton } from '@components/ui/icon-button';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { ActionSheet } from '@components/common/action-sheet';
import { EmptyState } from '@components/common/empty-state';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { MoreIcon } from '@components/icons';
import { useDeleteTradeSet } from '@hooks/use-trade-sets';
import { getTradeSetDetail } from '@lib/api/trade-sets';
import { isApiError } from '@lib/api-error';
import { queryKeys } from '@lib/query-keys';
import { EXCHANGE_ROUTES } from '@constants/routes';

/**
 * EX-004 나의 교환 세트 상세.
 * 진입: EX-003 목록에서 세트 선택 / EX-001에서 선택된 세트 재선택.
 *
 * ⋮ → 이미지로 저장하기 · 수정하기 · 삭제하기(파괴적). 삭제는 확인 팝업을 거친다.
 */
export function ExchangeSetDetailView() {
  const router = useRouter();
  const tradeSetId = String(useParams().id ?? '');

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.tradeSets.detail(tradeSetId),
    queryFn: () => getTradeSetDetail(tradeSetId),
    enabled: tradeSetId.length > 0,
    throwOnError: false,
  });
  const deleteTradeSet = useDeleteTradeSet();

  const confirmDelete = async () => {
    setDeleteOpen(false);
    setError(null);

    try {
      await deleteTradeSet.mutateAsync(tradeSetId);
      // 삭제한 세트의 상세로 되돌아가지 않도록 목록을 대체한다.
      router.replace(EXCHANGE_ROUTES.sets);
    } catch (caught) {
      setError(isApiError(caught) ? caught.message : '삭제에 실패했어요.');
    }
  };

  return (
    <>
      <Header
        title="교환 세트 상세"
        right={
          <IconButton aria-label="교환 세트 더보기" area={48} onClick={() => setMenuOpen(true)}>
            <MoreIcon className="size-5" />
          </IconButton>
        }
      />

      {isPending && (
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          불러오는 중...
        </p>
      )}

      {isError && (
        <EmptyState
          title="교환 세트를 불러오지 못했어요."
          description="삭제되었거나 잠시 문제가 생겼어요."
        />
      )}

      {data && (
        <div className="flex-1 px-4 pt-1">
          <ExchangeCardSections haveCards={data.haveCards} wantCards={data.wantCards} />
          {error && <p className="mt-4 text-center text-body3 text-red-900">{error}</p>}
        </div>
      )}

      <ActionSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        actions={[
          {
            label: '이미지로 저장하기',
            onClick: () => router.push(EXCHANGE_ROUTES.setImage(tradeSetId)),
          },
          {
            label: '수정하기',
            onClick: () => router.push(EXCHANGE_ROUTES.setEdit(tradeSetId)),
          },
          {
            label: '삭제하기',
            destructive: true,
            onClick: () => {
              setMenuOpen(false);
              setDeleteOpen(true);
            },
          },
        ]}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="포카 세트를 삭제할까요?"
        description="포카 세트가 교환 리스트에서 삭제돼요."
        cancelText="취소"
        confirmText="삭제"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
