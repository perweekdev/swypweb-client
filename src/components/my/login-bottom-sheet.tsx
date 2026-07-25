'use client';

import { BottomSheet } from '@components/ui/bottom-sheet';
import { LoginButton } from '@components/ui/login-button';
import { startGoogleLogin } from '@lib/oauth';

/**
 * 비회원 로그인 유도 BottomSheet (login-toast, 구글 소셜 로그인).
 *
 * 실제 플로우: 서버 `/oauth2/authorization/google`로 **전체 이동** → 구글 인증 →
 * 서버가 `/oauth/callback`으로 되돌려보냄 → 기존 회원은 홈, 신규 회원은 온보딩(ONB-001).
 * 신규/기존 분기는 서버가 판단하므로 여기서는 진입만 담당한다.
 */
export function LoginBottomSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const handleLogin = () => {
    // 이동을 먼저 건다. 혹시 이동이 막히면 시트가 열린 채 남아 사용자가 상황을 인지할 수 있다.
    startGoogleLogin();
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

      <LoginButton onClick={handleLogin} />
    </BottomSheet>
  );
}
