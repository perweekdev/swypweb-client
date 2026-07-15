import Link from 'next/link';
import { Avatar } from '@components/ui/avatar';
import { CHAT_ROUTES } from '@constants/routes';
import { MOCK_NOW } from '@/mocks/chat';
import type { ChatRoomSummary } from '@/types/chat.types';
import { formatRelativeTime } from '@utils/format-time';

// 목 데이터가 고정 기준 시각을 쓰므로 상대 시간도 같은 기준으로 계산한다. (BE 연동 시 제거)
const NOW = Date.parse(MOCK_NOW);

/** CHAT-001 채팅 목록의 한 행 */
export function ChatListRow({ room }: { room: ChatRoomSummary }) {
  return (
    <li>
      <Link href={CHAT_ROUTES.room(room.id)} className="flex h-[84px] gap-2 pt-4">
        <Avatar className="size-12 shrink-0" color={room.partner.color} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-button2 text-secondary-900">
              {room.partner.nickname}
            </span>
            {room.status === 'completed' && (
              <span className="shrink-0 rounded-full bg-primary-100 px-2.5 text-body4 text-secondary-900">
                교환완료
              </span>
            )}
          </div>
          <p className="line-clamp-2 whitespace-pre-line text-body3 text-secondary-300">
            {room.lastMessage}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-body4 text-secondary-300">
            {formatRelativeTime(room.lastMessageAt, NOW)}
          </span>
          {room.unreadCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary-900 text-body4 text-white">
              {room.unreadCount}
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}
