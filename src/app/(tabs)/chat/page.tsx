'use client';

import { useAuthStore } from '@store/auth-store';
import { TabHeader } from '@components/layout/tab-header';
import { ChatEmptyState } from '@components/chat/chat-empty-state';
import { ChatListRow } from '@components/chat/chat-list-row';
import { useChatRooms } from '@hooks/use-chat';

/** CHAT-001 채팅 목록. 비회원이거나 진행된 채팅이 없으면 빈 상태(CHAT-005). */
export default function ChatPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isPending, isError } = useChatRooms();
  const rooms = data?.pages.flatMap((page) => page.items) ?? [];

  // 비회원은 채팅 내역이 없으므로 빈 상태를 보여준다.
  if (!isAuthenticated) {
    return (
      <>
        <TabHeader title="채팅" />
        <ChatEmptyState />
      </>
    );
  }

  return (
    <>
      <TabHeader title="채팅" />

      {isPending && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">불러오는 중...</p>
      )}
      {isError && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">
          채팅 목록을 불러오지 못했어요.
        </p>
      )}

      {!isPending && !isError && rooms.length === 0 ? (
        <ChatEmptyState />
      ) : (
        <ul className="divide-y divide-secondary-50 px-4">
          {rooms.map((room) => (
            <ChatListRow key={room.id} room={room} />
          ))}
        </ul>
      )}
    </>
  );
}
