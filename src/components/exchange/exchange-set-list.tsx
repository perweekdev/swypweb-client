'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { IconButton } from '@components/ui/icon-button';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { ActionSheet } from '@components/common/action-sheet';
import { EmptyState } from '@components/common/empty-state';
import { PhotocardRow } from '@components/photocard/photocard-row';
import { MoreIcon } from '@components/icons';
import { useDeleteTradeSet, useMyTradeSets, useTradeSetDetails } from '@hooks/use-trade-sets';
import { isApiError } from '@lib/api-error';
import { EXCHANGE_ROUTES } from '@constants/routes';

/**
 * EX-003 나의 교환 세트 관리 목록.
 * 세트마다 있어요/구해요 가로 스크롤 + '이미지로 저장하기' + ⋮(수정/삭제/닫기).
 *
 * 목록 API는 축별 **대표 카드 1장**만 주는데 이 화면은 전체 카드를 보여주므로,
 * 목록으로 받은 id들의 상세를 병렬 조회해 채운다(`useTradeSetDetails`).
 *
 * 계측: 카드 61×98 gap 8 · 저장 버튼 full-width outline pill 42 · 세트 구분선은 화면 전체 폭.
 */
export function ExchangeSetList({ groupId }: { groupId: number | null }) {
  const router = useRouter();
  const { data: summaries, isPending, isError } = useMyTradeSets(groupId);
  const details = useTradeSetDetails((summaries ?? []).map((s) => s.id));
  const deleteTradeSet = useDeleteTradeSet();

  const [menuSetId, setMenuSetId] = useState<string | null>(null);
  const [deleteSetId, setDeleteSetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const confirmDelete = async () => {
    const target = deleteSetId;
    setDeleteSetId(null);
    if (!target) return;

    setError(null);
    try {
      await deleteTradeSet.mutateAsync(target);
    } catch (caught) {
      setError(isApiError(caught) ? caught.message : '삭제에 실패했어요.');
    }
  };

  if (isPending) {
    return <p className="px-4 py-10 text-center text-body2 text-secondary-500">불러오는 중...</p>;
  }
  if (isError) {
    return (
      <EmptyState title="교환 세트를 불러오지 못했어요." description="잠시 후 다시 시도해주세요." />
    );
  }
  if (!summaries || summaries.length === 0) {
    return (
      <EmptyState
        title="등록된 교환 세트가 없어요"
        description="세트를 등록하면 교환 상대를 매치해드려요"
      />
    );
  }

  return (
    <div className="flex-1 pb-4">
      {error && <p className="px-4 py-2 text-center text-body3 text-red-900">{error}</p>}

      {summaries.map((set, i) => {
        const detail = details[i]?.data;
        return (
          <section key={set.id}>
            {i > 0 && <div className="border-t border-secondary-50" />}
            {/* 세트를 누르면 상세(EX-004)로 진입한다. ⋮·버튼은 각자 전파를 막는다. */}
            <div
              className="cursor-pointer px-4 pb-4 pt-3"
              onClick={() => router.push(EXCHANGE_ROUTES.setDetail(set.id))}
            >
              <PhotocardRow
                label={`있어요 ${set.haveCount}`}
                cards={detail?.haveCards ?? []}
                right={
                  <IconButton
                    aria-label="교환 세트 더보기"
                    area={32}
                    onClick={(event) => {
                      event.stopPropagation();
                      setMenuSetId(set.id);
                    }}
                  >
                    <MoreIcon className="size-5" />
                  </IconButton>
                }
              />
              <PhotocardRow
                className="mt-4"
                label={`구해요 ${set.wantCount}`}
                cards={detail?.wantCards ?? []}
              />
              <Button
                variant="outline"
                size="lg"
                shape="pill"
                className="mt-4 w-full"
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(EXCHANGE_ROUTES.setImage(set.id));
                }}
              >
                이미지로 저장하기
              </Button>
            </div>
          </section>
        );
      })}

      <ActionSheet
        open={menuSetId !== null}
        onClose={() => setMenuSetId(null)}
        actions={[
          {
            label: '수정하기',
            onClick: () => menuSetId && router.push(EXCHANGE_ROUTES.setEdit(menuSetId)),
          },
          { label: '삭제하기', destructive: true, onClick: () => setDeleteSetId(menuSetId) },
        ]}
      />

      <ConfirmDialog
        open={deleteSetId !== null}
        title={'교환 세트를 삭제할까요?'}
        description="삭제하면 이 세트의 매칭도 함께 사라져요."
        confirmText="삭제"
        onCancel={() => setDeleteSetId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
