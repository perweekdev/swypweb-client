'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@components/icons';
import { IconButton } from '@components/ui/icon-button';

/**
 * 풀스크린 화면 상단 헤더 (nav-bar): 뒤로가기 + 가운데 타이틀 + 우측 액션 슬롯.
 * 우측 ⋮(더보기) 등은 `right`로 넘긴다.
 */
export function Header({ title, right }: { title: string; right?: ReactNode }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center bg-background px-2">
      <IconButton aria-label="뒤로가기" area={48} onClick={() => router.back()}>
        <ChevronLeftIcon className="size-6" />
      </IconButton>
      <h1 className="absolute left-1/2 -translate-x-1/2 text-h3 text-secondary-900">{title}</h1>
      {right && <div className="ml-auto">{right}</div>}
    </header>
  );
}
