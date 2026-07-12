import type { ReactNode } from 'react';
import { MobileFrame } from '@components/layout/mobile-frame';
import { BottomTabNav } from '@components/layout/bottom-tab-nav';

// 하단 탭바를 가진 앱 셸. 탭 루트 화면(홈/컬렉션/내교환/채팅/마이)이 여기에 속한다.
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <MobileFrame>
      <main className="flex-1">{children}</main>
      <BottomTabNav />
    </MobileFrame>
  );
}
