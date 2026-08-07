'use client';

import { useAuthStore } from '@store/auth-store';
import { TabHeader } from '@components/layout/tab-header';
import { GuestMyPage } from '@components/my/guest-my-page';
import { MemberMyPage } from '@components/my/member-my-page';

// 인증 상태로 분기: 비회원 → MY-004, 회원 → MY-001
export default function MyPage() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // 세션 복구(리프레시 쿠키)가 끝나기 전에는 판단하지 않는다.
  // 여기서 성급히 비회원으로 그리면 복구 직후 회원 화면으로 바뀌며 깜빡인다.
  if (!hydrated) return <TabHeader title="마이페이지" />;

  return isAuthenticated ? <MemberMyPage /> : <GuestMyPage />;
}
