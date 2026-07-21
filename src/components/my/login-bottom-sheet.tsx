'use client';

import { useAuthStore } from '@store/auth-store';
import { BottomSheet } from '@components/ui/bottom-sheet';
import { LoginButton } from '@components/ui/login-button';

/** 비회원 로그인 유도 BottomSheet (login-toast, 구글/네이버 소셜 로그인) */
export function LoginBottomSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  // TODO: 실제 OAuth로 교체 (BE 준비 후). 현재는 개발용 mock 로그인.
  const handleMockLogin = () => {
    setAccessToken('mock');
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pb-6">
        <h3 className="text-h1 text-secondary-900">로그인이 필요해요.</h3>
        <p className="mt-1 text-body2 text-secondary-500">
          로그인하고 포카 교환 상대를 빠르게 매치해보세요!
        </p>
      </div>

      <div className="space-y-3">
        <LoginButton service="google" onClick={handleMockLogin} />
        <LoginButton service="naver" onClick={handleMockLogin} />
      </div>
    </BottomSheet>
  );
}
