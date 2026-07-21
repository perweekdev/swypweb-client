import { CheckIcon } from '@components/icons';

/**
 * 원형 체크 (control-checkbox-text). 항상 체크 표시가 있다.
 * 계측: 16px 원.
 *   default  — 투명 배경 + secondary-500 테두리/체크
 *   selected — secondary-900 채움 + 흰 체크
 */
export function CheckCircle({
  checked,
  className = 'size-4',
}: {
  checked: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border ${
        checked
          ? 'border-secondary-900 bg-secondary-900 text-white'
          : 'border-secondary-500 text-secondary-500'
      } ${className}`}
    >
      <CheckIcon className="size-3/4" />
    </span>
  );
}
