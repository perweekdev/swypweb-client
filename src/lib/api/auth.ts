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

/**
 * 로그아웃 (§2.4). 서버가 리프레시 토큰을 폐기하고 쿠키를 지운다.
 *
 * - **인증 헤더가 필요 없다.** 신원 확인은 `refresh_token` 쿠키로 하므로 쿠키만 실어 보낸다.
 * - **쿠키가 없어도 항상 200**이라 응답을 보고 분기할 게 없다.
 *   즉 200이 "서버측 토큰이 실제로 폐기됐다"는 보장은 아니다.
 *
 * ⚠️ accessToken은 서버에 블랙리스트가 없어 만료(1시간) 전까지 유효하다.
 * **로컬 토큰 삭제는 호출부가 반드시 따로 해야 한다.**
 */
export function logout() {
  return api.post<null>('/auth/logout', undefined, { auth: false, withCredentials: true });
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
