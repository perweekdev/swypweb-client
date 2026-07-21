'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { GroupLogo } from '@components/ui/group-logo';
import { mockAllArtists } from '@/mocks/my';

// MY-003 관심 그룹 추가 (그리드, 다중 선택)
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
    // TODO: 선택한 그룹 저장 (BE 연동 후)
    router.back();
  };

  return (
    <>
      <Header title="관심 그룹 추가" />

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
        <ul className="grid grid-cols-3 gap-x-4 gap-y-6">
          {mockAllArtists.map((artist) => {
            const isSelected = selected.has(artist.id);
            return (
              <li key={artist.id}>
                <button
                  type="button"
                  onClick={() => toggle(artist.id)}
                  aria-pressed={isSelected}
                  className="flex w-full flex-col items-center gap-2"
                >
                  <GroupLogo
                    size="lg"
                    name={artist.name}
                    color={artist.color}
                    state={isSelected ? 'selected' : 'default'}
                    className={!isSelected && anySelected ? 'opacity-40' : ''}
                  />
                  <span
                    className={`text-center text-body3 ${
                      isSelected
                        ? 'text-secondary-900'
                        : anySelected
                          ? 'text-secondary-300'
                          : 'text-secondary-900'
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
