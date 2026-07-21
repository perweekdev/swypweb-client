import { CheckIcon } from '@components/icons';

/**
 * 이미지 위 선택 체크 (control-checkbox-image). 채워진 원 + 흰 체크.
 * 계측: 24px 원.
 *   selected(fill)   — primary-900
 *   unselected(outline) — gray-500
 * 포카 카드 우상단 선택 표시(CHAT-004 등)에 사용.
 */
export function ImageCheck({
  selected,
  className = 'size-6',
}: {
  selected: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-white ${
        selected ? 'bg-primary-900' : 'bg-gray-500'
      } ${className}`}
    >
      <CheckIcon className="size-2/3" />
    </span>
  );
}
