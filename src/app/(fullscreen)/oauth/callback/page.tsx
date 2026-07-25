'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { parseOAuthCallbackHash } from '@lib/oauth';
import { useAuthStore } from '@store/auth-store';
import { ROUTES } from '@constants/routes';

/**
 * 구글 로그인 콜백 (docs/api-reference.md §2.1).
 *
 * 서버가 결과를 **URL 프래그먼트**로 넘긴다. 프래그먼트는 서버로 전송되지 않으므로
 * 이 화면은 클라이언트 전용이며, 화면 자체는 거쳐 가는 용도다.
 *   #status=LOGIN_SUCCESS   → 토큰 저장 후 홈
 *   #status=SIGNUP_REQUIRED → signupToken 보관 후 온보딩
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  // StrictMode(개발)에서 effect가 두 번 실행된다. 아래에서 hash를 지우므로
  // 두 번째 실행은 빈 hash를 읽고 실패로 처리해버린다. 그래서 1회만 처리하도록 잠근다.
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const result = parseOAuthCallbackHash(window.location.hash);
    // 토큰이 주소창·히스토리에 남지 않게 즉시 제거한다.
    window.history.replaceState(null, '', window.location.pathname);

    const auth = useAuthStore.getState();

    switch (result.status) {
      case 'LOGIN_SUCCESS':
        auth.setSignupToken(null);
        auth.setAccessToken(result.accessToken);
        router.replace(ROUTES.home);
        break;
      case 'SIGNUP_REQUIRED':
        auth.setSignupToken(result.signupToken);
        router.replace(ROUTES.signup);
        break;
      default:
        router.replace(`${ROUTES.login}?error=OAUTH_LOGIN_FAILED`);
    }
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <p className="text-body2 text-secondary-500">로그인 처리 중이에요...</p>
    </div>
  );
}
