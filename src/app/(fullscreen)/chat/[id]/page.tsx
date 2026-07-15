import { notFound } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ChatInputBar } from '@components/chat/chat-input-bar';
import { ChatMatchInfo } from '@components/chat/chat-match-info';
import { ChatMessageList } from '@components/chat/chat-message-list';
import { findMockChatRoom, mockChatRooms } from '@/mocks/chat';

export function generateStaticParams() {
  return mockChatRooms.map((room) => ({ id: room.id }));
}

/** CHAT-002 채팅방 */
export default async function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = findMockChatRoom(id);
  if (!room) notFound();

  return (
    <>
      {/* 헤더 + 교환 정보는 스크롤해도 상단에 유지 (memo) */}
      <div className="sticky top-0 z-10 bg-background">
        <Header title={room.partner.nickname} />
        <ChatMatchInfo roomId={room.id} exchangeSet={room.exchangeSet} status={room.status} />
      </div>

      <ChatMessageList messages={room.messages} partner={room.partner} />
      <ChatInputBar />
    </>
  );
}
