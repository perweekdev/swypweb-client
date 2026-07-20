import { SwapIcon } from '@components/icons';
import { CardSetInfo } from '@components/photocard/card-set-info';
import { ViewSetAllLink } from '@components/ui/view-set-all-link';
import type { ExchangeSet } from '@/types/photocard.types';

/**
 * 교환 요약 헤더 (exchange-hint). '교환 포카 정보 >' 링크 + 대표 포카 ⇄ 대표 포카.
 * CHAT-002 상단 매치 정보의 상단부와 동일 구성(청크 9에서 ChatMatchInfo가 이걸 쓰도록 통합).
 * 대표 1장 + '외 N장'은 CardSetInfo가 담당.
 */
export function ExchangeInfoHeader({
  exchangeSet,
  onViewAll,
  className = '',
}: {
  exchangeSet: ExchangeSet;
  onViewAll?: () => void;
  className?: string;
}) {
  const { myCards, partnerCards } = exchangeSet;

  return (
    <div className={className}>
      <ViewSetAllLink onClick={onViewAll} />
      <div className="mt-2 flex items-start gap-2">
        <CardSetInfo card={myCards[0]} extraCount={myCards.length - 1} className="flex-1" />
        <SwapIcon className="mt-8 size-4 shrink-0 text-secondary-300" />
        <CardSetInfo
          card={partnerCards[0]}
          extraCount={partnerCards.length - 1}
          className="flex-1"
        />
      </div>
    </div>
  );
}
