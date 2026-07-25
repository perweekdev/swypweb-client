/**
 * 서버 공통 응답 계약. 근거: docs/api-reference.md §1.3~1.6
 *
 * 성공과 오류의 **구조가 서로 다르다**는 점이 핵심이다.
 * 성공은 ApiResponse<T> 래퍼, 오류는 ErrorResponse로 내려온다.
 */

/** 성공 응답 래퍼. 실제 페이로드는 data에 들어 있다. */
export interface ApiResponse<T> {
  success: true;
  /** 애플리케이션 코드. 대체로 HTTP status와 같지만 항상은 아니다(§1.3 주의). */
  code: number;
  message: string;
  data: T;
}

/**
 * ⚠️ 서버가 정의만 해두고 실제로 채우지 않는다(§1.5).
 * 전역 예외 핸들러가 없어 Bean Validation 오류는 이 포맷으로 오지 않는다.
 */
export interface FieldErrorResponse {
  field?: string;
  message?: string;
}

/** 오류 응답. 성공 래퍼와 구조가 다르다. */
export interface ErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    fieldErrors: FieldErrorResponse[];
  };
}

/**
 * 커서 페이지네이션 정규화 결과(§1.6).
 *
 * 서버 원본은 ① 아이템 배열의 키가 API마다 다르고(`groups`, `messages` 등)
 * ② 다음 커서 필드명이 `nextCursor` / `newCursor`로 혼재한다.
 * 이 타입은 그 차이를 흡수한 뒤의 모양이다. → toCursorPage() 사용.
 */
export interface CursorPage<T, TCursor extends number | string = number> {
  items: T[];
  /** 마지막 페이지면 null */
  nextCursor: TCursor | null;
  hasNext: boolean;
}
