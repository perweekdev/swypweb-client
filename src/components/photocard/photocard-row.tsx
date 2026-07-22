'use client';

import type { ReactNode } from 'react';
import { PhotocardImage } from '@components/photocard/photocard-card';
import { useDragScroll } from '@hooks/use-drag-scroll';
import type { Photocard } from '@/types/photocard.types';

/**
 * 라벨 + 포카 가로 스크롤 로우. HOME-001 피드 카드 / EX-001 매칭 / EX-003 교환 세트가 공유한다.
 * 프레임 폭이 달라도 항상 5장 완전 노출 + 6번째 약간 잘림(가로 스크롤 힌트). gap 8px 기준 5.3장 폭.
 * `right`에 노드를 주면 라벨 오른쪽 끝에 배치한다(EX-003 세트별 ⋮ 더보기).
 */
export function PhotocardRow({
  label,
  cards,
  right,
  className = '',
}: {
  label: string;
  cards: Photocard[];
  right?: ReactNode;
  className?: string;
}) {
  const scrollRef = useDragScroll<HTMLUListElement>();

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-button2 text-secondary-900">{label}</p>
        {right}
      </div>
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
