'use client';

import { useEffect, useRef } from 'react';
import { Avatar } from '@components/ui/avatar';
import { ChatBubble } from '@components/chat/chat-bubble';
import type { ChatMessage, ChatPartner } from '@/types/chat.types';
import { formatChatDate, formatChatTime, isSameChatDate } from '@utils/format-time';

/** 하단에서 이 거리 안쪽이면 '최신을 보고 있다'로 본다 */
const NEAR_BOTTOM_PX = 150;

function isNearBottom() {
  const { scrollHeight } = document.documentElement;
  return window.innerHeight + window.scrollY >= scrollHeight - NEAR_BOTTOM_PX;
}

/**
 * CHAT-002 메시지 목록.
 * 연속된 같은 발신자 메시지는 한 덩어리로 묶어 아바타는 첫 메시지에만,
 * 시간은 마지막 메시지에만 표시한다(디자인).
 *
 * 스크롤 동작(채팅 관례):
 *  - **처음 열면 곧바로 맨 아래**(최신 메시지)에서 시작한다.
 *  - 새 메시지가 오면 **내가 보냈거나 이미 최신을 보고 있을 때만** 따라 내려간다.
 *    위로 올라가 예전 대화를 읽는 중에는 화면을 끌어내리지 않는다.
 */
export function ChatMessageList({
  messages,
  partner,
}: {
  messages: ChatMessage[];
  partner: ChatPartner;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  // 첫 스크롤은 애니메이션 없이 즉시 — 열자마자 아래에 있어야 한다.
  const hasScrolledOnce = useRef(false);
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    if (messages.length === 0) return;

    const first = !hasScrolledOnce.current;
    if (!first && !isNearBottom() && lastMessage?.sender !== 'me') return;
    hasScrolledOnce.current = true;

    const scroll = () =>
      bottomRef.current?.scrollIntoView({ behavior: first ? 'auto' : 'smooth', block: 'end' });

    scroll();
    // 이미지 메시지는 로드 후 높이가 늘어나 한 번 더 맞춰줘야 끝까지 내려간다.
    const timer = setTimeout(scroll, 250);
    return () => clearTimeout(timer);
  }, [messages.length, lastMessage?.sender]);

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

              {message.imageUrl ? (
                // 이미지 메시지는 말풍선 없이 사진만 보여준다.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={message.imageUrl}
                  alt="보낸 사진"
                  className="max-w-[60%] rounded-xl object-cover"
                />
              ) : (
                <ChatBubble variant={isMine ? 'mine' : 'partner'} className="max-w-[72%]">
                  {message.text}
                </ChatBubble>
              )}

              {!isMine && isGroupEnd && (
                <span className="shrink-0 text-body4 text-secondary-300">
                  {formatChatTime(message.sentAt)}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* 자동 스크롤 기준점 — 항상 목록 맨 끝에 둔다 */}
      <div ref={bottomRef} />
    </div>
  );
}
