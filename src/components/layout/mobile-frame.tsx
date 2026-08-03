import type { ReactNode } from 'react';

/**
 * 모바일 프레임 셸.
 * 디자인 규격: 최소 iPhone 13 mini(375) ~ 최대 iPhone 16 Pro Max(420).
 * 앱 전체를 가운데 정렬된 컬럼(min 375 / max 420)으로 가두고, 그 사이는 반응형으로 늘어난다.
 * 높이는 min-h-dvh로 뷰포트에 맞춘다.
 *
 * 화면이 420보다 넓으면 좌우에 여백이 생기는데, 배경색이 같아 서비스 영역과 구분되지 않는다
 * → `shadow-frame`으로 경계를 준다(디자인 지정).
 */
export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-[375px] max-w-[420px] flex-col bg-background shadow-frame">
      {children}
    </div>
  );
}
