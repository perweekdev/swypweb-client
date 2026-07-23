import { ImageCheck } from '@components/ui/image-check';
import { PhotocardImage } from '@components/photocard/photocard-card';
import type { Photocard } from '@/types/photocard.types';

/**
 * 선택 상태 포카 (crad-selecting-status). 뒤 박스 없는 세로 사진.
 * 계측: 64×104(세로 사진 = aspect 8/13, COL-001·COL-003·EX-007 5열 그리드 공통), 3상태.
 *   collected     — 보유 사진(그대로)
 *   not_collected — 미보유(딤 처리)
 *   selected      — primary-900 링 + 우상단 ImageCheck(선택)
 */
type State = 'collected' | 'not_collected' | 'selected';

export function SelectableCard({
  card,
  state,
  onClick,
  className = '',
}: {
  card: Photocard;
  state: State;
  onClick?: () => void;
  className?: string;
}) {
  const selected = state === 'selected';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative block w-full ${className}`}
    >
      <PhotocardImage
        card={card}
        className={`aspect-[8/13] w-full ${state === 'not_collected' ? 'opacity-40' : ''} ${
          selected ? 'ring-2 ring-primary-900' : ''
        }`}
      />
      {selected && <ImageCheck selected className="absolute right-1.5 top-1.5 size-6" />}
    </button>
  );
}
