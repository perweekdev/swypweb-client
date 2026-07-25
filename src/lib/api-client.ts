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
 * 리프레시 토큰이 없으므로(§1.2) 재로그인 유도가 유일한 복구 경로다. 등록은 I1에서 한다.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

async function request<T>(method: string, path: string, options: BodyOptions = {}): Promise<T> {
  const { query, body, auth = true, signal } = options;

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
    if (apiError.isUnauthorized) unauthorizedHandler?.(apiError);
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
