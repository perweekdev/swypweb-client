'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { HaveWantTab } from '@components/ui/have-want-tab';
import { CollectionAccordion } from '@components/ui/collection-accordion';
import { SelectableCard } from '@components/photocard/selectable-card';
import { DeletableCardGrid } from '@components/photocard/deletable-card-grid';
import { useExchangeDraftStore } from '@store/exchange-draft-store';
import { EXCHANGE_ROUTES } from '@constants/routes';
import { MAX_CARDS_PER_SIDE } from '@constants/exchange';
import { mockCollectionAlbums, toCollectionCards } from '@/mocks/exchange';
import type { ExchangeSide } from '@/types/exchange.types';

/**
 * EX-007 교환 세트 등록.
 * 있어요/구해요 탭 → 선택된 포카(가로 스크롤, X로 제거) → 앨범 아코디언 안의 5열 포카 그리드.
 * 선택은 드래프트 스토어에 담기고, `완료`에서 EX-008 확인 화면으로 넘긴다(뒤로 와도 유지).
 *
 * 계측: 완료 53×38 pill(비활성 secondary-100 / 활성 secondary-900) · 그리드 5열 카드 64 gap 6
 * · 앨범명 h3 secondary-900 · 버전명 body3 secondary-500 · 구분선 secondary-50.
 */
export function ExchangeRegisterEditor() {
  const router = useRouter();
  const [side, setSide] = useState<ExchangeSide>('have');
  const { haveIds, wantIds, toggle, remove } = useExchangeDraftStore();

  const selectedIds = side === 'have' ? haveIds : wantIds;
  const selectedCards = toCollectionCards(selectedIds);
  // 스토리보드: 있어요/구해요 각각 1장 이상 선택해야 등록할 수 있다
  const canComplete = haveIds.length > 0 && wantIds.length > 0;

  return (
    <>
      <Header
        title="교환 세트 등록"
        right={
          <Button
            variant="navy"
            size="sm"
            disabled={!canComplete}
            onClick={() => router.push(EXCHANGE_ROUTES.registerConfirm)}
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
        {mockCollectionAlbums.map((album, i) => (
          <CollectionAccordion key={album.id} title={album.name} defaultOpen={i === 0}>
            <div className="space-y-5">
              {album.versions.map((version) => (
                <section key={version.id}>
                  <p className="text-body3 text-secondary-500">{version.name}</p>
                  {/* TODO: 앨범 버전별 '전체 선택'은 EX-007 디자인에 없다(COL-003엔 있음) — 기획 확정 시 추가 */}
                  <ul className="mt-2 grid grid-cols-5 gap-1.5">
                    {version.cards.map((card) => {
                      const selected = selectedIds.includes(card.id);
                      return (
                        <li key={card.id}>
                          {/* 미선택은 딤 처리 → SelectableCard의 not_collected와 같은 표현 */}
                          <SelectableCard
                            card={card}
                            state={selected ? 'selected' : 'not_collected'}
                            onClick={() => toggle(side, card.id)}
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
