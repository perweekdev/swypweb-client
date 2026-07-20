import type { ReactNode } from 'react';

/**
 * 채팅 말풍선 (sender/receiver). 도메인 중립 이름으로 mine/partner를 쓴다.
 * 계측: rounded-2xl, px-3.5 py-2.5, text-body2.
 *   mine(내 메시지, 우)   — primary-900 배경 + 흰 글자   (디자인 'receiver')
 *   partner(상대 메시지, 좌) — secondary-10 배경 + secondary-900 (디자인 'sender')
 *
 * 최대 너비/정렬/타임스탬프는 목록(ChatMessageList)이 담당한다.
 */
export function ChatBubble({
  variant,
  children,
  className = '',
}: {
  variant: 'mine' | 'partner';
  children: ReactNode;
  className?: string;
}) {
  const isMine = variant === 'mine';

  return (
    <p
      className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-body2 ${
        isMine ? 'bg-primary-900 text-white' : 'bg-secondary-10 text-secondary-900'
      } ${className}`}
    >
      {children}
    </p>
  );
}
