import type { ReactNode } from 'react';

/**
 * 상태 배지 (chip-status). 기본 '교환완료'.
 * 계측: bg primary-100 / text **primary-900** / body4 / px-2.5 / pill.
 * (텍스트가 secondary-900이었으나 2차 요청으로 primary-900으로 바뀌었다)
 */
export function StatusChip({
  children = '교환완료',
  className = '',
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-body4 text-primary-900 ${className}`}
    >
      {children}
    </span>
  );
}
