'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { useGroupCollectionTree } from '@hooks/use-collection';
import { useCreateTradeSet, useUpdateTradeSet } from '@hooks/use-trade-sets';
import { isApiError } from '@lib/api-error';
import { API_ERROR_CODES } from '@constants/api-error-codes';
import { useExchangeDraftStore } from '@store/exchange-draft-store';
import { ROUTES } from '@constants/routes';
import type { Photocard } from '@/types/photocard.types';
import { PLACEHOLDER_COLOR } from '@constants/colors';

/**
 * EX-008 교환 세트 확인. 등록 직전 있어요/구해요를 3열로 훑어보고 등록한다.
 * 계측: 제목 20 semibold `#000000` 2줄(행간은 디자인시스템대로 1.5 — 시안의 24는 무시한다) · 하단 CTA 343×56 rounded-xl primary-900.
 */
export function ExchangeRegisterConfirm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupParam = searchParams.get('group');
  const groupId = groupParam ? Number(groupParam) : null;
  // `edit`이 있으면 등록이 아니라 수정(EX-009)이다.
  const editingId = searchParams.get('edit');

  const { haveIds, wantIds, markRegistered } = useExchangeDraftStore();
  const { data: tree } = useGroupCollectionTree(groupId);
  const createTradeSet = useCreateTradeSet(groupId);
  const updateTradeSet = useUpdateTradeSet(editingId ?? '');
  const submitting = createTradeSet.isPending || updateTradeSet.isPending;
  const [error, setError] = useState<string | null>(null);

  const cardsById = useMemo(() => {
    const index = new Map<string, Photocard>();
    tree?.forEach((album) =>
      album.versions.forEach((version) =>
        version.cards.forEach((card) =>
          index.set(String(card.photoCardId), {
            id: String(card.photoCardId),
            memberName: card.memberName,
            albumName: album.name,
            versionName: version.name,
            imageUrl: card.imageUrl,
            color: PLACEHOLDER_COLOR,
          })
        )
      )
    );
    return index;
  }, [tree]);

  const pick = (ids: string[]) =>
    ids.map((id) => cardsById.get(id)).filter((card): card is Photocard => card !== undefined);

  const haveCards = pick(haveIds);
  const wantCards = pick(wantIds);
  const canRegister = haveIds.length > 0 && wantIds.length > 0 && groupId !== null && !submitting;

  const onRegister = async () => {
    if (!canRegister) return;
    setError(null);

    const payload = {
      haveCardIds: haveIds.map(Number),
      wantCardIds: wantIds.map(Number),
    };

    try {
      if (editingId) await updateTradeSet.mutateAsync(payload);
      else await createTradeSet.mutateAsync(payload);
      markRegistered();
      router.push(ROUTES.exchange);
    } catch (caught) {
      if (!isApiError(caught)) {
        setError('잠시 후 다시 시도해주세요.');
        return;
      }
      if (caught.code === API_ERROR_CODES.TRADE_SET_CARD_DUPLICATED) {
        setError('이미 등록한 포카가 포함되어 있어요.');
        return;
      }
      if (caught.code === API_ERROR_CODES.INVALID_TRADE_SET_CARD) {
        setError('이 그룹에 속하지 않는 포카가 포함되어 있어요.');
        return;
      }
      setError(caught.message);
    }
  };

  return (
    <>
      <Header title="교환 세트 확인" />

      <div className="flex-1 px-4 pb-6">
        <p className="whitespace-pre-line text-h1 text-black">
          {editingId ? '수정될 교환 세트를\n확인해주세요' : '등록될 교환 세트를\n확인해주세요'}
        </p>
        <ExchangeCardSections className="mt-6" haveCards={haveCards} wantCards={wantCards} />
      </div>

      <div className="sticky bottom-0 bg-background px-4 pb-8 pt-3">
        {error && <p className="mb-2 text-center text-body3 text-red-900">{error}</p>}
        <Button size="lg" disabled={!canRegister} onClick={onRegister}>
          {submitting ? '저장 중...' : editingId ? '수정하기' : '등록하기'}
        </Button>
      </div>
    </>
  );
}
