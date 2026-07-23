import type { ReactNode } from 'react';
import { CollectionAccordion } from '@components/ui/collection-accordion';
import type { CollectionAlbum, CollectionVersion } from '@/types/collection.types';
import type { Photocard } from '@/types/photocard.types';

/**
 * 앨범 아코디언 + 버전별 5열 포카 그리드. **COL-001 · COL-003 · EX-007이 같은 구조**라 공유한다.
 * 카드 표현만 화면마다 다르므로(조회 / 선택) `renderCard`로 주입한다.
 *
 * 계측: 그리드 5열 카드 64 · gap 6 · 좌우 여백 16 · 버전명 body3 secondary-500 · 앨범명 body1.
 */
export function CollectionAlbumList({
  albums,
  renderCard,
  renderVersionAction,
  className = '',
}: {
  albums: CollectionAlbum[];
  renderCard: (card: Photocard) => ReactNode;
  /** 버전명 오른쪽 액션 — COL-003의 '전체 선택'(EX-007엔 없음) */
  renderVersionAction?: (version: CollectionVersion) => ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {albums.map((album, i) => (
        <CollectionAccordion key={album.id} title={album.name} defaultOpen={i === 0}>
          <div className="space-y-5">
            {album.versions.map((version) => (
              <section key={version.id}>
                <div className="flex min-h-6 items-center justify-between">
                  <p className="text-body3 text-secondary-500">{version.name}</p>
                  {renderVersionAction?.(version)}
                </div>
                <ul className="mt-2 grid grid-cols-5 gap-1.5">
                  {version.cards.map((card) => (
                    <li key={card.id}>{renderCard(card)}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </CollectionAccordion>
      ))}
    </div>
  );
}
