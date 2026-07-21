import type { ReactNode } from 'react';

/**
 * 상태 배지 (chip-status). 기본 '교환완료'.
 * 계측(CHAT-001): bg primary-100, text-body4 secondary-900, px-2.5, pill.
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
      className={`inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-body4 text-secondary-900 ${className}`}
    >
      {children}
    </span>
  );
}
