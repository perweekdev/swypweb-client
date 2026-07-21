import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * 아이콘 히트영역 래퍼 (touch-area).
 * 계측: 아이콘 24 → 48×48 / 아이콘 16 → 32×32 의 탭 영역. align=center|right_end.
 * 아이콘은 children으로 받고, 접근성을 위해 aria-label을 필수로 요구한다.
 */
type IconButtonProps = {
  'aria-label': string;
  area?: 32 | 48;
  align?: 'center' | 'right';
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const AREA: Record<32 | 48, string> = {
  32: 'size-8',
  48: 'size-12',
};

export function IconButton({
  area = 48,
  align = 'center',
  type = 'button',
  className = '',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex ${AREA[area]} items-center ${
        align === 'right' ? 'justify-end' : 'justify-center'
      } text-secondary-900 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
