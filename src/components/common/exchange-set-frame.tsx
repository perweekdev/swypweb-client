import { SwapIcon } from '@components/icons';
import { HaveSetCard } from '@components/photocard/have-set-card';
import type { Photocard } from '@/types/photocard.types';

/**
 * 교환 세트 프레임 (exchange-frame). 오버레이 카드 ⇄ 오버레이 카드 한 쌍을 감싼다.
 * 계측: default = secondary-10 박스 / highlighted = primary-900 테두리. 다중교환 시각화용.
 *
 * ⚠️ EX 도메인용. 화면 핸드오프 후 라벨/구성 재확인.
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
      className={`rounded-2xl p-4 ${
        variant === 'highlighted' ? 'border-2 border-primary-900' : 'bg-secondary-10'
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <HaveSetCard
          card={have.card}
          label={have.label ?? '있어요'}
          extraCount={have.extraCount ?? 0}
          className="flex-1"
        />
        <SwapIcon className="size-4 shrink-0 text-secondary-500" />
        <HaveSetCard
          card={want.card}
          label={want.label ?? '있어요'}
          extraCount={want.extraCount ?? 0}
          className="flex-1"
        />
      </div>
    </div>
  );
}
