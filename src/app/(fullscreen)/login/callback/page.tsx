import { Suspense } from 'react';
import { WithdrawnNoticeView } from '@components/my/withdrawn-notice-view';

/**
 * 탈퇴 회원 로그인 콜백 (`/login/callback?error=WITHDRAWN_USER`).
 * 세 가지 콜백 경로 중 유일하게 경로·전달방식이 다르다(docs/api-reference.md §2.1).
 */
export default function LoginCallbackPage() {
  return (
    <Suspense>
      <WithdrawnNoticeView />
    </Suspense>
  );
}
