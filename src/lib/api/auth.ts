import { api } from '@lib/api-client';

/** 인증 도메인 API. 근거: docs/api-reference.md §2 */

export interface SignupRequest {
  /** OAuth 콜백에서 받은 임시 토큰(10분). 파싱하지 말고 그대로 전달한다. */
  signupToken: string;
  nickname: string;
}

export interface SignupResponse {
  accessToken: string;
  tokenType: string;
}

/**
 * 회원가입(닉네임 온보딩). 성공 시 HTTP 201.
 * 인증 불필요 — signupToken 자체가 신원 증명이다.
 * 닉네임 중복은 409(`RESOURCE_002`)로만 판별할 수 있다(중복 검사 단독 API 없음).
 */
export function signup(body: SignupRequest) {
  return api.post<SignupResponse>('/auth/signup', body, { auth: false });
}

/** 닉네임 입력 규칙(서버 검증과 동일). 2~20자, 한글/영문/숫자/밑줄. */
export const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9_]+$/;
export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 20;

/** 통과하면 null, 아니면 사용자에게 보여줄 사유를 돌려준다. */
export function validateNickname(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < NICKNAME_MIN_LENGTH || trimmed.length > NICKNAME_MAX_LENGTH) {
    return `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해주세요.`;
  }
  if (!NICKNAME_PATTERN.test(trimmed)) {
    return '한글, 영문, 숫자, 밑줄(_)만 사용할 수 있어요.';
  }
  return null;
}
