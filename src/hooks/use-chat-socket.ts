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

  const appendMessage = useCallback(
    (incoming: IncomingMessage) => {
      const message: ChatMessage = {
        id: String(incoming.messageId),
        sender: incoming.senderId === myUserId ? 'me' : 'partner',
        text: incoming.content ?? '',
        imageUrl: incoming.imageUrl,
        // 실시간 프레임의 시각 형식이 REST와 다를 수 있다. 파싱에 실패하면 '방금 도착'으로 보정한다
        // — 여기서 빈 값을 넣으면 메시지 목록 렌더가 통째로 실패한다.
        sentAt: toIsoString(incoming.createdAt) || new Date().toISOString(),
      };

      queryClient.setQueryData<MessagePages>(queryKeys.chat.messages(chatId), (previous) => {
        if (!previous || previous.pages.length === 0) return previous;
        // 재연결 등으로 같은 메시지가 두 번 올 수 있어 중복을 막는다.
        const exists = previous.pages.some((page) =>
          page.items.some((item) => item.id === message.id)
        );
        if (exists) return previous;

        // 서버 목록은 오래된 것 → 최신 순이므로 **마지막 페이지의 끝**에 붙인다.
        // (화면은 messageId로 다시 정렬하므로 순서가 어긋나도 표시는 안전하다)
        const lastIndex = previous.pages.length - 1;
        const pages = previous.pages.map((page, index) =>
          index === lastIndex ? { ...page, items: [...page.items, message] } : page
        );

        return { ...previous, pages };
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
          let incoming: IncomingMessage;
          try {
            incoming = JSON.parse(frame.body) as IncomingMessage;
          } catch {
            return; // 파싱 불가한 프레임만 버린다(연결은 유지).
          }
          // 캐시 반영은 try로 감싸지 않는다 — 여기서 조용히 삼키면 메시지가 유실된 것처럼 보인다.
          appendMessage(incoming);
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

  /** 서버가 브로드캐스트로 되돌려주므로 낙관적 추가는 하지 않는다. */
  const publish = useCallback(
    (payload: { type: 'TEXT' | 'IMAGE'; content: string | null; imageUrl: string | null }) => {
      const client = clientRef.current;
      if (!client?.connected) return false;

      client.publish({
        destination: '/pub/chat/messages',
        body: JSON.stringify({ chatRoomId: Number(chatId), ...payload }),
      });
      return true;
    },
    [chatId]
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return false;
      return publish({ type: 'TEXT', content: trimmed, imageUrl: null });
    },
    [publish]
  );

  /** 업로드로 얻은 URL을 IMAGE 메시지로 보낸다(§8.7). */
  const sendImage = useCallback(
    (imageUrl: string) => publish({ type: 'IMAGE', content: null, imageUrl }),
    [publish]
  );

  return { connected, sendMessage, sendImage };
}
