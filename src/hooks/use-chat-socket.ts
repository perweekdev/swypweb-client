'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { env } from '@lib/env';
import { queryKeys } from '@lib/query-keys';
import { useMyProfile } from '@hooks/use-my-profile';
import { useAuthStore } from '@store/auth-store';
import { toIsoString } from '@utils/server-date';
import type { CursorPage } from '@/types/api.types';
import type { ChatMessage } from '@/types/chat.types';

/**
 * 채팅 실시간 연결 (STOMP over native WebSocket). 근거: docs/api-reference.md §8.7
 *
 * - SockJS가 아니라 **순수 STOMP**다 → `webSocketFactory`로 native WebSocket을 직접 넘긴다.
 * - 인증은 CONNECT 프레임 헤더의 `Authorization: Bearer` (없으면 연결 거부).
 * - 구독 주소는 `^/sub/chat/rooms/(\d+)$` 로 **엄격 매칭** — 뒤에 경로를 덧붙이면 거부된다.
 */

interface IncomingMessage {
  messageId: number;
  senderId: number;
  type: 'TEXT' | 'IMAGE' | 'SYSTEM';
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
}

type MessagePages = InfiniteData<CursorPage<ChatMessage, number>, number | undefined>;

export function useChatSocket(chatId: string) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: profile } = useMyProfile();
  const myUserId = profile?.userId;

  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  // 수신 메시지를 목록 캐시 맨 앞에 넣는다(서버가 최신순으로 주므로 첫 페이지의 선두).
  const appendMessage = useCallback(
    (incoming: IncomingMessage) => {
      const message: ChatMessage = {
        id: String(incoming.messageId),
        sender: incoming.senderId === myUserId ? 'me' : 'partner',
        text: incoming.content ?? '',
        sentAt: toIsoString(incoming.createdAt),
      };

      queryClient.setQueryData<MessagePages>(queryKeys.chat.messages(chatId), (previous) => {
        if (!previous) return previous;
        const [first, ...rest] = previous.pages;
        if (!first) return previous;
        // 재연결 등으로 같은 메시지가 두 번 올 수 있어 중복을 막는다.
        if (first.items.some((item) => item.id === message.id)) return previous;

        return {
          ...previous,
          pages: [{ ...first, items: [message, ...first.items] }, ...rest],
        };
      });

      // 목록 화면의 마지막 메시지·안읽음도 갱신되도록 무효화한다.
      void queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
    },
    [chatId, myUserId, queryClient]
  );

  useEffect(() => {
    if (!accessToken || !chatId || myUserId === undefined) return;

    const client = new Client({
      webSocketFactory: () => new WebSocket(env.WS_URL),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/sub/chat/rooms/${chatId}`, (frame) => {
          try {
            appendMessage(JSON.parse(frame.body) as IncomingMessage);
          } catch {
            // 파싱 불가한 프레임은 무시한다(연결을 끊지 않는다).
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current = null;
      setConnected(false);
      void client.deactivate();
    };
  }, [accessToken, chatId, myUserId, appendMessage]);

  /** 메시지 전송. 서버가 브로드캐스트로 되돌려주므로 낙관적 추가는 하지 않는다. */
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      const client = clientRef.current;
      if (!trimmed || !client?.connected) return false;

      client.publish({
        destination: '/pub/chat/messages',
        body: JSON.stringify({
          chatRoomId: Number(chatId),
          type: 'TEXT',
          content: trimmed,
          imageUrl: null,
        }),
      });
      return true;
    },
    [chatId]
  );

  return { connected, sendMessage };
}
