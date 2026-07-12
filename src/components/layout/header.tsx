'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@components/icons';

/** 풀스크린 화면 상단 헤더 (뒤로가기 + 가운데 타이틀) */
export function Header({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="relative flex h-14 items-center px-2">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => router.back()}
        className="p-2 text-secondary-900"
      >
        <ChevronLeftIcon className="size-6" />
      </button>
      <h1 className="absolute left-1/2 -translate-x-1/2 text-h3 text-secondary-900">{title}</h1>
    </header>
  );
}
