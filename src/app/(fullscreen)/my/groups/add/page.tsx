'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { GroupLogo } from '@components/ui/group-logo';
import { EmptyState } from '@components/common/empty-state';
import { useAddInterestGroups, useAllGroups, useInterestGroups } from '@hooks/use-groups';
import { isApiError } from '@lib/api-error';

// MY-003 / HOME-002 관심 그룹 추가 (그리드, 다중 선택)
export default function AddGroupPage() {
  const router = useRouter();
  const { data: allGroups, isPending, isError } = useAllGroups();
  const { data: interestGroups } = useInterestGroups();
  const addGroups = useAddInterestGroups();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // 이미 추가한 관심 그룹: 목록에 남기되 하트 배지 + 반투명 + 클릭 불가로 표시(HOME-002 memo).
  // '서비스 미등록 그룹'과 '내가 이미 추가한 그룹'을 혼동하지 않도록.
  const addedIds = new Set(interestGroups?.map((g) => g.id) ?? []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = async () => {
    setError(null);
    try {
      await addGroups.mutateAsync([...selected].map(Number));
      router.back();
    } catch (caught) {
      setError(isApiError(caught) ? caught.message : '잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Header title="관심 그룹 추가" />

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
        {isPending && (
          <p className="py-10 text-center text-body2 text-secondary-500">불러오는 중...</p>
        )}

        {isError && (
          <EmptyState title="그룹을 불러오지 못했어요." description="잠시 후 다시 시도해주세요." />
        )}

        <ul className="grid grid-cols-3 gap-x-4 gap-y-6">
          {allGroups?.map((artist) => {
            const isAdded = addedIds.has(artist.id);
            const isSelected = selected.has(artist.id);
            return (
              <li key={artist.id}>
                <button
                  type="button"
                  onClick={() => toggle(artist.id)}
                  disabled={isAdded}
                  aria-pressed={isSelected}
                  className="flex w-full flex-col items-center gap-2 disabled:cursor-default"
                >
                  <GroupLogo
                    size="lg"
                    name={artist.name}
                    color={artist.color}
                    logoUrl={artist.logoUrl}
                    favorited={isAdded}
                    state={isSelected ? 'selected' : 'default'}
                    className={isAdded ? 'opacity-50' : ''}
                  />
                  <span
                    className={`text-center text-body3 ${
                      isAdded ? 'text-secondary-300' : 'text-secondary-900'
                    }`}
                  >
                    {artist.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4">
        {error && <p className="mb-2 text-center text-body3 text-red-900">{error}</p>}
        <Button size="lg" disabled={selected.size === 0 || addGroups.isPending} onClick={handleAdd}>
          {addGroups.isPending ? '추가하는 중...' : '추가하기'}
        </Button>
      </div>
    </>
  );
}
