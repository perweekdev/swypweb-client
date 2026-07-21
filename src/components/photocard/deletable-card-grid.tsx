import { DeletableCard } from '@components/photocard/deletable-card';
import type { Photocard } from '@/types/photocard.types';

/**
 * 선택된 포카 그리드 + 안내 (set-cards-selected).
 * 계측: 상단 'N장 선택됨'(secondary-900) + '최대 M장까지 등록할 수 있어요.'(secondary-300),
 * 하단 6열 삭제 가능 카드.
 */
export function DeletableCardGrid({
  cards,
  max,
  onDelete,
  className = '',
}: {
  cards: Photocard[];
  max: number;
  onDelete?: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-body2 text-secondary-900">{cards.length}장 선택됨</span>
        <span className="text-body3 text-secondary-300">최대 {max}장까지 등록할 수 있어요.</span>
      </div>
      <ul className="grid grid-cols-6 gap-1.5">
        {cards.map((card) => (
          <li key={card.id}>
            <DeletableCard card={card} onDelete={() => onDelete?.(card.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
