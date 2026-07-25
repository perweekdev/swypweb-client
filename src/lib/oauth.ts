import { env } from '@lib/env';

/**
 * 구글 OAuth 진입/콜백 처리. 근거: docs/api-reference.md §2.1
 *
 * 서버 주도 플로우다. 프론트는 구글과 직접 통신하지 않고 아래 URL로 **이동만** 한다.
 * (client id/secret은 서버에만 있다.)
 */
export const GOOGLE_LOGIN_URL = `${env.API_ORIGIN}/oauth2/authorization/google`;

/** 전체 페이지 이동이어야 한다. router.push는 외부 URL로 나가지 못한다. */
export function startGoogleLogin(): void {
  window.location.href = GOOGLE_LOGIN_URL;
}

export type OAuthCallbackResult =
  | { status: 'LOGIN_SUCCESS'; accessToken: string }
  | { status: 'SIGNUP_REQUIRED'; signupToken: string }
  | { status: 'INVALID' };

/**
 * 콜백 결과 파싱.
 *
 * ⚠️ 토큰이 쿼리스트링이 아니라 **URL 프래그먼트(`#`)** 로 온다.
 * 프래그먼트는 서버로 전송되지 않으므로 반드시 클라이언트에서 읽어야 한다.
 *   #status=LOGIN_SUCCESS&access_token=<JWT>
 *   #status=SIGNUP_REQUIRED&signup_token=<JWT>
 */
export function parseOAuthCallbackHash(hash: string): OAuthCallbackResult {
  const params = new URLSearchParams(hash.replace(/^#/, ''));

  switch (params.get('status')) {
    case 'LOGIN_SUCCESS': {
      const accessToken = params.get('access_token');
      return accessToken ? { status: 'LOGIN_SUCCESS', accessToken } : { status: 'INVALID' };
    }
    case 'SIGNUP_REQUIRED': {
      const signupToken = params.get('signup_token');
      return signupToken ? { status: 'SIGNUP_REQUIRED', signupToken } : { status: 'INVALID' };
    }
    default:
      return { status: 'INVALID' };
  }
}
