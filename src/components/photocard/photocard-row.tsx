'use client';

import type { ReactNode } from 'react';
import { PhotocardImage } from '@components/photocard/photocard-card';
import { useDragScroll } from '@hooks/use-drag-scroll';
import type { Photocard } from '@/types/photocard.types';

/**
 * 라벨 + 포카 가로 스크롤 로우. HOME-001 피드 카드 / EX-001 매칭 / EX-003 교환 세트가 공유한다.
 * 프레임 폭이 달라도 항상 5장 완전 노출 + 6번째 약간 잘림(가로 스크롤 힌트). gap 8px 기준 5.3장 폭.
 * `right`에 노드를 주면 라벨 오른쪽 끝에 배치한다(EX-003 세트별 ⋮ 더보기).
 *
 * 계측(HOME-001·EX-003 동일): 카드 **61×98**, 간격 8, 좌측 16에서 시작해
 * **6번째 카드가 우측 패딩을 넘어 화면 끝에서 잘린다**.
 *  - `min-w-[61px]` — 375px 화면에서 비율만으로는 57px까지 줄어 디자인 최소 크기를 밑돌았다.
 *  - `-mr-4` — 목록만 부모의 좌우 여백(px-4) 밖으로 흘려보내 6번째가 보이게 한다.
 *    이게 없으면 61px 카드 5장(337) + 간격이 폭(343)을 다 써버려 스크롤 힌트가 사라진다.
 *    ⚠️ 부모가 `px-4`라는 전제다(현재 사용처 HOME-001·EX-001·EX-003 모두 해당).
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
      <ul ref={scrollRef} className="-mr-4 mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {cards.map((card) => (
          <li key={card.id} className="w-[calc(18.87%_-_7.55px)] min-w-[61px] shrink-0">
            <PhotocardImage card={card} />
          </li>
        ))}
      </ul>
    </div>
  );
}
