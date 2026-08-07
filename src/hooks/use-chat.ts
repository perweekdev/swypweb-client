'use client';

import { useEffect } from 'react';
import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeChatExchange,
  createChatRoom,
  getChatHeader,
  getChatMessages,
  getChatProposal,
  getChatRooms,
  leaveChatRoom,
  markChatRead,
} from '@lib/api/chat';
import { isApiError } from '@lib/api-error';
import { getNextCursorParam } from '@lib/cursor';
import { queryKeys } from '@lib/query-keys';
import { useMyProfile } from '@hooks/use-my-profile';
import { useAuthStore } from '@store/auth-store';
import type { CursorPage } from '@/types/api.types';
import type { ChatRoomSummary } from '@/types/chat.types';

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

/** 채팅방 상단 정보. `isReceiver`가 교환 완료 버튼의 노출 조건이다. */
export function useChatHeader(chatId: string) {
  const ready = useAuthReady();

  return useQuery({
    queryKey: queryKeys.chat.header(chatId),
    queryFn: () => getChatHeader(chatId),
    enabled: ready && chatId.length > 0,
    throwOnError: false,
  });
}

/**
 * 채팅 상대의 프로필 사진.
 *
 * 채팅방 헤더(8.3)에는 **프로필 이미지 필드가 없고** 목록(8.2)의 `partnerProfileImageUrl`에만 있다.
 * 그래서 목록에서 가져온다.
 *  - 목록을 거쳐 들어왔으면 이미 캐시에 있으므로 **추가 요청이 없다**
 *  - 새로고침·제안 직후처럼 캐시가 없을 때만 목록 첫 페이지를 한 번 부른다
 *
 * 첫 페이지에 없으면(방이 아주 많은 경우) 기본 아바타로 남는다 — 목록은 최근 대화순이라
 * 방금 연 방은 대개 앞쪽에 있고, 목록을 스크롤해 들어온 경우는 위의 캐시 경로가 받는다.
 */
export function useChatPartnerAvatar(chatId: string) {
  const ready = useAuthReady();
  const queryClient = useQueryClient();

  const cached = queryClient
    .getQueryData<InfiniteData<CursorPage<ChatRoomSummary, string>>>(queryKeys.chat.rooms())
    ?.pages.flatMap((page) => page.items)
    .find((room) => room.id === chatId);

  const { data } = useQuery({
    queryKey: queryKeys.chat.partner(chatId),
    queryFn: async () => {
      const page = await getChatRooms();
      return page.items.find((room) => room.id === chatId)?.partner.avatarUrl ?? null;
    },
    enabled: ready && chatId.length > 0 && cached === undefined,
    throwOnError: false,
  });

  return cached?.partner.avatarUrl ?? data ?? null;
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

/** CHAT-004 교환 완료. 성공 시 상단 상태(헤더)와 목록 배지를 갱신한다. */
export function useCompleteChatExchange(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // 고른 포카(양쪽) + 세트에서 지울지 여부(삭제 팝업의 선택)
    mutationFn: (body: {
      deleteSelectedCards: boolean;
      myCardIds: number[];
      partnerCardIds: number[];
    }) => completeChatExchange(chatId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.chat.all });
      // 세트 정리는 서버가 하므로 교환 세트·매칭 캐시도 새로 받는다.
      void queryClient.invalidateQueries({ queryKey: queryKeys.tradeSets.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.matches.all });
    },
  });
}

/**
 * 채팅방 나가기 (CHAT-001 편집 / CHAT-002 ⋮).
 *
 * 벌크 API가 없어 **선택한 수만큼 DELETE를 호출**한다.
 *
 * **이미 끝난 상태는 성공으로 친다** — 409(이미 나간 방)·404(없는 방)는 "나가 있다"는 목표가
 * 이미 달성된 것이므로 오류로 다루지 않는다. 하나가 그런 이유로 실패했다고 나머지까지 되돌릴 이유도 없다.
 *
 * 나간 방은 **서버가 목록에서 빼 준다**(2026-08-08 수정 확인). 목록만 다시 받으면 된다.
 */
export function useLeaveChatRooms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatIds: string[]) => {
      await Promise.all(
        chatIds.map(async (chatId) => {
          try {
            await leaveChatRoom(chatId);
          } catch (caught) {
            const alreadyGone =
              isApiError(caught) && (caught.status === 409 || caught.status === 404);
            if (!alreadyGone) throw caught;
          }
        })
      );
    },
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
