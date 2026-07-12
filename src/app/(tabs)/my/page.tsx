'use client';

import { useAuthStore } from '@store/auth-store';
import { GuestMyPage } from '@components/my/guest-my-page';
import { MemberMyPage } from '@components/my/member-my-page';

// 인증 상태로 분기: 비회원 → MY-004, 회원 → MY-001
export default function MyPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return isAuthenticated ? <MemberMyPage /> : <GuestMyPage />;
}
