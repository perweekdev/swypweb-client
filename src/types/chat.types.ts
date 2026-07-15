import type { ExchangeSet } from '@/types/photocard.types';

/**
 * CHAT 도메인 타입 (docs/storyboard + docs/designed/chat 기준)
 *
 * 교환 상태는 진행중/완료 2단계다.
 * (구버전 IA의 '예약중'은 스토리보드·디자인 모두에 없어 미반영 — docs/dev-plan.md 참고)
 */

/** 교환 진행 상태 */
export type ExchangeStatus = 'ongoing' | 'completed';

/** 메시지 발신자 */
export type MessageSender = 'me' | 'partner';

/** 채팅 상대 */
export interface ChatPartner {
  nickname: string;
  avatarUrl: string | null;
  /** 프로필 사진 에셋 제공 전 placeholder 색. 없으면 기본 아바타(사진 미등록) */
  color?: string;
}

/** 채팅 메시지 */
export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  /** ISO 8601 */
  sentAt: string;
}

/** 채팅방(CHAT-002) */
export interface ChatRoom {
  id: string;
  partner: ChatPartner;
  unreadCount: number;
  status: ExchangeStatus;
  exchangeSet: ExchangeSet;
  messages: ChatMessage[];
  /**
   * 매칭이 아닌 홈 피드(HOME-004) 제안으로 시작된 채팅.
   * 매칭된 내 교환 세트가 없어 교환 완료 후 삭제 팝업을 띄우지 않는다. (memo 예외 1)
   */
  fromFeed: boolean;
}

/**
 * 채팅 목록(CHAT-001)의 한 행.
 * 마지막 메시지는 목록 API가 내려주는 값이라 별도 타입으로 둔다.
 */
export interface ChatRoomSummary {
  id: string;
  partner: ChatPartner;
  lastMessage: string;
  /** ISO 8601 */
  lastMessageAt: string;
  unreadCount: number;
  status: ExchangeStatus;
}

/** 채팅방에서 목록 행을 파생한다. (BE 연동 시 목록 API 응답으로 대체) */
export function toChatRoomSummary(room: ChatRoom): ChatRoomSummary {
  const last = room.messages[room.messages.length - 1];
  return {
    id: room.id,
    partner: room.partner,
    lastMessage: last?.text ?? '',
    lastMessageAt: last?.sentAt ?? '',
    unreadCount: room.unreadCount,
    status: room.status,
  };
}
