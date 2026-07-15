/**
 * 채팅 목록(CHAT-001)의 마지막 메시지 상대 시간.
 * 디자인 표기: 방금 전 / N분 전 / N시간 전 / N일 전 / N주 전 / N달 전
 *
 * now를 주입받는 이유: 목 데이터가 고정 기준 시각(MOCK_NOW)을 쓰기 때문이다.
 * BE 연동 후에는 인자 없이 호출하면 된다.
 */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const minutes = Math.floor((now - Date.parse(iso)) / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}주 전`;

  return `${Math.floor(days / 30)}달 전`;
}
