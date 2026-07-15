import { notFound } from 'next/navigation';
import { ChatCompleteSelector } from '@components/chat/chat-complete-selector';
import { findMockChatRoom, mockChatRooms } from '@/mocks/chat';

export function generateStaticParams() {
  return mockChatRooms.map((room) => ({ id: room.id }));
}

/** CHAT-004 교환 완료 포카 선택 */
export default async function ChatCompletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = findMockChatRoom(id);
  if (!room) notFound();

  return <ChatCompleteSelector room={room} />;
}
