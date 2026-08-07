import { ApiError, toApiError } from '@lib/api-error';
import { env } from '@lib/env';
import { useAuthStore } from '@store/auth-store';
import type { ApiResponse } from '@/types/api.types';

/**
 * 서버 REST 호출 공통 래퍼. 근거: docs/api-reference.md
 *
 * 호출부가 신경 쓰지 않아도 되게 아래를 여기서 처리한다.
 *  - BaseURL 주입 / 쿼리스트링 조립
 *  - Authorization: Bearer 자동 첨부
 *  - 성공 래퍼 ApiResponse<T> 언랩 → data만 반환
 *  - 오류 정규화 → 항상 ApiError로 throw (api-error.ts)
 *  - 401 발생 시 등록된 핸들러 호출 (재로그인 유도는 I1에서 등록)
 *
 * ⚠️ 토큰을 Zustand 스토어(클라이언트 상태)에서 읽으므로 **클라이언트에서 호출**하는 것을 전제로 한다.
 */

type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export interface RequestOptions {
  query?: QueryParams;
  /**
   * false면 Authorization 헤더를 붙이지 않는다(로그인/약관 등 공개 API).
   * ⚠️ 기본값 true를 유지할 것 — `GET /trade-sets/**`는 문서상 공개지만 토큰이 없으면 500이 난다(§1.9).
   */
  auth?: boolean;
  /**
   * true면 쿠키를 함께 보낸다(`credentials: 'include'`).
   * 리프레시 토큰이 HttpOnly 쿠키라 인증을 쿠키로 하는 API에만 켠다(§1.2 — 로그아웃·재발급).
   * 기본값이 false인 이유: 나머지 API는 Bearer 헤더로 인증하므로 쿠키를 실을 이유가 없다.
   */
  withCredentials?: boolean;
  /**
   * 401을 받아도 재발급을 시도하지 않는다.
   * 재발급 요청 자신에게만 쓴다 — 안 그러면 401 → 재발급 → 401 → … 로 재귀한다.
   */
  skipTokenRefresh?: boolean;
  signal?: AbortSignal;
}

type BodyOptions = RequestOptions & { body?: unknown };

const BASE_URL = env.API_BASE_URL.replace(/\/+$/, '');

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      const values = Array.isArray(value) ? value : [value];
      for (const item of values) {
        // undefined/null은 파라미터 자체를 생략한다(커서 첫 페이지 등).
        if (item === undefined || item === null) continue;
        url.searchParams.append(key, String(item));
      }
    }
  }

  return url.toString();
}

/** 본문이 비어 있거나 JSON이 아닐 수 있다(401은 실측상 빈 바디). */
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** 성공 래퍼면 data를 꺼내고, 아니면 그대로 돌려준다. */
function unwrap<T>(payload: unknown): T {
  if (isRecord(payload) && payload.success === true && 'data' in payload) {
    return (payload as unknown as ApiResponse<T>).data;
  }
  return payload as T;
}

type UnauthorizedHandler = (error: ApiError) => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * 401 발생 시 호출될 핸들러를 등록한다.
 * **재발급까지 실패했을 때만** 불린다 — 재발급이 성공하면 원래 요청이 재시도되고 여기까지 오지 않는다.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

/**
 * 진행 중인 재발급. **동시에 두 번 이상 돌면 안 된다.**
 *
 * 서버는 리프레시 토큰을 회전시키면서, 이미 쓴 토큰이 다시 오면 **탈취로 간주해
 * 그 사용자의 토큰을 전부 삭제**한다(§2.3). 401을 받은 요청이 여러 개면 각자 재발급을 시도하는데,
 * 두 번째 요청이 이 판정에 걸려 **모든 기기에서 강제 로그아웃**된다.
 * 그래서 첫 요청의 Promise를 공유하고 나머지는 그 결과를 기다린다.
 */
let refreshInFlight: Promise<boolean> | null = null;

/**
 * 새 accessToken을 받아 스토어에 넣는다. 성공 여부만 돌려준다.
 *
 * 두 곳에서 부른다 — **401을 받았을 때**(만료)와 **앱 시작 시**(탭을 닫아 토큰이 사라진 경우).
 * 어느 쪽이든 위 `refreshInFlight`를 공유하므로 동시에 두 번 나가지 않는다.
 */
export function refreshAccessToken(): Promise<boolean> {
  refreshInFlight ??= (async () => {
    try {
      // 인증은 `refresh_token` 쿠키로 한다 — Authorization 헤더도, 요청 바디도 없다(§2.3).
      const data = await request<{ accessToken: string }>('POST', '/auth/refresh', {
        auth: false,
        withCredentials: true,
        skipTokenRefresh: true,
      });
      useAuthStore.getState().setAccessToken(data.accessToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function request<T>(
  method: string,
  path: string,
  options: BodyOptions = {},
  /** 재발급 후 한 번만 재시도한다. 무한 반복을 막는 표식 */
  isRetry = false
): Promise<T> {
  const {
    query,
    body,
    auth = true,
    withCredentials = false,
    skipTokenRefresh = false,
    signal,
  } = options;

  // multipart는 브라우저가 boundary를 포함해 Content-Type을 직접 붙여야 한다.
  // 여기서 지정하면 boundary가 빠져 서버가 파트를 파싱하지 못한다.
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const headers: Record<string, string> = {};
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';

  const accessToken = auth ? useAuthStore.getState().accessToken : null;
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
      credentials: withCredentials ? 'include' : 'same-origin',
      signal,
    });
  } catch (error) {
    // 요청 취소는 호출부(React Query 등)가 처리하도록 그대로 올린다.
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError({
      status: 0,
      code: '',
      message: '네트워크 연결에 실패했습니다. 연결 상태를 확인해 주세요.',
    });
  }

  const payload = await readBody(response);

  if (!response.ok) {
    const apiError = toApiError(response.status, payload);

    if (apiError.isUnauthorized) {
      // 토큰이 있었는데 거부당한 경우에만 재발급을 시도한다.
      // 비로그인 상태의 401은 만료가 아니라 '원래 못 쓰는 API'라 재발급해도 소용없다.
      const expired = auth && !isRetry && !skipTokenRefresh && accessToken !== null;

      if (expired && (await refreshAccessToken())) {
        // 새 토큰으로 원래 요청을 그대로 한 번 더 보낸다(헤더는 아래에서 다시 읽는다).
        return request<T>(method, path, options, true);
      }
      unauthorizedHandler?.(apiError);
    }

    throw apiError;
  }

  return unwrap<T>(payload);
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
};
