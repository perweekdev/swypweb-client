'use client';

import { useAuthStore } from '@store/auth-store';
import { TabHeader } from '@components/layout/tab-header';
import { ChatEmptyState } from '@components/chat/chat-empty-state';
import { ChatListRow } from '@components/chat/chat-list-row';
import { mockChatRoomSummaries } from '@/mocks/chat';

/** CHAT-001 채팅 목록. 비회원이거나 진행된 채팅이 없으면 빈 상태(CHAT-005). */
export default function ChatPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // 비회원은 채팅 내역이 없으므로 빈 상태를 보여준다. (로그인 시 목 데이터 노출)
  const rooms = isAuthenticated ? mockChatRoomSummaries : [];

  return (
    <>
      <TabHeader title="채팅" />

      {rooms.length === 0 ? (
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
