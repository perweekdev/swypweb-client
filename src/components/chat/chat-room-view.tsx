'use client';

import { useParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ChatInputBar } from '@components/chat/chat-input-bar';
import { ChatMatchInfo } from '@components/chat/chat-match-info';
import { ChatMessageList } from '@components/chat/chat-message-list';
import { useChatHeader, useChatMessages, useChatProposal, useMarkChatRead } from '@hooks/use-chat';
import { useChatSocket } from '@hooks/use-chat-socket';

/**
 * CHAT-002 채팅방.
 *
 * 상단 요약은 헤더(8.3)의 대표 카드가 아니라 **제안 카드 전체(8.4)** 를 쓴다.
 * 헤더는 대표 1장 + 개수만 주는데 화면은 전체 목록이 필요하고, CHAT-003 상세와도 같은 데이터다.
 *
 * 메시지 전송·수신은 STOMP WebSocket이다(`useChatSocket`).
 */
export function ChatRoomView() {
  const chatId = String(useParams().id ?? '');

  const { data: header } = useChatHeader(chatId);
  const { data: proposal } = useChatProposal(chatId);
  const { data: messagePages, isPending, isError } = useChatMessages(chatId);
  useMarkChatRead(chatId);
  const { connected, sendMessage } = useChatSocket(chatId);

  // 화면은 위→아래가 오래된 순이어야 한다.
  // 서버 응답 순서나 페이지 병합 순서에 의존하지 않도록 messageId(증가값)로 직접 정렬한다.
  const messages = [...(messagePages?.pages.flatMap((page) => page.items) ?? [])].sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

  return (
    <>
      {/* 헤더 + 교환 정보는 스크롤해도 상단에 유지 (memo) */}
      <div className="sticky top-0 z-10 bg-background">
        <Header title={header?.partnerNickname ?? ''} />
        {/* 제안 카드가 오기 전에는 렌더하지 않는다 — 요약이 대표 카드 1장을 직접 참조해서,
            빈 배열이면 undefined 접근으로 터진다. */}
        {proposal && (
          <ChatMatchInfo
            roomId={chatId}
            exchangeSet={proposal}
            status={header?.status ?? 'ongoing'}
          />
        )}
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
