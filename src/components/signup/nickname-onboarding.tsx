'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { TextField } from '@components/ui/text-field';
import { useAuthStore } from '@store/auth-store';
import { ROUTES } from '@constants/routes';

/**
 * ONB-001 온보딩 닉네임 입력.
 * 최초 로그인(회원가입) 시 받는 정보는 닉네임 1개뿐이다(memo) — 이메일 가입 화면은 없다.
 * 입력 후 '포카매치 시작하기' → 로그인 완료 + 홈 이동.
 *
 * 뒤로갈 화면이 없어 헤더(뒤로가기)를 두지 않는다(디자인).
 * 계측: 제목 20 semibold 2줄(줄 간격 24) · 설명 14 secondary-500 · 입력 필드 50 pill
 * · 하단 CTA 343×56 rounded-xl(비활성 primary-300).
 */
export function NicknameOnboarding() {
  const router = useRouter();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const saveNickname = useAuthStore((s) => s.setNickname);
  const [nickname, setNickname] = useState('');

  const start = () => {
    // TODO: 실제 회원가입 API(닉네임 등록) + OAuth 토큰 저장으로 교체. 현재는 개발용 mock 로그인.
    saveNickname(nickname.trim());
    setAccessToken('mock');
    router.push(ROUTES.home);
  };

  return (
    <div className="flex flex-1 flex-col px-4 pt-17">
      <h1 className="whitespace-pre-line text-h1 leading-tight text-secondary-900">
        {'사용할 닉네임을\n입력해주세요'}
      </h1>
      <p className="mt-2 text-body2 text-secondary-500">
        설정에서 언제든지 자유롭게 변경할 수 있어요.
      </p>

      <TextField
        className="mt-17"
        value={nickname}
        onValueChange={setNickname}
        placeholder="닉네임을 입력하세요."
        aria-label="닉네임"
        autoFocus
      />

      <div className="sticky bottom-0 mt-auto bg-background pb-8 pt-3">
        <Button size="lg" disabled={nickname.trim().length === 0} onClick={start}>
          포카매치 시작하기
        </Button>
      </div>
    </div>
  );
}
