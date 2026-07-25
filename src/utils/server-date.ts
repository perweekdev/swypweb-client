/**
 * 서버 날짜 문자열 파싱. 근거: docs/api-reference.md §1.7
 *
 * 서버는 LocalDateTime을 **오프셋 없이** 직렬화한다: "2026-07-24T15:04:05.123"
 * JS의 Date는 오프셋 없는 날짜-시각 문자열을 **브라우저 로컬 시간대**로 해석하므로,
 * KST가 아닌 환경에서는 시각이 어긋난다. 서버 값은 KST이므로 +09:00을 붙여 파싱한다.
 */

const KST_OFFSET = '+09:00';

/** 이미 Z 또는 ±HH:MM 오프셋이 붙어 있는지 */
const HAS_OFFSET = /(?:Z|[+-]\d{2}:?\d{2})$/;

/** 서버 문자열 → Date. 오프셋이 없으면 KST로 간주한다. */
export function parseServerDate(value: string): Date {
  return new Date(HAS_OFFSET.test(value) ? value : `${value}${KST_OFFSET}`);
}

/**
 * 서버 문자열 → 오프셋이 포함된 ISO 문자열.
 *
 * 기존 표시 유틸(@utils/format-time)이 ISO 문자열을 받으므로, 어댑터에서 이 함수로 변환해
 * 넘기면 화면 코드를 고치지 않고 그대로 쓸 수 있다.
 */
export function toIsoString(value: string): string {
  return parseServerDate(value).toISOString();
}
