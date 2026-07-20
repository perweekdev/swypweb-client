import type { ButtonHTMLAttributes } from 'react';
import { CloseIcon } from '@components/icons';

/**
 * 닫기 X 버튼 (btn-close).
 * 계측: 20×20, gray-700 X 글리프. 헤더/바텀시트 닫기 등에 사용.
 * (어두운 원 배경 + 흰 X는 별도 — 입력창 클리어/카드 삭제용)
 */
type CloseButtonProps = {
  'aria-label'?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function CloseButton({
  type = 'button',
  className = 'size-5',
  'aria-label': ariaLabel = '닫기',
  ...props
}: CloseButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center text-gray-700 ${className}`}
      {...props}
    >
      <CloseIcon className="size-full" />
    </button>
  );
}
