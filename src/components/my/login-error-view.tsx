'use client';

import { useSearchParams } from 'next/navigation';
import { EmptyState } from '@components/common/empty-state';
import { LoginButton } from '@components/ui/login-button';
import { startGoogleLogin } from '@lib/oauth';

/**
 * 로그인 실패 안내 (`/login?error=...`).
 *
 * ⚠️ 디자인 미핸드오프 화면이다. 서버가 로그인 실패 시 이 경로로 리다이렉트하도록
 * 하드코딩되어 있어(docs/api-reference.md §2.1) 라우트가 없으면 404가 되므로,
 * 기존 디자인 시스템 컴포넌트(EmptyState + LoginButton)만으로 최소 구현했다.
 */
const MESSAGES: Record<string, { title: string; description: string }> = {
  OAUTH_LOGIN_FAILED: {
    title: '로그인에 실패했어요.',
    description: '잠시 후 다시 시도해주세요.',
  },
  SESSION_EXPIRED: {
    title: '로그인이 만료되었어요.',
    description: '보안을 위해 일정 시간이 지나면\n다시 로그인이 필요해요.',
  },
};

const FALLBACK = {
  title: '로그인이 필요해요.',
  description: '구글 계정으로 로그인하고\n포카 교환 상대를 찾아보세요.',
};

export function LoginErrorView() {
  const errorCode = useSearchParams().get('error') ?? '';
  const { title, description } = MESSAGES[errorCode] ?? FALLBACK;

  return (
    <EmptyState
      title={title}
      description={description}
      action={
        <div className="w-full px-4">
          <LoginButton onClick={startGoogleLogin} />
        </div>
      }
    />
  );
}
