import type { ButtonHTMLAttributes } from 'react';
import { ChevronDownIcon } from '@components/icons';

/**
 * 교환 상태 선택 칩 (card-trading-status). 계측: 62×24, secondary-500 글자 + 아래 셰브론.
 * 드롭다운 동작은 화면 단계에서 연결(현재는 표현 + onClick).
 */
export function TradingStatusSelect({
  status = '교환중',
  type = 'button',
  className = '',
  ...props
}: { status?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-0.5 text-body2 text-secondary-500 ${className}`}
      {...props}
    >
      {status}
      <ChevronDownIcon className="size-4" />
    </button>
  );
}
