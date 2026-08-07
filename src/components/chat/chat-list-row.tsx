import type { ReactNode } from 'react';
import Link from 'next/link';
import { Avatar } from '@components/ui/avatar';
import { CheckCircle } from '@components/ui/check-circle';
import { StatusChip } from '@components/ui/status-chip';
import { CHAT_ROUTES } from '@constants/routes';
import type { ChatRoomSummary } from '@/types/chat.types';
import { formatRelativeTime } from '@utils/format-time';

/**
 * CHAT-001 채팅 목록의 한 행.
 *
 * 편집 모드(`selection`)에서는 방으로 들어가지 않고 **선택만** 한다 —
 * 링크 대신 버튼으로 바뀌고 좌측에 체크가 붙는다(디자인 CHAT-001-edit).
 */
export function ChatListRow({
  room,
  selection,
}: {
  room: ChatRoomSummary;
  selection?: { checked: boolean; onToggle: () => void };
}) {
  const body = (
    <>
      {selection && (
        <CheckCircle checked={selection.checked} className="size-5 shrink-0 self-center" />
      )}
      <RowContent room={room} />
    </>
  );

  return (
    <li>
      {selection ? (
        <button
          type="button"
          onClick={selection.onToggle}
          aria-pressed={selection.checked}
          className="flex h-[84px] w-full gap-2 pt-4 text-left"
        >
          {body}
        </button>
      ) : (
        <Link href={CHAT_ROUTES.room(room.id)} className="flex h-[84px] gap-2 pt-4">
          {body}
        </Link>
      )}
    </li>
  );
}

function RowContent({ room }: { room: ChatRoomSummary }): ReactNode {
  return (
    <>
      <Avatar
        className="size-12 shrink-0"
        color={room.partner.color}
        src={room.partner.avatarUrl}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-button2 text-secondary-900">{room.partner.nickname}</span>
          {room.status === 'completed' && <StatusChip className="shrink-0" />}
        </div>
        <p className="line-clamp-2 whitespace-pre-line text-body3 text-secondary-500">
          {room.lastMessage}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-body4 text-secondary-500">
          {room.lastMessageAt && formatRelativeTime(room.lastMessageAt)}
        </span>
        {room.unreadCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary-900 text-body4 text-white">
            {room.unreadCount}
          </span>
        )}
      </div>
    </>
  );
}
