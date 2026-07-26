/**
 * 서버 날짜 문자열 파싱.
 *
 * 서버는 `LocalDateTime`을 **오프셋 없이** 직렬화한다: "2026-07-24T15:04:05.123"
 * JS의 Date는 오프셋 없는 값을 **브라우저 로컬 시간대**로 해석하므로 그대로 쓰면 어긋난다.
 *
 * ⚠️ **이 값은 KST다** (api-reference §1.7과 일치). 서버 저장 시각이 여러 번 바뀌었으므로
 * 아래 실측 근거를 남긴다 — 다시 어긋나면 이 주석의 절차로 재확인한다.
 *   - 2026-07-25: 저장값이 **UTC − 9시간**이었다(이중 변환 버그, BE에 보고).
 *   - 2026-07-26: BE 수정 후 재측정. 13:19:56 UTC에 보낸 메시지가 `2026-07-26T22:19:56`으로
 *     저장된다 → **정확히 +9시간 = KST**. 서버 JVM은 여전히 UTC다(오류 응답 `timestamp`가 UTC).
 *   → 화면 표기는 `@utils/format-time`이 `timeZone: 'Asia/Seoul'`로 변환하므로 KST로 보인다.
 *
 * 재확인 방법: 메시지를 보낸 UTC 시각과 `GET /chat-rooms/{id}/messages`의 `createdAt`을 비교한다.
 * 서버가 오프셋을 포함해 내려주면(BE 요청 3-7) 이 가정 자체가 필요 없어진다.
 */

/** 이미 Z 또는 ±HH:MM 오프셋이 붙어 있는지 */
const HAS_OFFSET = /(?:Z|[+-]\d{2}:?\d{2})$/;

/** 서버 문자열 → Date. 오프셋이 없으면 KST로 간주한다. */
export function parseServerDate(value: string): Date {
  return new Date(HAS_OFFSET.test(value) ? value : `${value}+09:00`);
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
