import { api } from '@lib/api-client';

/** 사용자/마이페이지 도메인 API. 근거: docs/api-reference.md §4 */

export interface MyProfileResponse {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  /** 오프셋 없는 KST 로컬시각 — @utils/server-date로 파싱할 것 */
  createdAt: string;
}

/** 4.1 내 프로필 조회. 사용자 없음 → 404(`"404"`) */
export function getMyProfile() {
  return api.get<MyProfileResponse>('/users/me');
}

/** 4.2 닉네임 수정. 중복 → 409 `RESOURCE_002` */
export function updateNickname(nickname: string) {
  return api.patch<{ nickname: string }>('/users/me/nickname', { nickname });
}

/** 프로필 이미지 제약 (4.4). 서버가 Content-Type과 확장자를 **둘 다** 검사한다. */
export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PROFILE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];
export const PROFILE_IMAGE_ACCEPT = PROFILE_IMAGE_MIME_TYPES.join(',');

/** 업로드 전 로컬 검증. 통과하면 null, 아니면 사용자에게 보여줄 사유. */
export function validateProfileImage(file: File): string | null {
  if (!PROFILE_IMAGE_MIME_TYPES.includes(file.type)) {
    return 'JPG 또는 PNG 이미지만 올릴 수 있어요.';
  }
  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    return '이미지 용량은 5MB 이하만 가능해요.';
  }
  return null;
}

/**
 * 4.4 프로필 이미지 수정. `multipart/form-data`, 파트명은 **`image`** 고정.
 * 교체 성공 시 이전 이미지는 서버가 S3에서 삭제한다.
 */
export function updateProfileImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  return api.patch<{ profileImageUrl: string }>('/users/me/profile-image', form);
}

/**
 * 4.3 회원 탈퇴(소프트 삭제). `data`는 null.
 *
 * ⚠️ 서버가 토큰을 무효화하지 않아 탈퇴 후에도 기존 토큰이 최대 1시간 동작한다.
 * 호출부는 성공 즉시 로컬 토큰을 폐기해야 한다.
 * 이미 탈퇴한 계정은 **HTTP 409**(`error.code`는 `"403"`이라 status로 판정할 것).
 */
export function withdraw() {
  return api.delete<null>('/users/me');
}
