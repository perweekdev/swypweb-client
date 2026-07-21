'use client';

import { PhotocardImage } from '@components/photocard/photocard-card';
import { UserProfile } from '@components/common/user-profile';
import { useDragScroll } from '@hooks/use-drag-scroll';
import type { Photocard } from '@/types/photocard.types';

/**
 * 홈 피드 교환글 카드 (home-feed-exchange-info).
 * 상대 프로필(제안하기) + 있어요/구해요 포카 가로 스크롤(드래그 스크롤).
 */
function CardRow({ label, cards }: { label: string; cards: Photocard[] }) {
  const scrollRef = useDragScroll<HTMLUListElement>();
  return (
    <div>
      <p className="text-button2 text-secondary-900">{label}</p>
      {/* 프레임 폭이 달라도 항상 5장 완전 노출 + 6번째 약간 잘림(가로 스크롤 힌트). gap 8px 기준 5.3장 폭 */}
      <ul ref={scrollRef} className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {cards.map((card) => (
          <li key={card.id} className="w-[calc(18.87%_-_7.55px)] shrink-0">
            <PhotocardImage card={card} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeFeedCard({
  name,
  avatarColor,
  haveCards,
  wantCards,
  onOffer,
  className = '',
}: {
  name: string;
  avatarColor?: string;
  haveCards: Photocard[];
  wantCards: Photocard[];
  onOffer?: () => void;
  className?: string;
}) {
  return (
    <article className={className}>
      <UserProfile name={name} avatarColor={avatarColor} variant="offer" onAction={onOffer} />
      <div className="mt-3 space-y-3">
        <CardRow label={`있어요 ${haveCards.length}`} cards={haveCards} />
        <CardRow label={`구해요 ${wantCards.length}`} cards={wantCards} />
      </div>
    </article>
  );
}
