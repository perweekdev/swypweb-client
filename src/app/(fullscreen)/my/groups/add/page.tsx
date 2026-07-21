'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { GroupLogo } from '@components/ui/group-logo';
import { mockAllArtists, mockInterestGroups } from '@/mocks/my';

// 이미 추가한 관심 그룹: 목록에 남기되 하트 배지 + 반투명 + 클릭 불가로 표시(HOME-002 memo).
// '서비스 미등록 그룹'과 '내가 이미 추가한 그룹'을 혼동하지 않도록.
const addedIds = new Set(mockInterestGroups.map((g) => g.id));

// MY-003 / HOME-002 관심 그룹 추가 (그리드, 다중 선택)
export default function AddGroupPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const anySelected = selected.size > 0;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    // TODO: 선택한 그룹 저장 (BE 연동 후). 완료 후 홈 필터를 마지막 추가 그룹으로 선택하는
    //       연동은 관심 그룹 영속화(스토어/API)와 함께 진행.
    router.back();
  };

  return (
    <>
      <Header title="관심 그룹 추가" />

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
        <ul className="grid grid-cols-3 gap-x-4 gap-y-6">
          {mockAllArtists.map((artist) => {
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
        <Button size="lg" disabled={!anySelected} onClick={handleAdd}>
          추가하기
        </Button>
      </div>
    </>
  );
}
