'use client';

import { useAuthStore } from '@store/auth-store';
import { GuestMyPage } from '@components/my/guest-my-page';
import { PlaceholderScreen } from '@components/layout/placeholder-screen';

// 인증 상태로 분기: 비회원 → MY-004, 회원 → MY-001
// TODO: 다음 청크에서 회원 분기를 MY-001 실제 화면으로 교체
export default function MyPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return <GuestMyPage />;
  return <PlaceholderScreen title="마이 (회원)" />;
}
