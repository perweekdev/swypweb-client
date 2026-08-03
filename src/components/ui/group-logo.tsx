import Image from 'next/image';
import { HeartIcon, PlusIcon } from '@components/icons';

/**
 * 아티스트 그룹 로고 원 (group-logo).
 * `logoUrl`이 있으면 실제 로고 이미지, 없으면 placeholder(색상 원 + 이니셜).
 * 계측: large 77 / small 50 (배지·링 여백 포함). state·favorited 조합:
 *   default  — 로고 원
 *   add      — 점선 원 + gray-500 ＋ (추가하기)
 *   selected — primary-900 링. **원 가장자리에 붙는다**(offset 없음).
 *              실측: 비선택 원 48 · 선택 원 50 — 사이에 여백이 없다.
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
  logoUrl,
  className = '',
}: {
  state?: State;
  size?: Size;
  favorited?: boolean;
  name?: string;
  color?: string;
  /** 서버 `groupImageUrl`. 있으면 색상 원 대신 실제 로고를 쓴다. */
  logoUrl?: string | null;
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
        className={`relative flex size-full items-center justify-center overflow-hidden rounded-full text-body1 text-white ${
          color && !logoUrl ? '' : 'bg-secondary-50 text-secondary-500'
        } ${state === 'selected' ? 'ring-2 ring-primary-900' : ''}`}
        style={color && !logoUrl ? { backgroundColor: color } : undefined}
      >
        {logoUrl ? (
          <Image src={logoUrl} alt={name} fill sizes="77px" className="object-cover" />
        ) : (
          name.charAt(0)
        )}
      </span>
      {favorited && <HeartIcon className="absolute -right-0.5 -top-0.5 size-4 text-red-700" />}
    </span>
  );
}
