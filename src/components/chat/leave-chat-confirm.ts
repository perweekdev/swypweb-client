/**
 * 채팅방 나가기 확인 문구 (디자인 `docs/designed/chat/delete/default.png`).
 *
 * 목록(CHAT-001 편집)과 채팅방(CHAT-002 ⋮) **두 곳에서 같은 팝업**을 띄우므로 문구를 한 곳에 둔다.
 * 서버는 확인 절차 없이 바로 지우고 **양쪽이 다 나가면 복구가 불가능**하다(§8.10) —
 * 이 팝업은 프론트가 반드시 띄워야 한다.
 */
export const LEAVE_CHAT_CONFIRM = {
  title: '정말 채팅방을 나가시겠어요?',
  description: '채팅 목록 및 대화 내용이 삭제되고 상대와의 대화가 종료돼요.',
  confirmText: '나가기',
} as const;
