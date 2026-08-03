import type { ReactNode } from 'react';

/**
 * 채팅 말풍선 (sender/receiver). 도메인 중립 이름으로 mine/partner를 쓴다.
 * 계측: rounded-2xl, px-3.5 py-2.5, text-body2.
 *   mine(내 메시지, 우)   — primary-900 배경 + 흰 글자   (디자인 'receiver')
 *   partner(상대 메시지, 좌) — secondary-10 배경 + secondary-900 (디자인 'sender')
 *
 * 최대 너비/정렬/타임스탬프는 목록(ChatMessageList)이 담당한다.
 *
 * 긴 글이 말풍선을 넘지 않게 두 가지를 함께 건다.
 *  - `break-words` — 공백 없는 긴 영문·숫자(`aaaa…`, `123123…`)를 중간에서 끊는다.
 *    한글은 기본 규칙으로도 글자 단위로 끊기지만 영문·숫자는 안 끊겨 그대로 넘쳤다.
 *  - `min-w-0` — 말풍선은 **flex 아이템**이라 기본 `min-width: auto`가 내용 폭만큼 잡힌다.
 *    이게 `max-w`를 이겨서, 줄바꿈을 허용해도 상자 자체가 안 줄어든다.
 *
 * `whitespace-pre-line`은 사용자가 넣은 줄바꿈을 살리기 위한 것으로 별개다.
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
      className={`min-w-0 whitespace-pre-line break-words rounded-2xl px-3.5 py-2.5 text-body2 ${
        isMine ? 'bg-primary-900 text-white' : 'bg-secondary-10 text-secondary-900'
      } ${className}`}
    >
      {children}
    </p>
  );
}
