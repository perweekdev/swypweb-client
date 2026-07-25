'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { HaveWantTab } from '@components/ui/have-want-tab';
import { CollectionAccordion } from '@components/ui/collection-accordion';
import { SelectableCard } from '@components/photocard/selectable-card';
import { DeletableCardGrid } from '@components/photocard/deletable-card-grid';
import { useGroupCollectionTree } from '@hooks/use-collection';
import { useExchangeDraftStore } from '@store/exchange-draft-store';
import { EXCHANGE_ROUTES } from '@constants/routes';
import { MAX_CARDS_PER_SIDE } from '@constants/exchange';
import type { ExchangeSide } from '@/types/exchange.types';
import type { Photocard } from '@/types/photocard.types';

const PLACEHOLDER_COLOR = '#E6E8EB';

/**
 * EX-007 교환 세트 등록.
 * 있어요/구해요 탭 → 선택된 포카(가로 스크롤, X로 제거) → 앨범 아코디언 안의 5열 포카 그리드.
 * 선택은 드래프트 스토어에 담기고, `완료`에서 EX-008 확인 화면으로 넘긴다(뒤로 와도 유지).
 *
 * 등록 API가 **그룹 단위**(`POST /trade-sets/{groupId}`)라 대상 그룹을 `?group=`으로 받는다.
 * 카드 목록은 컬렉션 트리를 그대로 쓰되(보유 여부와 무관하게 선택 가능) 전체를 한 번에 받는다.
 *
 * 계측: 완료 53×38 pill(비활성 secondary-100 / 활성 secondary-900) · 그리드 5열 카드 64 gap 6
 * · 앨범명 h3 secondary-900 · 버전명 body3 secondary-500 · 구분선 secondary-50.
 */
export function ExchangeRegisterEditor() {
  const router = useRouter();
  const groupParam = useSearchParams().get('group');
  const groupId = groupParam ? Number(groupParam) : null;

  const [side, setSide] = useState<ExchangeSide>('have');
  const { haveIds, wantIds, toggle, remove } = useExchangeDraftStore();
  const { data: tree, isPending, isError } = useGroupCollectionTree(groupId);

  // 선택 스트립에 보여줄 카드를 id로 찾기 위한 색인
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

  const selectedIds = side === 'have' ? haveIds : wantIds;
  const selectedCards = selectedIds
    .map((id) => cardsById.get(id))
    .filter((card): card is Photocard => card !== undefined);
  // 스토리보드: 있어요/구해요 각각 1장 이상 선택해야 등록할 수 있다
  const canComplete = haveIds.length > 0 && wantIds.length > 0 && groupParam !== null;

  return (
    <>
      <Header
        title="교환 세트 등록"
        right={
          <Button
            variant="navy"
            size="sm"
            disabled={!canComplete}
            onClick={() => router.push(EXCHANGE_ROUTES.registerConfirm(groupParam as string))}
            className="mr-2"
          >
            완료
          </Button>
        }
      />

      <HaveWantTab
        className="mt-1"
        value={side}
        onChange={setSide}
        haveCount={haveIds.length}
        wantCount={wantIds.length}
      />

      <DeletableCardGrid
        className="px-4 pt-4"
        layout="row"
        cards={selectedCards}
        max={MAX_CARDS_PER_SIDE}
        onDelete={(id) => remove(side, id)}
      />

      <div className="mx-4 mt-4 border-t border-secondary-50" />

      <div className="flex-1 px-4 pb-6">
        {isPending && (
          <p className="py-10 text-center text-body2 text-secondary-500">불러오는 중...</p>
        )}
        {isError && (
          <p className="py-10 text-center text-body2 text-secondary-500">
            포카 목록을 불러오지 못했어요.
          </p>
        )}

        {tree?.map((album, i) => (
          <CollectionAccordion key={album.albumId} title={album.name} defaultOpen={i === 0}>
            <div className="space-y-5">
              {album.versions.map((version) => (
                <section key={version.versionId}>
                  <p className="text-body3 text-secondary-500">{version.name}</p>
                  {/* TODO: 앨범 버전별 '전체 선택'은 EX-007 디자인에 없다(COL-003엔 있음) — 기획 확정 시 추가 */}
                  <ul className="mt-2 grid grid-cols-5 gap-1.5">
                    {version.cards.map((card) => {
                      const cardId = String(card.photoCardId);
                      const selected = selectedIds.includes(cardId);
                      return (
                        <li key={cardId}>
                          {/* 미선택은 딤 처리 → SelectableCard의 not_collected와 같은 표현 */}
                          <SelectableCard
                            card={cardsById.get(cardId) as Photocard}
                            state={selected ? 'selected' : 'not_collected'}
                            onClick={() => toggle(side, cardId)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </CollectionAccordion>
        ))}
      </div>
    </>
  );
}
