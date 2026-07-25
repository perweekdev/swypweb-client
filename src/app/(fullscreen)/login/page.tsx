import { Suspense } from 'react';
import { LoginErrorView } from '@components/my/login-error-view';

/**
 * 로그인 실패 랜딩 (`/login?error=OAUTH_LOGIN_FAILED`).
 * 서버가 이 경로로 리다이렉트한다(docs/api-reference.md §2.1). 세션 만료(401)도 여기로 보낸다.
 *
 * useSearchParams를 쓰는 클라이언트 뷰라 Suspense 경계가 필요하다.
 */
export default function LoginPage() {
  return (
    <Suspense>
      <LoginErrorView />
    </Suspense>
  );
}
