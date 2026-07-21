import { PhotocardCard } from '@components/photocard/photocard-card';
import type { Photocard } from '@/types/photocard.types';

/**
 * 있어요/구해요 섹션 그리드 (exchange_info / exchange-list-example).
 * 계측: 섹션 라벨(있어요 N, secondary-900 button2) + 3열 박스+정보 카드.
 * CHAT-003 교환 포카 정보 화면과 동일 구성.
 * 라벨은 화면마다 다를 수 있어 prop으로 받는다(있어요/구해요·보낼 수/받을 수 있어요).
 */
export function ExchangeCardSections({
  haveCards,
  wantCards,
  haveLabel = '있어요',
  wantLabel = '구해요',
  className = '',
}: {
  haveCards: Photocard[];
  wantCards: Photocard[];
  haveLabel?: string;
  wantLabel?: string;
  className?: string;
}) {
  const section = (label: string, cards: Photocard[]) => (
    <section>
      <h3 className="text-button2 text-secondary-900">{`${label} ${cards.length}`}</h3>
      <ul className="mt-2 grid grid-cols-3 gap-2">
        {cards.map((card) => (
          <li key={card.id}>
            <PhotocardCard card={card} />
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {section(haveLabel, haveCards)}
      {section(wantLabel, wantCards)}
    </div>
  );
}
