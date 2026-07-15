import { Avatar } from '@components/ui/avatar';
import type { ChatMessage, ChatPartner } from '@/types/chat.types';
import { formatChatDate, formatChatTime, isSameChatDate } from '@utils/format-time';

/**
 * CHAT-002 메시지 목록.
 * 연속된 같은 발신자 메시지는 한 덩어리로 묶어 아바타는 첫 메시지에만,
 * 시간은 마지막 메시지에만 표시한다(디자인).
 */
export function ChatMessageList({
  messages,
  partner,
}: {
  messages: ChatMessage[];
  partner: ChatPartner;
}) {
  return (
    <div className="flex-1 px-4 py-4">
      {messages.map((message, i) => {
        const prev = messages[i - 1];
        const next = messages[i + 1];
        const isMine = message.sender === 'me';
        const isGroupStart = prev?.sender !== message.sender;
        const isGroupEnd = next?.sender !== message.sender;
        const showDate = !prev || !isSameChatDate(prev.sentAt, message.sentAt);

        return (
          <div key={message.id}>
            {showDate && (
              <p className="py-3 text-center text-body3 text-secondary-300">
                {formatChatDate(message.sentAt)}
              </p>
            )}

            <div
              className={`flex items-end gap-2 ${isMine ? 'justify-end' : ''} ${
                isGroupStart ? 'mt-3 first:mt-0' : 'mt-1'
              }`}
            >
              {!isMine &&
                (isGroupStart ? (
                  <Avatar className="size-8 shrink-0" color={partner.color} />
                ) : (
                  // 같은 덩어리의 후속 메시지는 아바타 자리만 비워 들여쓰기를 맞춘다
                  <span className="size-8 shrink-0" aria-hidden="true" />
                ))}

              {isMine && isGroupEnd && (
                <span className="shrink-0 text-body4 text-secondary-300">
                  {formatChatTime(message.sentAt)}
                </span>
              )}

              <p
                className={`max-w-[72%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-body2 ${
                  isMine ? 'bg-primary-900 text-white' : 'bg-secondary-10 text-secondary-900'
                }`}
              >
                {message.text}
              </p>

              {!isMine && isGroupEnd && (
                <span className="shrink-0 text-body4 text-secondary-300">
                  {formatChatTime(message.sentAt)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
