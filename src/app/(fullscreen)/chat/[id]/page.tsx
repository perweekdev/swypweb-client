import { ChatRoomView } from '@components/chat/chat-room-view';

/** CHAT-002 채팅방 (id는 서버 chatId — 런타임에만 알 수 있어 정적 생성하지 않는다) */
export default function ChatRoomPage() {
  return <ChatRoomView />;
}
