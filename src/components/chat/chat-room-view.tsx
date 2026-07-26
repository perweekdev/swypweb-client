'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ChatInputBar } from '@components/chat/chat-input-bar';
import { ChatMatchInfo } from '@components/chat/chat-match-info';
import { ChatMessageList } from '@components/chat/chat-message-list';
import { useChatHeader, useChatMessages, useChatProposal, useMarkChatRead } from '@hooks/use-chat';
import { useChatSocket } from '@hooks/use-chat-socket';
import { uploadChatImage, validateChatImage } from '@lib/api/chat';
import { isApiError } from '@lib/api-error';
import { ROUTES } from '@constants/routes';

/**
 * CHAT-002 채팅방.
 *
 * 상단 요약은 헤더(8.3)의 대표 카드가 아니라 **제안 카드 전체(8.4)** 를 쓴다.
 * 헤더는 대표 1장 + 개수만 주는데 화면은 전체 목록이 필요하고, CHAT-003 상세와도 같은 데이터다.
 *
 * 메시지 전송·수신은 STOMP WebSocket이다(`useChatSocket`).
 */
export function ChatRoomView() {
  const router = useRouter();
  const chatId = String(useParams().id ?? '');
  // 제안 직후 만들어진 방(`?new=1`)은 뒤로가기를 채팅 목록으로 보낸다.
  // 그대로 히스토리를 되짚으면 이미 끝난 '교환할 포카 선택' 이전 화면이 다시 나온다.
  const isNewRoom = useSearchParams().get('new') === '1';

  const { data: header } = useChatHeader(chatId);
  const { data: proposal } = useChatProposal(chatId);
  const { data: messagePages, isPending, isError } = useChatMessages(chatId);
  useMarkChatRead(chatId);
  const { connected, sendMessage, sendImage } = useChatSocket(chatId);
  const [imageError, setImageError] = useState<string | null>(null);

  // 사진 첨부: 업로드해서 받은 URL을 IMAGE 메시지로 보낸다(§8.7).
  const handlePickImage = async (file: File) => {
    const invalidReason = validateChatImage(file);
    if (invalidReason) {
      setImageError(invalidReason);
      return;
    }

    setImageError(null);
    try {
      const imageUrl = await uploadChatImage(chatId, file);
      // 업로드는 됐어도 소켓이 끊겨 있으면 전송이 실패한다 — 조용히 사라지지 않게 알린다.
      if (!sendImage(imageUrl)) {
        setImageError('연결이 끊겨 사진을 보내지 못했어요. 잠시 후 다시 시도해주세요.');
      }
    } catch (caught) {
      setImageError(isApiError(caught) ? caught.message : '사진을 보내지 못했어요.');
    }
  };

  // 화면은 위→아래가 오래된 순이어야 한다.
  // 서버 응답 순서나 페이지 병합 순서에 의존하지 않도록 messageId(증가값)로 직접 정렬한다.
  const messages = [...(messagePages?.pages.flatMap((page) => page.items) ?? [])].sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

  return (
    <>
      {/* 헤더 + 교환 정보는 스크롤해도 상단에 유지 (memo) */}
      <div className="sticky top-0 z-10 bg-background">
        <Header
          title={header?.partnerNickname ?? ''}
          onBack={isNewRoom ? () => router.replace(ROUTES.chat) : undefined}
        />
        {/* 제안 카드가 오기 전에는 렌더하지 않는다 — 요약이 대표 카드 1장을 직접 참조해서,
            빈 배열이면 undefined 접근으로 터진다. */}
        {proposal && (
          <ChatMatchInfo
            roomId={chatId}
            exchangeSet={proposal}
            status={header?.status ?? 'ongoing'}
            isReceiver={header?.isReceiver ?? null}
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

      {imageError && <p className="px-4 pb-1 text-center text-body3 text-red-900">{imageError}</p>}
      <ChatInputBar
        onSend={sendMessage}
        onPickImage={(file) => void handlePickImage(file)}
        disabled={!connected}
      />
    </>
  );
}
