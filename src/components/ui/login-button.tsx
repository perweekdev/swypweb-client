import type { ButtonHTMLAttributes } from 'react';
import { GoogleIcon, NaverIcon } from '@components/icons/brand';

/**
 * 소셜 로그인 버튼 (btn-login).
 * 계측: 343×56 rounded-xl, text-button1, 좌측 로고 + 라벨.
 *   google — 흰 배경 + gray-300 테두리 + 검정 글자
 *   naver  — 초록 배경 + 흰 글자
 *
 * ⚠️ 네이버 색: 디자인 PNG 계측값은 #2BD400(라임)이나 네이버 브랜드 가이드/기존 구현은
 *    #03C75A다. 브랜드 필수색으로 판단해 #03C75A 유지 — 최종 확정 필요(디자인 vs 브랜드).
 */
const NAVER_GREEN = '#03C75A';

type Service = 'google' | 'naver';

const LABEL: Record<Service, string> = {
  google: '구글 계정으로 로그인',
  naver: '네이버 계정으로 로그인',
};

type LoginButtonProps = {
  service: Service;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function LoginButton({
  service,
  type = 'button',
  className = '',
  ...props
}: LoginButtonProps) {
  const isGoogle = service === 'google';

  return (
    <button
      type={type}
      style={isGoogle ? undefined : { backgroundColor: NAVER_GREEN }}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl text-button1 ${
        isGoogle ? 'border border-gray-300 bg-white text-black' : 'text-white'
      } ${className}`}
      {...props}
    >
      {isGoogle ? <GoogleIcon className="size-5" /> : <NaverIcon className="size-4" />}
      {LABEL[service]}
    </button>
  );
}
