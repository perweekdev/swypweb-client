'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { CheckCircle } from '@components/ui/check-circle';
import { ProgressBar } from '@components/common/progress-bar';
import { CollectionAlbumList } from '@components/collection/collection-album-list';
import { SelectableCard } from '@components/photocard/selectable-card';
import { useGroupCollectionTree, useSaveCollection } from '@hooks/use-collection';
import { useInterestGroups } from '@hooks/use-groups';
import { isApiError } from '@lib/api-error';
import { API_ERROR_CODES } from '@constants/api-error-codes';
import { useCollectionDraftStore } from '@store/collection-draft-store';
import { COLLECTION_ROUTES } from '@constants/routes';
import type { CollectionAlbum } from '@/types/collection.types';

const PLACEHOLDER_COLOR = '#E6E8EB';

/**
 * COL-003 컬렉션 편집.
 * 그룹 진행도(선택 수/전체 수) + 앨범 아코디언 → 버전별 '전체 선택' + 5열 선택 그리드.
 * 선택은 화면 로컬 상태이고, `완료`를 눌러야 서버에 반영된다(뒤로가기 = 취소).
 *
 * ⚠️ 저장(§6.4)은 **그룹의 보유 목록을 통째로 교체**한다. 그래서 이 화면은 조회(COL-001)와 달리
 * 지연 로딩을 쓰지 않고 **전체 트리를 한 번에** 받는다. 안 펼친 앨범의 보유분이 지워지는 것을 막기 위함이다.
 *
 * 계측: 완료 53×38 pill(비활성 secondary-100 / 활성 secondary-900) · 진행도 라벨 16 medium
 * · '전체 선택' 14 + CheckCircle 16(선택 시 secondary-900 채움) · 카드 64×104 5열 gap 6.
 */
export function CollectionEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupParam = searchParams.get('group');
  const groupId = groupParam ? Number(groupParam) : null;

  const { data: tree, isPending, isError } = useGroupCollectionTree(groupId);
  const { data: interestGroups } = useInterestGroups();
  const saveCollection = useSaveCollection(groupId);
  const markSaved = useCollectionDraftStore((s) => s.markSaved);

  // 사용자가 손대기 전에는 null → 서버의 보유분을 그대로 보여준다(로딩 순서에 흔들리지 않게).
  const [draft, setDraft] = useState<Set<string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const albums: CollectionAlbum[] = useMemo(
    () =>
      (tree ?? []).map((album) => ({
        id: String(album.albumId),
        name: album.name,
        versions: album.versions.map((version) => ({
          id: String(version.versionId),
          name: version.name,
          cards: version.cards.map((card) => ({
            id: String(card.photoCardId),
            memberName: card.memberName,
            albumName: album.name,
            versionName: version.name,
            imageUrl: card.imageUrl,
            color: PLACEHOLDER_COLOR,
          })),
        })),
      })),
    [tree]
  );

  const ownedIds = useMemo(() => {
    const owned = new Set<string>();
    tree?.forEach((album) =>
      album.versions.forEach((version) =>
        version.cards.forEach((card) => {
          if (card.isOwned) owned.add(String(card.photoCardId));
        })
      )
    );
    return owned;
  }, [tree]);

  const totalCards = useMemo(
    () =>
      (tree ?? []).reduce(
        (sum, album) =>
          sum + album.versions.reduce((inner, version) => inner + version.cards.length, 0),
        0
      ),
    [tree]
  );

  const selected = draft ?? ownedIds;
  const groupName = interestGroups?.find((g) => g.id === groupParam)?.name;

  const update = (mutate: (next: Set<string>) => void) => {
    setDraft((prev) => {
      const next = new Set(prev ?? ownedIds);
      mutate(next);
      return next;
    });
    if (error) setError(null);
  };

  const toggle = (cardId: string) =>
    update((next) => {
      if (!next.delete(cardId)) next.add(cardId);
    });

  // 버전 '전체 선택' — 이미 전부 선택돼 있으면 전체 해제
  const toggleVersion = (cardIds: string[], allSelected: boolean) =>
    update((next) => cardIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id))));

  const complete = async () => {
    if (groupId === null || saveCollection.isPending) return;

    try {
      await saveCollection.mutateAsync([...selected].map(Number));
      markSaved();
      // 편집하던 그룹을 그대로 보여준다 — 그냥 돌아가면 첫 관심 그룹으로 초기화된다.
      router.push(COLLECTION_ROUTES.list(groupParam ?? undefined));
    } catch (caught) {
      if (isApiError(caught) && caught.code === API_ERROR_CODES.INVALID_PHOTOCARD) {
        setError('이 그룹에 속하지 않는 포카가 포함되어 있어요.');
        return;
      }
      setError(isApiError(caught) ? caught.message : '잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Header
        title="컬렉션 편집"
        right={
          <Button
            variant="navy"
            size="sm"
            disabled={selected.size === 0 || saveCollection.isPending || !tree}
            onClick={complete}
            className="mr-2 disabled:bg-secondary-100"
          >
            {saveCollection.isPending ? '저장 중' : '완료'}
          </Button>
        }
      />

      <ProgressBar className="px-4 pt-1" label={groupName} value={selected.size} max={totalCards} />

      {error && <p className="px-4 pt-2 text-body3 text-red-900">{error}</p>}

      {isPending && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">불러오는 중...</p>
      )}
      {isError && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">
          컬렉션을 불러오지 못했어요.
        </p>
      )}

      {tree && (
        <CollectionAlbumList
          className="flex-1 px-4 pb-6 pt-2"
          albums={albums}
          renderVersionAction={(version) => {
            const ids = version.cards.map((c) => c.id);
            const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
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
      )}
    </>
  );
}
