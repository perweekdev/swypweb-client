import type { ReactNode } from 'react';
import { MobileFrame } from '@components/layout/mobile-frame';

// 하단 탭 없는 풀스크린 화면 그룹 (상세/편집/등록 등). 각 화면이 자체 Header를 가진다.
export default function FullscreenLayout({ children }: { children: ReactNode }) {
  return <MobileFrame>{children}</MobileFrame>;
}
