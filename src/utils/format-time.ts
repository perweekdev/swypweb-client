/**
 * 채팅 목록(CHAT-001)의 마지막 메시지 상대 시간.
 * 디자인 표기: 방금 전 / N분 전 / N시간 전 / N일 전 / N주 전 / N달 전
 *
 * now를 주입받는 이유: 목 데이터가 고정 기준 시각(MOCK_NOW)을 쓰기 때문이다.
 * BE 연동 후에는 인자 없이 호출하면 된다.
 */
// 서비스 기준 시간대 고정. 서버(UTC)와 브라우저(KST) 렌더 결과가 갈리지 않게 한다.
const TIME_ZONE = 'Asia/Seoul';

/** 채팅방(CHAT-002) 날짜 구분선: "2026년 7월 4일" */
export function formatChatDate(iso: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

/** 채팅방(CHAT-002) 메시지 시간: "오전 9:02" */
export function formatChatTime(iso: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

/** 같은 날짜인지 (날짜 구분선 삽입 판단용) */
export function isSameChatDate(a: string, b: string): boolean {
  return formatChatDate(a) === formatChatDate(b);
}

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
