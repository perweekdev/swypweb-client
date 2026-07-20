import { ImageCheck } from '@components/ui/image-check';
import { PhotocardCard } from '@components/photocard/photocard-card';
import type { Photocard } from '@/types/photocard.types';

/**
 * 박스형 선택 그리드 (card-detail). 3열, 박스+정보 카드 우상단에 선택 체크.
 * 선택=선명+primary 체크 / 미선택=반투명+gray 체크 (CHAT-004 계측).
 */
export function SelectableCardGrid({
  cards,
  selected,
  onToggle,
  className = '',
}: {
  cards: Photocard[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  className?: string;
}) {
  return (
    <ul className={`grid grid-cols-3 gap-2 ${className}`}>
      {cards.map((card) => {
        const isSelected = selected.has(card.id);
        return (
          <li key={card.id}>
            <button
              type="button"
              onClick={() => onToggle(card.id)}
              aria-pressed={isSelected}
              className="relative block w-full text-left"
            >
              <div className={isSelected ? '' : 'opacity-50'}>
                <PhotocardCard card={card} />
              </div>
              <ImageCheck selected={isSelected} className="absolute right-2 top-2 size-5" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
