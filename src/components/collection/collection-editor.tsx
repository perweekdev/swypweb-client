'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { CheckCircle } from '@components/ui/check-circle';
import { ProgressBar } from '@components/common/progress-bar';
import { CollectionAlbumList } from '@components/collection/collection-album-list';
import { SelectableCard } from '@components/photocard/selectable-card';
import { useCollectionDraftStore } from '@store/collection-draft-store';
import { ROUTES } from '@constants/routes';
import { countGroupCards, getCollectionAlbums } from '@/mocks/collection';
import { mockInterestGroups } from '@/mocks/my';

/**
 * COL-003 컬렉션 편집.
 * 그룹 진행도(선택 수/전체 수) + 앨범 아코디언 → 버전별 '전체 선택' + 5열 선택 그리드.
 * 선택은 화면 로컬 상태이고, `완료`를 눌러야 보유 목록에 반영된다(뒤로가기 = 취소).
 *
 * 계측: 완료 53×38 pill(비활성 secondary-100 / 활성 secondary-900) · 진행도 라벨 16 medium
 * · '전체 선택' 14 + CheckCircle 16(선택 시 secondary-900 채움) · 카드 64×104 5열 gap 6.
 */
export function CollectionEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('group') ?? mockInterestGroups[0]?.id ?? '';

  const ownedIds = useCollectionDraftStore((s) => s.ownedByGroup[groupId]);
  const save = useCollectionDraftStore((s) => s.save);
  // 편집 시작 시점의 보유분으로 채운다. 이후는 화면 로컬 상태 — 취소하면 그대로 버려진다.
  const [selected, setSelected] = useState<Set<string>>(() => new Set(ownedIds ?? []));

  const group = mockInterestGroups.find((g) => g.id === groupId);
  const albums = getCollectionAlbums(groupId);
  const totalCards = countGroupCards(groupId);

  const toggle = (cardId: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(cardId)) next.add(cardId);
      return next;
    });

  // 버전 '전체 선택' — 이미 전부 선택돼 있으면 전체 해제
  const toggleVersion = (cardIds: string[], allSelected: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      cardIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });

  const complete = () => {
    save(groupId, [...selected]);
    router.push(ROUTES.collection);
  };

  return (
    <>
      <Header
        title="컬렉션 편집"
        right={
          <Button
            variant="navy"
            size="sm"
            disabled={selected.size === 0}
            onClick={complete}
            className="mr-2 disabled:bg-secondary-100"
          >
            완료
          </Button>
        }
      />

      <ProgressBar
        className="px-4 pt-1"
        label={group?.name}
        value={selected.size}
        max={totalCards}
      />

      <CollectionAlbumList
        className="flex-1 px-4 pb-6 pt-2"
        albums={albums}
        renderVersionAction={(version) => {
          const ids = version.cards.map((c) => c.id);
          const allSelected = ids.every((id) => selected.has(id));
          return (
            <button
              type="button"
              onClick={() => toggleVersion(ids, allSelected)}
              aria-pressed={allSelected}
              className="flex items-center gap-1.5 text-body2 text-gray-700"
            >
              <CheckCircle checked={allSelected} />
              전체 선택
            </button>
          );
        }}
        renderCard={(card) => (
          <SelectableCard
            card={card}
            state={selected.has(card.id) ? 'selected' : 'not_collected'}
            onClick={() => toggle(card.id)}
          />
        )}
      />
    </>
  );
}
