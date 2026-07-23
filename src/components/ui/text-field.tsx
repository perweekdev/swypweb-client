'use client';

import type { InputHTMLAttributes } from 'react';
import { CloseIcon } from '@components/icons';

/**
 * 텍스트 입력 필드 (ONB-001 닉네임 입력).
 * 값이 있으면 우측에 원형 클리어 버튼이 나타난다.
 *
 * 계측: 높이 50 pill · bg secondary-10 · 좌우 여백 16 · 값 16 secondary-900
 * · placeholder secondary-300 · 클리어 버튼 22 gray-300 원 + 흰 X(우측 13 안쪽).
 */
type TextFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** 클리어 버튼 접근성 라벨 */
  clearLabel?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'className'>;

export function TextField({
  value,
  onValueChange,
  clearLabel = '입력 지우기',
  className = '',
  ...props
}: TextFieldProps) {
  return (
    <div
      className={`flex h-[50px] items-center gap-2 rounded-full bg-secondary-10 pl-4 pr-3 ${className}`}
    >
      <input
        {...props}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-body1 text-secondary-900 outline-none placeholder:text-secondary-300"
      />
      {value && (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => onValueChange('')}
          className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-gray-300 text-white"
        >
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
