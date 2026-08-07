'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { setUnauthorizedHandler } from '@lib/api-client';
import { useAuthStore } from '@store/auth-store';
import { useLeftChatStore } from '@store/left-chat-store';
import { ROUTES } from '@constants/routes';

/**
 * 인증 부트스트랩.
 *  1. sessionStorage에 남아 있는 토큰을 스토어로 올린다(새로고침 복구).
 *  2. api-client의 401 처리 훅을 등록한다.
 *
 * 리프레시 토큰은 서버 쿠키 Path 결함으로 아직 동작하지 않는다(§1.2 🚨) →
 * 401의 복구 경로는 여전히 재로그인뿐이다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    useAuthStore.getState().hydrate();
    // 나간 채팅방 목록도 같은 시점에 복구한다(서버가 걸러주지 않아 화면에서 숨겨야 한다).
    useLeftChatStore.getState().hydrate();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      // 비로그인 상태에서 받은 401은 만료가 아니므로 화면을 옮기지 않는다.
      if (!useAuthStore.getState().accessToken) return;
      useAuthStore.getState().logout();
      router.replace(`${ROUTES.login}?error=SESSION_EXPIRED`);
    });

    return () => setUnauthorizedHandler(null);
  }, [router]);

  return <>{children}</>;
}
