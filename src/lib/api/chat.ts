import { api } from '@lib/api-client';
import { toCursorPage } from '@lib/cursor';
import { toIsoString } from '@utils/server-date';
import type { CursorPage } from '@/types/api.types';
import type { ChatMessage, ChatRoomSummary, ExchangeStatus } from '@/types/chat.types';
import type { ExchangeSet, Photocard } from '@/types/photocard.types';
import { PLACEHOLDER_COLOR } from '@constants/colors';

/** 채팅 API. 근거: docs/api-reference.md §8 */

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
  /** 내가 제안을 '받은' 쪽인지 (교환 완료 권한). 배포 서버 응답으로 확인함. */
  isReceiver?: boolean;
}

export interface ChatRoomHeader {
  partnerNickname: string;
  status: ExchangeStatus;
  /**
   * 내가 제안을 **'받은' 쪽인가.** 교환 완료는 받은 쪽만 할 수 있어 버튼 노출 조건이 된다.
   *
   * 값이 없으면 `null`(판단 불가)이고, 이때는 버튼을 **가리지 않는다** — 잘못 숨겨서
   * 아무도 완료하지 못하게 되는 쪽이, 눌렀을 때 403 안내를 보는 쪽보다 나쁘다.
   */
  isReceiver: boolean | null;
}

export async function getChatHeader(chatId: string): Promise<ChatRoomHeader> {
  const data = await api.get<ChatHeaderResponse>(`/chat-rooms/${chatId}/header`);
  return {
    partnerNickname: data.partnerNickname,
    status: toStatus(data.isCompleted),
    isReceiver: typeof data.isReceiver === 'boolean' ? data.isReceiver : null,
  };
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

/**
 * 채팅방 나가기 (§8.10). "방 폭파"가 아니라 **참여자 단위 나가기**다.
 *
 * `roomDeleted`가 true면 상대도 이미 나가 있어 방·메시지가 DB에서 완전히 삭제된 것이고,
 * false면 나만 나간 상태로 상대에게는 방이 그대로 남는다.
 *
 * ⚠️ **서버가 "나감"을 조회에 반영하지 않는다**(§8.10 결함) — 목록·헤더·메시지 어디에도
 * `deleted_at` 필터가 없어 나간 방이 계속 보인다. 그래서 호출부가 나간 방을 로컬에 기억해 숨긴다.
 */
export function leaveChatRoom(chatId: string) {
  return api.delete<{ chatRoomId: number; roomDeleted: boolean }>(`/chat-rooms/${chatId}`);
}

/**
 * 교환 완료 처리 (CHAT-004).
 *
 * 세 필드 모두 **필수**이고 카드 배열은 **비어 있으면 400**이다(2026-07-26 실측으로 확정 —
 * API 문서 §8.9는 `deleteTradedCards` 하나만 적고 있어 실제와 다르다).
 *   - `deleteSelectedCards` — 교환된 포카를 교환 세트에서 지울지. 삭제 팝업의 선택이 들어간다
 *   - `myCardIds` / `partnerCardIds` — 화면에서 고른 **교환 완료된 포카**의 photoCardId
 *
 * 세트 정리는 **서버가 수행**하므로 프론트가 교환 세트 id를 알 필요는 없다.
 *
 * 오류: 400(검증) / 404(없는 chatId) / 403 `AUTH_007`(제안을 받은 쪽이 아니거나 참여자 아님)
 */
export function completeChatExchange(
  chatId: string,
  body: { deleteSelectedCards: boolean; myCardIds: number[]; partnerCardIds: number[] }
) {
  return api.patch<{ chatId: number; isCompleted: boolean; deleteSelectedCards: boolean }>(
    `/chat-rooms/${chatId}/complete`,
    body
  );
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
