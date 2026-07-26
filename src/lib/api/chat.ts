import { api } from '@lib/api-client';
import { toCursorPage } from '@lib/cursor';
import { toIsoString } from '@utils/server-date';
import type { CursorPage } from '@/types/api.types';
import type { ChatMessage, ChatRoomSummary, ExchangeStatus } from '@/types/chat.types';
import type { ExchangeSet, Photocard } from '@/types/photocard.types';

/** 채팅 API. 근거: docs/api-reference.md §8 */

const PLACEHOLDER_COLOR = '#E6E8EB';

interface ChatCardResponse {
  photoCardId?: number;
  photoCardName: string;
  albumName: string;
  versionName: string;
  imageUrl: string | null;
}

/** 서버에 `memberName`이 없어 카드명을 첫 줄(멤버명 자리)에 넣는다. */
function toCard(card: ChatCardResponse, fallbackId: string): Photocard {
  return {
    id: String(card.photoCardId ?? fallbackId),
    memberName: card.photoCardName,
    albumName: card.albumName,
    versionName: card.versionName,
    imageUrl: card.imageUrl,
    color: PLACEHOLDER_COLOR,
  };
}

const toStatus = (isCompleted: boolean): ExchangeStatus => (isCompleted ? 'completed' : 'ongoing');

// ─────────────────────────── 8.2 목록

interface ChatRoomListItem {
  chatId: number;
  partnerNickname: string;
  partnerProfileImageUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  isCompleted: boolean;
}

/** 채팅방 목록. 문자열 커서(Base64 opaque). */
export async function getChatRooms(cursor?: string) {
  const raw = await api.get<unknown>('/chat-rooms', { query: { cursor } });
  const page = toCursorPage<ChatRoomListItem, string>(raw, 'chats');

  return {
    items: page.items.map((room) => ({
      id: String(room.chatId),
      partner: { nickname: room.partnerNickname, avatarUrl: room.partnerProfileImageUrl },
      lastMessage: room.lastMessage ?? '',
      // 서버 시각은 오프셋이 없다 → KST로 간주해 ISO로 바꿔 표시 유틸에 넘긴다.
      lastMessageAt: room.lastMessageAt ? toIsoString(room.lastMessageAt) : '',
      unreadCount: room.unreadCount,
      status: toStatus(room.isCompleted),
    })),
    nextCursor: page.nextCursor,
    hasNext: page.hasNext,
  } satisfies CursorPage<ChatRoomSummary, string>;
}

// ─────────────────────────── 8.3 상단 정보

interface ChatHeaderResponse {
  chatId: number;
  partnerNickname: string;
  isCompleted: boolean;
  representHaveCardInfo: ChatCardResponse | null;
  representWantCardInfo: ChatCardResponse | null;
  haveCardCount: number;
  wantCardCount: number;
}

export interface ChatRoomHeader {
  partnerNickname: string;
  status: ExchangeStatus;
}

export async function getChatHeader(chatId: string): Promise<ChatRoomHeader> {
  const data = await api.get<ChatHeaderResponse>(`/chat-rooms/${chatId}/header`);
  return { partnerNickname: data.partnerNickname, status: toStatus(data.isCompleted) };
}

// ─────────────────────────── 8.4 교환 제안 카드

/** 제안 카드 전체. 채팅방 상단 요약과 CHAT-003 상세가 같은 데이터를 쓴다. */
export async function getChatProposal(chatId: string): Promise<ExchangeSet> {
  const data = await api.get<{ haveCards: ChatCardResponse[]; wantCards: ChatCardResponse[] }>(
    `/chat-rooms/${chatId}/proposal`
  );

  return {
    myCards: data.haveCards.map((card, i) => toCard(card, `have-${i}`)),
    partnerCards: data.wantCards.map((card, i) => toCard(card, `want-${i}`)),
  };
}

// ─────────────────────────── 8.5 대화 내역

interface ChatMessageResponse {
  messageId: number;
  senderId: number;
  type: 'TEXT' | 'IMAGE' | 'SYSTEM';
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
}

/**
 * 과거 메시지. 숫자 커서, 기본 30장.
 * ⚠️ `senderId`가 숫자 userId라 me/partner 구분은 **내 userId와 비교**해야 한다.
 */
export async function getChatMessages(params: {
  chatId: string;
  cursor?: number;
  myUserId: number;
}) {
  const raw = await api.get<unknown>(`/chat-rooms/${params.chatId}/messages`, {
    query: { cursor: params.cursor },
  });
  const page = toCursorPage<ChatMessageResponse, number>(raw, 'messages');

  return {
    items: page.items.map((message) => ({
      id: String(message.messageId),
      sender: message.senderId === params.myUserId ? ('me' as const) : ('partner' as const),
      text: message.content ?? '',
      imageUrl: message.imageUrl,
      sentAt: toIsoString(message.createdAt),
    })),
    nextCursor: page.nextCursor,
    hasNext: page.hasNext,
  } satisfies CursorPage<ChatMessage, number>;
}

/** 8.6 읽음 처리 */
export function markChatRead(chatId: string) {
  return api.patch<{ chatId: number; unreadCount: number }>(`/chat-rooms/${chatId}/read`);
}

/** 채팅 이미지 제약. 프로필 이미지와 동일하게 가정한다(서버 확인 필요). */
export const CHAT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const CHAT_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];
export const CHAT_IMAGE_ACCEPT = CHAT_IMAGE_MIME_TYPES.join(',');

export function validateChatImage(file: File): string | null {
  if (!CHAT_IMAGE_MIME_TYPES.includes(file.type)) return 'JPG 또는 PNG 이미지만 보낼 수 있어요.';
  if (file.size > CHAT_IMAGE_MAX_BYTES) return '이미지 용량은 5MB 이하만 가능해요.';
  return null;
}

/**
 * 채팅 이미지 업로드 → 응답의 `imageUrl`을 WebSocket `IMAGE` 메시지로 보낸다(§8.7).
 *
 * ⚠️ **경로/파트명 확인 필요.** 문서(`c751ce9`)에는 미구현으로 되어 있어 인벤토리 경로를 따랐다.
 * 서버 명세가 다르면 **이 함수만** 고치면 된다.
 */
export async function uploadChatImage(chatId: string, file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const data = await api.post<{ imageUrl: string }>(`/chat-rooms/${chatId}/messages/image`, form);
  return data.imageUrl;
}

/** 8.1 채팅방 생성(교환 제안). 본인 세트에 제안 → 403 `AUTH_006` */
export function createChatRoom(body: {
  targetTradeSetId: number;
  receiveCardIds: number[];
  giveCardIds: number[];
}) {
  return api.post<{ chatRoomId: number; partnerNickname: string }>('/chat-rooms', body);
}
