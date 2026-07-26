'use client';

import { useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createChatRoom,
  getChatHeader,
  getChatMessages,
  getChatProposal,
  getChatRooms,
  markChatRead,
} from '@lib/api/chat';
import { getNextCursorParam } from '@lib/cursor';
import { queryKeys } from '@lib/query-keys';
import { useMyProfile } from '@hooks/use-my-profile';
import { useAuthStore } from '@store/auth-store';

function useAuthReady() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return hydrated && isAuthenticated;
}

/**
 * CHAT-001 채팅방 목록 (문자열 커서)
 *
 * ⚠️ 서버 구독 채널이 **방 단위(`/sub/chat/rooms/{id}`)뿐**이라, 목록 화면에서는 새 메시지를
 * 실시간으로 받을 방법이 없다(사용자 단위 채널이 없음 — BE 요청 대상).
 * 그래서 화면이 열려 있는 동안만 주기적으로 다시 불러오고, 탭으로 돌아올 때도 갱신한다.
 */
export function useChatRooms() {
  const ready = useAuthReady();

  return useInfiniteQuery({
    queryKey: queryKeys.chat.rooms(),
    queryFn: ({ pageParam }) => getChatRooms(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: getNextCursorParam,
    enabled: ready,
    throwOnError: false,
    // 목록 화면이 떠 있는 동안만 동작한다(언마운트되면 멈춘다).
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useChatHeader(chatId: string) {
  const ready = useAuthReady();

  return useQuery({
    queryKey: queryKeys.chat.header(chatId),
    queryFn: () => getChatHeader(chatId),
    enabled: ready && chatId.length > 0,
    throwOnError: false,
  });
}

/** 교환 제안 카드 — 채팅방 상단 요약(CHAT-002)과 CHAT-003 상세가 공유한다. */
export function useChatProposal(chatId: string) {
  const ready = useAuthReady();

  return useQuery({
    queryKey: queryKeys.chat.proposal(chatId),
    queryFn: () => getChatProposal(chatId),
    enabled: ready && chatId.length > 0,
    throwOnError: false,
  });
}

/**
 * 대화 내역.
 * me/partner 판정에 내 userId가 필요하므로 프로필이 로드된 뒤에 요청한다.
 */
export function useChatMessages(chatId: string) {
  const ready = useAuthReady();
  const { data: profile } = useMyProfile();
  const myUserId = profile?.userId;

  return useInfiniteQuery({
    queryKey: queryKeys.chat.messages(chatId),
    queryFn: ({ pageParam }) =>
      getChatMessages({ chatId, cursor: pageParam, myUserId: myUserId as number }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: getNextCursorParam,
    enabled: ready && chatId.length > 0 && myUserId !== undefined,
    throwOnError: false,
  });
}

/**
 * 교환 제안 → 채팅방 생성 (HOME-004 / EX-006).
 * 성공하면 채팅 목록을 갱신한다(새 방이 목록 맨 앞에 온다).
 */
export function useCreateChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChatRoom,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() }),
  });
}

/** 채팅방에 들어오면 읽음 처리하고 목록의 안 읽음 배지를 갱신한다. */
export function useMarkChatRead(chatId: string) {
  const queryClient = useQueryClient();
  const ready = useAuthReady();

  const mutation = useMutation({
    mutationFn: () => markChatRead(chatId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() }),
  });

  const { mutate } = mutation;
  useEffect(() => {
    if (!ready || !chatId) return;
    mutate();
  }, [ready, chatId, mutate]);

  return mutation;
}
