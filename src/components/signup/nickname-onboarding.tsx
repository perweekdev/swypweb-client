'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { TextField } from '@components/ui/text-field';
import { signup, validateNickname } from '@lib/api/auth';
import { isApiError } from '@lib/api-error';
import { useAuthStore } from '@store/auth-store';
import { ROUTES } from '@constants/routes';

/**
 * ONB-001 온보딩 닉네임 입력.
 * 최초 로그인(회원가입) 시 받는 정보는 닉네임 1개뿐이다(memo) — 이메일 가입 화면은 없다.
 * 입력 후 '포카매치 시작하기' → `POST /auth/signup` → 토큰 저장 + 홈 이동.
 *
 * 진입 전제: OAuth 콜백에서 받은 `signupToken`이 스토어에 있어야 한다(유효 10분).
 * 뒤로갈 화면이 없어 헤더(뒤로가기)를 두지 않는다(디자인).
 * 계측: 제목 20 semibold 2줄(줄 간격 24) · 설명 14 secondary-500 · 입력 필드 50 pill
 * · 하단 CTA 343×56 rounded-xl(비활성 primary-300).
 */
export function NicknameOnboarding() {
  const router = useRouter();
  const signupToken = useAuthStore((s) => s.signupToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // 이 화면을 떠나기로 확정한 뒤에는 아래 가드가 다시 끼어들지 않게 한다.
  const leaving = useRef(false);

  // 토큰 없이 직접 들어온 경우(주소 직접 입력·만료 후 새로고침) 로그인부터 다시 시작한다.
  useEffect(() => {
    // 세션 복구 전에는 판단하지 않는다. 자식 effect가 부모(AuthProvider)보다 먼저 실행되므로
    // 이 시점의 signupToken이 "없음"인지 "아직 복구 전"인지 구분할 수 없다.
    if (!hydrated || leaving.current) return;
    if (!signupToken) router.replace(`${ROUTES.login}?error=OAUTH_LOGIN_FAILED`);
  }, [hydrated, signupToken, router]);

  const start = async () => {
    if (!signupToken || submitting) return;

    const invalidReason = validateNickname(nickname);
    if (invalidReason) {
      setError(invalidReason);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { accessToken } = await signup({ signupToken, nickname: nickname.trim() });
      // 토큰을 비우는 순간 위 가드가 발동해 홈 이동을 덮어쓰므로, 먼저 잠근다.
      leaving.current = true;

      const auth = useAuthStore.getState();
      auth.setNickname(nickname.trim());
      auth.setSignupToken(null);
      auth.setAccessToken(accessToken);
      router.replace(ROUTES.home);
    } catch (caught) {
      setSubmitting(false);

      if (!isApiError(caught)) {
        setError('잠시 후 다시 시도해주세요.');
        return;
      }
      if (caught.isNicknameDuplicated) {
        setError('이미 사용 중인 닉네임이에요.');
        return;
      }
      // signupToken 만료(10분)·위조는 **400**으로 온다(401 아님 — 실측 확인).
      // ⚠️ 서버에 전역 예외 핸들러가 없어 닉네임 규칙 위반도 똑같은 400 + Spring 기본 JSON이라
      //    응답만으로는 구분할 수 없다. 위 validateNickname으로 형식은 이미 걸러냈으므로
      //    여기 도달한 400은 토큰 문제로 간주하고 로그인부터 다시 시작시킨다.
      if (caught.isUnauthorized || caught.status === 400) {
        leaving.current = true;
        useAuthStore.getState().setSignupToken(null);
        router.replace(`${ROUTES.login}?error=OAUTH_LOGIN_FAILED`);
        return;
      }
      // 서버 원문(예: 'Internal Server Error')을 그대로 보여주지 않는다 — 사용자가 할 수 있는 게 없다.
      // 이 단계에서 실패는 대부분 닉네임 문제이므로 다시 시도할 수 있게 안내한다.
      setError('닉네임을 등록하지 못했어요. 다른 닉네임으로 다시 시도해주세요.');
    }
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
        onValueChange={(value) => {
          setNickname(value);
          if (error) setError(null);
        }}
        placeholder="닉네임을 입력하세요."
        aria-label="닉네임"
        autoFocus
      />
      {error && <p className="mt-2 px-1 text-body3 text-red-900">{error}</p>}

      <div className="sticky bottom-0 mt-auto bg-background pb-8 pt-3">
        <Button size="lg" disabled={nickname.trim().length === 0 || submitting} onClick={start}>
          {submitting ? '처리 중...' : '포카매치 시작하기'}
        </Button>
      </div>
    </div>
  );
}
