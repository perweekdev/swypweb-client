import type { ReactNode } from 'react';

/**
 * 모바일 프레임 셸.
 * 디자인이 모바일 고정 폭이므로, 앱 전체를 가운데 정렬된 컬럼(min 320 / max 480)으로 가둔다.
 * 데스크톱에서도 항상 모바일 폭을 유지한다.
 */
export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-[320px] max-w-[480px] flex-col bg-background">
      {children}
    </div>
  );
}
