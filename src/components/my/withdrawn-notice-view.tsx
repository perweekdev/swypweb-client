'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { EmptyState } from '@components/common/empty-state';
import { Button } from '@components/ui/button';
import { ROUTES } from '@constants/routes';

/**
 * 탈퇴 회원 로그인 안내 (`/login/callback?error=WITHDRAWN_USER&message=...`).
 *
 * ⚠️ 이 경로만 다른 콜백과 전달 방식이 다르다(쿼리스트링, 경로도 `/login/callback`).
 * 서버가 탈퇴 계정 로그인 시 여기로 리다이렉트한다(docs/api-reference.md §2.1).
 *
 * 서버 정책상 **탈퇴한 구글 계정으로는 재가입이 불가능**하므로(§4.3) 재로그인 버튼을 두지 않는다.
 */
export function WithdrawnNoticeView() {
  const router = useRouter();
  const serverMessage = useSearchParams().get('message');

  return (
    <EmptyState
      title="탈퇴한 계정이에요."
      description={serverMessage ?? '해당 계정으로는 로그인할 수 없어요.'}
      action={
        <Button size="md" variant="outline" onClick={() => router.replace(ROUTES.home)}>
          홈으로 가기
        </Button>
      }
    />
  );
}
