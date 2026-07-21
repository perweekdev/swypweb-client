'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/auth-store';
import { Button } from '@components/ui/button';
import { UserProfile } from '@components/common/user-profile';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';
import { POST_ROUTES } from '@constants/routes';

/**
 * HOME-003 교환글 상세 하단 고정 바: 작성자 프로필(조회) + '교환할 포카 선택하기'.
 * 교환 제안은 회원 전용(IA) → 비회원이면 로그인 유도 시트를 띄운다.
 */
export function PostDetailBar({
  postId,
  authorName,
  authorAvatarColor,
  authorGroups,
}: {
  postId: string;
  authorName: string;
  authorAvatarColor?: string;
  authorGroups?: string;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleSelect = () => {
    if (!isAuthenticated) setLoginOpen(true);
    else router.push(POST_ROUTES.select(postId));
  };

  return (
    <div className="sticky bottom-0 space-y-3 border-t border-secondary-50 bg-background px-4 pb-4 pt-3">
      <UserProfile
        variant="info"
        name={authorName}
        avatarColor={authorAvatarColor}
        groups={authorGroups}
      />
      <Button size="lg" onClick={handleSelect}>
        교환할 포카 선택하기
      </Button>
      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
