import type { ReactNode } from 'react';
import { MobileFrame } from '@components/layout/mobile-frame';
import { BottomTabNav } from '@components/layout/bottom-tab-nav';

// 하단 탭바를 가진 앱 셸. 탭 루트 화면(홈/컬렉션/내교환/채팅/마이)이 여기에 속한다.
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <MobileFrame>
      {/* flex 컬럼: 화면 전체를 채우는 빈 상태(CHAT-001 등)가 flex-1로 남은 높이를 쓸 수 있게 한다 */}
      <main className="flex flex-1 flex-col">{children}</main>
      <BottomTabNav />
    </MobileFrame>
  );
}
