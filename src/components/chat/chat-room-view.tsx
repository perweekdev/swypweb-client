'use client';

import { useParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ChatInputBar } from '@components/chat/chat-input-bar';
import { ChatMatchInfo } from '@components/chat/chat-match-info';
import { ChatMessageList } from '@components/chat/chat-message-list';
import { useChatHeader, useChatMessages, useChatProposal, useMarkChatRead } from '@hooks/use-chat';
import { useChatSocket } from '@hooks/use-chat-socket';

const EMPTY_SET = { myCards: [], partnerCards: [] };

/**
 * CHAT-002 채팅방.
 *
 * 상단 요약은 헤더(8.3)의 대표 카드가 아니라 **제안 카드 전체(8.4)** 를 쓴다.
 * 헤더는 대표 1장 + 개수만 주는데 화면은 전체 목록이 필요하고, CHAT-003 상세와도 같은 데이터다.
 *
 * ⚠️ 메시지 전송은 WebSocket(I10)이라 이 단계에서는 조회만 동작한다.
 */
export function ChatRoomView() {
  const chatId = String(useParams().id ?? '');

  const { data: header } = useChatHeader(chatId);
  const { data: proposal } = useChatProposal(chatId);
  const { data: messagePages, isPending, isError } = useChatMessages(chatId);
  useMarkChatRead(chatId);
  const { connected, sendMessage } = useChatSocket(chatId);

  // 서버는 최신 메시지부터 내려주므로 화면 표시용으로 시간순(오래된 것 → 최신)으로 뒤집는다.
  const messages = [...(messagePages?.pages.flatMap((page) => page.items) ?? [])].reverse();

  return (
    <>
      {/* 헤더 + 교환 정보는 스크롤해도 상단에 유지 (memo) */}
      <div className="sticky top-0 z-10 bg-background">
        <Header title={header?.partnerNickname ?? ''} />
        <ChatMatchInfo
          roomId={chatId}
          exchangeSet={proposal ?? EMPTY_SET}
          status={header?.status ?? 'ongoing'}
        />
      </div>

      {isPending && (
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          불러오는 중...
        </p>
      )}
      {isError && (
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          대화를 불러오지 못했어요.
        </p>
      )}

      {!isPending && !isError && (
        <ChatMessageList
          messages={messages}
          partner={{ nickname: header?.partnerNickname ?? '', avatarUrl: null }}
        />
      )}

      <ChatInputBar onSend={sendMessage} disabled={!connected} />
    </>
  );
}
