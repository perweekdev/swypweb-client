import type { ButtonHTMLAttributes } from 'react';
import { GoogleIcon } from '@components/icons/brand';

/**
 * 구글 로그인 버튼 (btn-login).
 * 계측: 343×56 rounded-xl, text-button1, 좌측 로고 + 라벨. 흰 배경 + gray-300 테두리 + 검정 글자.
 *
 * 네이버 로그인은 기능 축소로 제거됨(디자인 확정 — docs/designed/home/memo.md, HOME-001-login_tost).
 */
export function LoginButton({
  type = 'button',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-button1 text-black ${className}`}
      {...props}
    >
      <GoogleIcon className="size-5" />
      구글 계정으로 로그인
    </button>
  );
}
