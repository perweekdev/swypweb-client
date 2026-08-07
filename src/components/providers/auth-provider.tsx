'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { refreshAccessToken, setUnauthorizedHandler } from '@lib/api-client';
import { hadSessionBefore, useAuthStore } from '@store/auth-store';
import { ROUTES } from '@constants/routes';

/**
 * 인증 부트스트랩.
 *  1. sessionStorage에 남아 있는 토큰을 스토어로 올린다(새로고침 복구).
 *  2. 토큰이 없으면 **리프레시 쿠키로 세션을 복구**한다(탭을 닫았다 다시 연 경우).
 *  3. api-client의 401 처리 훅을 등록한다.
 *
 * accessToken은 sessionStorage라 탭을 닫으면 사라지지만, 리프레시 쿠키는 14일 유효하다(§1.2).
 * 그래서 시작할 때 한 번 재발급을 시도해 로그인 상태를 이어 준다.
 *
 * 만료(1시간)로 401이 나는 경우는 api-client가 알아서 재발급 후 재시도한다.
 * 여기 등록하는 핸들러는 **재발급까지 실패했을 때의 마지막 경로**다 — 세션을 비우고 로그인으로 보낸다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    void (async () => {
      const auth = useAuthStore.getState();
      auth.hydrate();

      // 한 번도 로그인한 적 없는 방문자에게까지 재발급을 쏘지 않는다(무조건 401이고 화면만 늦어진다).
      if (!useAuthStore.getState().accessToken && hadSessionBefore()) {
        await refreshAccessToken();
      }

      // 복구가 끝난 뒤에야 화면이 회원/비회원을 판단하게 한다 — 중간에 켜면 로그인 상태가 깜빡인다.
      useAuthStore.getState().markHydrated();
    })();
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
