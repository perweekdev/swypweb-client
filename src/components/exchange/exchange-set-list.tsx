'use client';

import { useState } from 'react';
import { Button } from '@components/ui/button';
import { IconButton } from '@components/ui/icon-button';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { ActionSheet } from '@components/common/action-sheet';
import { PhotocardRow } from '@components/photocard/photocard-row';
import { MoreIcon } from '@components/icons';
import { useExchangeDraftStore } from '@store/exchange-draft-store';
import type { ExchangeSetSummary } from '@/types/exchange.types';

/**
 * EX-003 나의 교환 세트 관리 목록.
 * 세트마다 있어요/구해요 가로 스크롤 + '이미지로 저장하기' + ⋮(수정/삭제/닫기).
 * 계측: 카드 61×98 gap 8 · 저장 버튼 full-width outline pill 42 · 세트 구분선은 화면 전체 폭.
 */
export function ExchangeSetList({ initialSets }: { initialSets: ExchangeSetSummary[] }) {
  // TODO: BE 연동 시 목록 조회/삭제 API로 교체 (현재는 목 + 세션 등록분 + 로컬 삭제 상태)
  const registeredSets = useExchangeDraftStore((s) => s.registeredSets);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [menuSetId, setMenuSetId] = useState<string | null>(null);
  const [deleteSetId, setDeleteSetId] = useState<string | null>(null);

  // EX-001과 같은 순서: 이번 세션에 등록한 세트가 맨 앞
  const sets = [...registeredSets, ...initialSets].filter((s) => !deletedIds.includes(s.id));

  return (
    <div className="flex-1 pb-4">
      {sets.map((set, i) => (
        <section key={set.id}>
          {i > 0 && <div className="border-t border-secondary-50" />}
          <div className="px-4 pb-4 pt-3">
            <PhotocardRow
              label={`있어요 ${set.haveCards.length}`}
              cards={set.haveCards}
              right={
                <IconButton
                  aria-label="교환 세트 더보기"
                  area={32}
                  onClick={() => setMenuSetId(set.id)}
                >
                  <MoreIcon className="size-5" />
                </IconButton>
              }
            />
            <PhotocardRow
              className="mt-4"
              label={`구해요 ${set.wantCards.length}`}
              cards={set.wantCards}
            />
            {/* TODO: EX-010 이미지로 저장하기 (디자인 미핸드오프) */}
            <Button variant="outline" size="lg" shape="pill" className="mt-4 w-full">
              이미지로 저장하기
            </Button>
          </div>
        </section>
      ))}

      <ActionSheet
        open={menuSetId !== null}
        onClose={() => setMenuSetId(null)}
        actions={[
          // TODO: EX-009 교환 세트 수정 (디자인 미핸드오프)
          { label: '수정하기', onClick: () => {} },
          { label: '삭제하기', destructive: true, onClick: () => setDeleteSetId(menuSetId) },
        ]}
      />

      <ConfirmDialog
        open={deleteSetId !== null}
        title={'교환 세트를 삭제할까요?'}
        description="삭제하면 이 세트의 매칭도 함께 사라져요."
        confirmText="삭제"
        onCancel={() => setDeleteSetId(null)}
        onConfirm={() => {
          if (deleteSetId) setDeletedIds((prev) => [...prev, deleteSetId]);
          setDeleteSetId(null);
        }}
      />
    </div>
  );
}
