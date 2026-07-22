'use client';

import { DeletableCard } from '@components/photocard/deletable-card';
import { InfoIcon } from '@components/icons';
import { useDragScroll } from '@hooks/use-drag-scroll';
import type { Photocard } from '@/types/photocard.types';

/**
 * 선택된 포카 영역 (set-cards-selected).
 * 헤더는 0장이어도 노출되고(EX-007 계측) 카드 영역만 비면 사라진다.
 * 계측: 'N장 선택됨' secondary-900 / ⓘ '최대 M장까지 등록할 수 있어요.' secondary-500,
 * 카드 61 gap 6 — EX-007은 **가로 1행 스크롤**(`row`), 컴포넌트 시안은 6열 그리드(`grid`).
 */
export function DeletableCardGrid({
  cards,
  max,
  onDelete,
  layout = 'grid',
  className = '',
}: {
  cards: Photocard[];
  max: number;
  onDelete?: (id: string) => void;
  layout?: 'grid' | 'row';
  className?: string;
}) {
  const scrollRef = useDragScroll<HTMLUListElement>();

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-body2 text-secondary-900">{cards.length}장 선택됨</span>
        <span className="inline-flex items-center gap-1 text-body3 text-secondary-500">
          <InfoIcon className="size-4" />
          최대 {max}장까지 등록할 수 있어요.
        </span>
      </div>

      {cards.length > 0 &&
        (layout === 'row' ? (
          <ul ref={scrollRef} className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {cards.map((card) => (
              <li key={card.id} className="w-[61px] shrink-0">
                <DeletableCard card={card} onDelete={() => onDelete?.(card.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-3 grid grid-cols-6 gap-1.5">
            {cards.map((card) => (
              <li key={card.id}>
                <DeletableCard card={card} onDelete={() => onDelete?.(card.id)} />
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
