import { HeartIcon, PlusIcon } from '@components/icons';

/**
 * 아티스트 그룹 로고 원 (group-logo). 로고 에셋 전 placeholder(색상 원 + 이니셜).
 * 계측: large 77 / small 50 (배지·링 여백 포함). state·favorited 조합:
 *   default  — 로고 원
 *   add      — 점선 원 + gray-500 ＋ (추가하기)
 *   selected — primary-900 링
 *   favorited(❤) — 우상단 red-700 하트 배지 (관심 그룹 표시)
 */
type State = 'default' | 'add' | 'selected';
type Size = 'lg' | 'md' | 'sm';

// lg 관심그룹 추가 그리드(HOME-002) / md 홈 필터(HOME-001, ~48) / sm 관리 리스트(MY-003)
const SIZE: Record<Size, string> = {
  lg: 'size-16',
  md: 'size-12',
  sm: 'size-10',
};

export function GroupLogo({
  state = 'default',
  size = 'lg',
  favorited = false,
  name = '',
  color,
  className = '',
}: {
  state?: State;
  size?: Size;
  favorited?: boolean;
  name?: string;
  color?: string;
  className?: string;
}) {
  const dim = SIZE[size];

  if (state === 'add') {
    return (
      <span
        className={`inline-flex ${dim} items-center justify-center rounded-full border border-dashed border-secondary-300 text-secondary-500 ${className}`}
      >
        <PlusIcon className="size-5" />
      </span>
    );
  }

  return (
    <span className={`relative inline-flex ${dim} ${className}`}>
      <span
        className={`flex size-full items-center justify-center overflow-hidden rounded-full text-body1 text-white ${
          color ? '' : 'bg-secondary-50 text-secondary-500'
        } ${state === 'selected' ? 'ring-2 ring-primary-900 ring-offset-2 ring-offset-background' : ''}`}
        style={color ? { backgroundColor: color } : undefined}
      >
        {name.charAt(0)}
      </span>
      {favorited && <HeartIcon className="absolute -right-0.5 -top-0.5 size-4 text-red-700" />}
    </span>
  );
}
