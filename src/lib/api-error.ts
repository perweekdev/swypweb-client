import { isNicknameDuplicatedCode, isNotFoundCode } from '@constants/api-error-codes';
import type { ErrorResponse, FieldErrorResponse } from '@/types/api.types';

/**
 * API 호출 실패를 나타내는 단일 에러 타입.
 *
 * 서버 오류 응답이 세 종류로 갈리기 때문에(docs/api-reference.md §1.5, be-integration-review.md §6-3)
 * 호출부가 그 차이를 몰라도 되도록 여기서 하나로 정규화한다.
 *  1. 공통 ErrorResponse — `{ success:false, error:{ code, message } }`
 *  2. Spring 기본 오류 JSON — Bean Validation 실패, 500 (`{ timestamp, status, error, path }`)
 *  3. 빈 바디 — 401 (실측상 본문이 없다)
 */
export class ApiError extends Error {
  readonly status: number;
  /** 서버 에러 코드. 알 수 없으면 빈 문자열('') */
  readonly code: string;
  readonly fieldErrors: FieldErrorResponse[];
  /** 파싱된 원본 응답 바디(디버깅용). 파싱 불가면 null */
  readonly body: unknown;

  constructor(params: {
    status: number;
    code: string;
    message: string;
    fieldErrors?: FieldErrorResponse[];
    body?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.fieldErrors = params.fieldErrors ?? [];
    this.body = params.body ?? null;
  }

  /** 인증 만료/누락. 리프레시 토큰이 없으므로 재로그인 유도 대상이다. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** not-found. 서버가 코드를 통일하지 않아 status와 code를 함께 본다. */
  get isNotFound(): boolean {
    return this.status === 404 || isNotFoundCode(this.code);
  }

  /** 닉네임 중복(409). 회원가입·닉네임 수정에서 분기용. */
  get isNicknameDuplicated(): boolean {
    return isNicknameDuplicatedCode(this.code);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** 공통 ErrorResponse 형태인지 판별 */
function isErrorResponse(body: unknown): body is ErrorResponse {
  return isRecord(body) && isRecord(body.error) && typeof body.error.code === 'string';
}

const STATUS_FALLBACK_MESSAGE: Record<number, string> = {
  401: '로그인이 필요합니다.',
  403: '권한이 없습니다.',
  404: '요청한 정보를 찾을 수 없습니다.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
};

/**
 * 응답 바디가 어떤 형태로 오든 ApiError로 변환한다.
 * 파싱 실패·빈 바디도 반드시 ApiError를 만들어 반환한다(throw 안 함).
 */
export function toApiError(status: number, body: unknown): ApiError {
  if (isErrorResponse(body)) {
    return new ApiError({
      status,
      code: body.error.code,
      message: body.error.message || fallbackMessage(status),
      fieldErrors: body.error.fieldErrors ?? [],
      body,
    });
  }

  // Spring 기본 오류 JSON: { timestamp, status, error, path, message? }
  if (isRecord(body) && (typeof body.status === 'number' || typeof body.path === 'string')) {
    const message =
      (typeof body.message === 'string' && body.message) ||
      (typeof body.error === 'string' && body.error) ||
      fallbackMessage(status);
    return new ApiError({ status, code: '', message, body });
  }

  // 빈 바디(401 등) 또는 JSON이 아닌 응답
  return new ApiError({ status, code: '', message: fallbackMessage(status), body });
}

function fallbackMessage(status: number): string {
  return STATUS_FALLBACK_MESSAGE[status] ?? `요청에 실패했습니다. (HTTP ${status})`;
}
