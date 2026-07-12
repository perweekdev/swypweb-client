'use client';

import { useAuthStore } from '@store/auth-store';
import { BottomSheet } from '@components/ui/bottom-sheet';
import { GoogleIcon, NaverIcon } from '@components/icons/brand';

/** 비회원 로그인 유도 BottomSheet (구글/네이버 소셜 로그인) */
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
        <button
          type="button"
          onClick={handleMockLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-secondary-100 bg-white py-3.5 text-button1 text-secondary-900"
        >
          <GoogleIcon className="size-5" />
          구글 계정으로 로그인
        </button>
        <button
          type="button"
          onClick={handleMockLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#03C75A] py-3.5 text-button1 text-white"
        >
          <NaverIcon className="size-4" />
          네이버 계정으로 로그인
        </button>
      </div>
    </BottomSheet>
  );
}
