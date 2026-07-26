/**
 * 서버 날짜 문자열 파싱.
 *
 * 서버는 `LocalDateTime`을 **오프셋 없이** 직렬화한다: "2026-07-24T15:04:05.123"
 * JS의 Date는 오프셋 없는 값을 **브라우저 로컬 시간대**로 해석하므로 그대로 쓰면 어긋난다.
 *
 * ⚠️ **이 값은 UTC다.** (api-reference §1.7은 KST라고 안내하지만 실제와 다르다)
 *   - 서버 JVM 시계가 UTC로 동작함을 확인했다(Spring 오류 응답의 `timestamp`가 UTC와 일치).
 *   - 교차 검증: 홈 피드 교환글 `createdAt`이 2026-07-25T08:47:55인데, 그날 로그인이 가능해진
 *     시각은 14:17 KST였다. KST라면 로그인 전에 글을 쓴 셈이라 성립하지 않는다.
 *   → 화면 표기는 `@utils/format-time`이 `timeZone: 'Asia/Seoul'`로 변환하므로 KST로 보인다.
 *
 * 서버가 오프셋을 포함해 내려주면(§ BE 요청 3-7) 이 가정은 필요 없어진다.
 */

/** 이미 Z 또는 ±HH:MM 오프셋이 붙어 있는지 */
const HAS_OFFSET = /(?:Z|[+-]\d{2}:?\d{2})$/;

/** 서버 문자열 → Date. 오프셋이 없으면 UTC로 간주한다. */
export function parseServerDate(value: string): Date {
  return new Date(HAS_OFFSET.test(value) ? value : `${value}Z`);
}

/**
 * 서버 문자열 → 오프셋이 포함된 ISO 문자열.
 *
 * 기존 표시 유틸(@utils/format-time)이 ISO 문자열을 받으므로, 어댑터에서 이 함수로 변환해
 * 넘기면 화면 코드를 고치지 않고 그대로 쓸 수 있다.
 *
 * 파싱할 수 없는 값이면 **빈 문자열**을 돌려준다 — 여기서 예외가 나면 메시지 수신 자체가
 * 통째로 유실되므로, 실패를 표시 단계로 넘긴다.
 */
export function toIsoString(value: string): string {
  const date = parseServerDate(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
