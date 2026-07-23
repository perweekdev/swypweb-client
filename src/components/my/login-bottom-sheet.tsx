'use client';

import { useRouter } from 'next/navigation';
import { BottomSheet } from '@components/ui/bottom-sheet';
import { LoginButton } from '@components/ui/login-button';
import { ROUTES } from '@constants/routes';

/**
 * 비회원 로그인 유도 BottomSheet (login-toast, 구글 소셜 로그인).
 *
 * 실제 플로우는 구글 인증 → 온보딩(닉네임) → 홈이다.
 * 로그인 처리(토큰 저장)는 온보딩 마지막 `포카매치 시작하기`에서 이뤄진다(ONB-001).
 */
export function LoginBottomSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  // TODO: 실제 구글 OAuth로 교체 (BE 준비 후). 기존 회원이면 온보딩을 건너뛰고 바로 홈으로.
  const handleLogin = () => {
    onClose();
    router.push(ROUTES.signup);
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pb-6">
        <h3 className="text-h1 text-secondary-900">로그인이 필요해요.</h3>
        <p className="mt-1 text-body2 text-secondary-500">
          로그인하고 포카 교환 상대를 빠르게 매치해보세요!
        </p>
      </div>

      <LoginButton onClick={handleLogin} />
    </BottomSheet>
  );
}
