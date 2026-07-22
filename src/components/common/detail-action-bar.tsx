'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/auth-store';
import { Button } from '@components/ui/button';
import { UserProfile } from '@components/common/user-profile';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';

/**
 * 상세 화면 하단 고정 바: 상대 프로필(조회) + full-width CTA.
 * HOME-003 교환글 상세('교환할 포카 선택하기') / EX-005 매치 상세('제안하기')가 공유한다.
 * 계측: 상단 구분선 secondary-50(좌우 16 인셋) + 프로필 + CTA 343×56.
 *
 * 교환 제안은 회원 전용(IA) → 비회원이면 로그인 유도 시트를 띄운다.
 * 서버 컴포넌트에서 쓰므로 콜백이 아니라 이동 경로(`href`)를 받는다.
 */
export function DetailActionBar({
  name,
  avatarColor,
  groups,
  label,
  href,
}: {
  name: string;
  avatarColor?: string;
  groups?: string;
  label: string;
  href: string;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleAction = () => {
    if (!isAuthenticated) setLoginOpen(true);
    else router.push(href);
  };

  return (
    <div className="sticky bottom-0 bg-background px-4 pb-4">
      <div className="border-t border-secondary-50" />
      <div className="space-y-3 pt-3">
        <UserProfile variant="info" name={name} avatarColor={avatarColor} groups={groups} />
        <Button size="lg" onClick={handleAction}>
          {label}
        </Button>
      </div>
      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
