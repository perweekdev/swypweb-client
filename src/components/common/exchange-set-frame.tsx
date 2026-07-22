import { SwapIcon } from '@components/icons';
import { HaveSetCard } from '@components/photocard/have-set-card';
import type { Photocard } from '@/types/photocard.types';

/**
 * 교환 세트 프레임 (exchange-frame). 있어요 대표 ⇄ 구해요 대표 한 쌍을 감싼다. EX-001 세트 목록.
 * 계측(EX-001): 276×152, rounded-xl, bg secondary-10, 안쪽 여백 14, 카드 108×120, 카드 사이 28(아이콘 16 + 6·6).
 * highlighted = primary-900 2px 테두리(방금 등록한 세트 강조). default도 같은 두께의 투명 테두리로 geometry를 맞춘다.
 */
type Side = { card: Photocard; label?: string; extraCount?: number };

export function ExchangeSetFrame({
  have,
  want,
  variant = 'default',
  className = '',
}: {
  have: Side;
  want: Side;
  variant?: 'default' | 'highlighted';
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border-2 bg-secondary-10 p-3.5 ${
        variant === 'highlighted' ? 'border-primary-900' : 'border-transparent'
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <HaveSetCard
          card={have.card}
          label={have.label ?? '있어요'}
          extraCount={have.extraCount ?? 0}
          className="flex-1"
        />
        <SwapIcon className="size-4 shrink-0 text-secondary-500" />
        <HaveSetCard
          card={want.card}
          label={want.label ?? '구해요'}
          extraCount={want.extraCount ?? 0}
          className="flex-1"
        />
      </div>
    </div>
  );
}
