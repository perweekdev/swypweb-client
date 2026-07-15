import { ChatEmptyState } from '@components/chat/chat-empty-state';
import { ChatListRow } from '@components/chat/chat-list-row';
import { mockChatRoomSummaries } from '@/mocks/chat';

/** CHAT-001 채팅 목록 (진행된 채팅이 없으면 빈 상태) */
export default function ChatPage() {
  const rooms = mockChatRoomSummaries;

  return (
    <>
      <header className="px-4 pb-2 pt-4">
        <h1 className="text-h1 text-secondary-900">채팅</h1>
      </header>

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
