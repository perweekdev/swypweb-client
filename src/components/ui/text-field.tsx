'use client';

import type { InputHTMLAttributes } from 'react';
import { CloseIcon } from '@components/icons';

/**
 * 닉네임 입력 필드 (ONB-001 · MY-002).
 * 값이 있으면 우측에 원형 클리어 버튼이 나타난다.
 *
 * 채팅 입력은 속성이 달라 `ChatInputField`로 분리했다(2차 요청 4번) — 이쪽은 한 줄 + 지우기 + 에러다.
 *
 * 계측: 높이 50 pill · bg secondary-10 · 좌우 여백 16 · 값 16 secondary-900
 * · placeholder secondary-300 · 클리어 버튼 22 gray-300 원 + 흰 X(우측 13 안쪽).
 * 에러: 테두리 2 red-900 + 아래 4 띄워 body3 red-900 문구.
 */
type TextFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** 있으면 테두리를 빨갛게 하고 아래에 문구를 띄운다 */
  error?: string | null;
  /** 클리어 버튼 접근성 라벨 */
  clearLabel?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'className'>;

export function TextField({
  value,
  onValueChange,
  error,
  clearLabel = '입력 지우기',
  className = '',
  ...props
}: TextFieldProps) {
  return (
    <div className={className}>
      {/* 평소에도 투명 테두리를 둬서, 에러가 떠도 안쪽 여백이 밀리지 않는다 */}
      <div
        className={`flex h-[50px] items-center gap-2 rounded-full border-2 bg-secondary-10 pl-4 pr-3 ${
          error ? 'border-red-900' : 'border-transparent'
        }`}
      >
        <input
          {...props}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-invalid={error ? true : undefined}
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
      {error && <p className="mt-1 px-1 text-body3 text-red-900">{error}</p>}
    </div>
  );
}
