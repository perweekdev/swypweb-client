/**
 * CSS 클래스로 표현할 수 없는 자리(인라인 style·캔버스 등)에서 쓰는 색상값.
 * 클래스를 쓸 수 있는 곳에서는 항상 Tailwind 토큰(`bg-secondary-50` 등)을 쓴다.
 */

/**
 * 포카 이미지가 없을 때 채우는 색 (= 디자인 토큰 `secondary-50`).
 *
 * 카드 색은 데이터로 내려와 `style={{ backgroundColor }}`로 들어가므로 클래스를 쓸 수 없다.
 * 파일마다 따로 선언하면 토큰이 바뀔 때 일부만 남아 어긋나므로 여기 한 곳에서만 정의한다.
 */
export const PLACEHOLDER_COLOR = '#E6E8EB';
