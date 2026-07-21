import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { PlusIcon } from '@components/icons';

/**
 * ＋라벨 형태의 보라 pill 버튼 (btn-tab).
 * 계측: primary-900 배경, rounded-full, 흰 글자 + 좌측 ＋아이콘.
 * '추가하기'류 액션에 사용.
 */
type TabButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function TabButton({ type = 'button', className = '', children, ...props }: TabButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex h-12 items-center gap-1 rounded-full bg-primary-900 px-4 text-button2 text-white ${className}`}
      {...props}
    >
      <PlusIcon className="size-4" />
      {children}
    </button>
  );
}
