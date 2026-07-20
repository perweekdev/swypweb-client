import type { ButtonHTMLAttributes } from 'react';
import { ChevronRightIcon } from '@components/icons';

/**
 * '교환 포카 정보 >' 링크 (view-set-all). 계측: text-button2 secondary-900 + 우측 셰브론.
 * 상세 화면으로 이동하는 인라인 링크. 필요 시 상위에서 <Link>로 감싼다.
 */
export function ViewSetAllLink({
  label = '교환 포카 정보',
  type = 'button',
  className = '',
  ...props
}: { label?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-0.5 text-button2 text-secondary-900 ${className}`}
      {...props}
    >
      {label}
      <ChevronRightIcon className="size-4" />
    </button>
  );
}
