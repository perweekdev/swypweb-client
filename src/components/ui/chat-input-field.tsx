'use client';

import { useEffect, useRef, type KeyboardEvent, type TextareaHTMLAttributes } from 'react';

/** 이 줄 수까지만 높이가 늘어나고, 그 뒤로는 안에서 스크롤된다(디자인 지정) */
const MAX_LINES = 8;

/**
 * 채팅 메시지 입력 필드 (CHAT-002).
 *
 * 닉네임 입력(`TextField`)과 **속성이 달라 분리했다**(2차 요청 4번).
 *  - 지우기(X) 버튼이 없다
 *  - 여러 줄을 입력할 수 있고 8줄까지 높이가 늘어난다
 *
 * 계측: 높이 37(1줄) → 156(8줄) · 반경 18 · 좌우 16 · bg secondary-10.
 *
 * ⚠️ 상하 여백은 계측값(10)이 아니라 **8**이다. 디자인의 37은 행간 17px 기준인데
 * 우리 body2 토큰은 1.5(21px)라, 여백을 10으로 두면 41이 된다. 겉보기 높이(37)를 맞추는 쪽을 택했다.
 * 행간 자체는 디자이너 확인 대기 항목이라(1차 C-1과 같은 사안) 결론이 나면 한 번에 정리한다.
 *
 * 높이는 `scrollHeight`로 잰다. 상한은 **실제 계산된 line-height를 읽어** 8줄로 환산하므로
 * 행간이 바뀌어도 이 코드는 그대로 둔다.
 */
type ChatInputFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** 데스크톱에서 Enter로 보낼 때 호출 */
  onSubmit?: () => void;
  className?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'className' | 'rows'>;

export function ChatInputField({
  value,
  onValueChange,
  onSubmit,
  className = '',
  ...props
}: ChatInputFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const style = getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const max = lineHeight * MAX_LINES + padding;

    // 줄어들 때도 다시 재려면 먼저 높이를 풀어야 한다 — 안 그러면 scrollHeight가 계속 이전 값이다.
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, max)}px`;
    element.style.overflowY = element.scrollHeight > max ? 'auto' : 'hidden';
  }, [value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    // 데스크톱은 Enter로 보내고 Shift+Enter로 줄을 바꾼다.
    // 터치 기기는 Enter가 곧 줄바꿈이다 — 그쪽에는 보내기 버튼이 있고, 키보드로 줄바꿈할 방법이 그것뿐이다.
    const canHover = window.matchMedia?.('(hover: hover)').matches ?? false;
    if (!canHover || event.shiftKey) return;

    event.preventDefault();
    onSubmit?.();
  };

  return (
    <textarea
      {...props}
      ref={ref}
      rows={1}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      onKeyDown={handleKeyDown}
      className={`block w-full resize-none rounded-[18px] bg-secondary-10 px-4 py-2 text-body2 text-secondary-900 outline-none placeholder:text-secondary-300 ${className}`}
    />
  );
}
