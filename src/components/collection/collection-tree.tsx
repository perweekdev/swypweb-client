'use client';

import type { ReactNode } from 'react';
import { CollectionAccordion } from '@components/ui/collection-accordion';
import { PhotocardImage } from '@components/photocard/photocard-card';
import { useAlbumVersions, useCollectionAlbums, useVersionPhotocards } from '@hooks/use-collection';
import type { CollectionPhotocard } from '@lib/api/collections';
import type { Photocard } from '@/types/photocard.types';

/**
 * 서버 API 기반 컬렉션 트리 (COL-001).
 *
 * 트리 4단계가 각각 별도 엔드포인트라(§6) 한 번에 받을 수 없다.
 * **아코디언을 펼칠 때 그 하위만 요청**한다 — 닫혀 있으면 컴포넌트가 마운트되지 않으므로
 * 별도 플래그 없이 지연 로딩이 성립한다.
 *
 * (목 데이터용 `CollectionAlbumList`는 COL-003·EX-007이 아직 쓰고 있어 그대로 둔다.)
 */

const PLACEHOLDER_COLOR = '#E6E8EB';

/** 카드 렌더는 화면마다 다르다(조회 / 선택) — 공통 변환만 여기서 한다. */
function toPhotocard(card: CollectionPhotocard, versionName: string, albumName: string): Photocard {
  return {
    id: String(card.photoCardId),
    memberName: card.memberName,
    albumName,
    versionName,
    imageUrl: card.imageUrl,
    color: PLACEHOLDER_COLOR,
  };
}

function Message({ children }: { children: ReactNode }) {
  return <p className="py-4 text-center text-body3 text-secondary-500">{children}</p>;
}

function VersionCards({
  versionId,
  versionName,
  albumName,
}: {
  versionId: number;
  versionName: string;
  albumName: string;
}) {
  const { data, isPending, isError } = useVersionPhotocards(versionId);

  return (
    <section>
      <div className="flex min-h-6 items-center justify-between">
        <p className="text-body3 text-secondary-500">{versionName}</p>
        {data && (
          <p className="text-body4 text-secondary-300">
            {data.ownedCount}/{data.totalCount}
          </p>
        )}
      </div>

      {isPending && <Message>불러오는 중...</Message>}
      {isError && <Message>포카를 불러오지 못했어요.</Message>}

      {data && (
        <ul className="mt-2 grid grid-cols-5 gap-1.5">
          {data.photoCards.map((card) => (
            <li key={card.photoCardId}>
              {/* 조회 전용: 보유는 사진 그대로, 미보유는 딤 처리 */}
              <PhotocardImage
                card={toPhotocard(card, versionName, albumName)}
                className={`aspect-[8/13] w-full ${card.isOwned ? '' : 'opacity-40'}`}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function AlbumVersions({ albumId, albumName }: { albumId: number; albumName: string }) {
  const { data, isPending, isError } = useAlbumVersions(albumId);

  if (isPending) return <Message>불러오는 중...</Message>;
  if (isError) return <Message>버전을 불러오지 못했어요.</Message>;
  if (!data || data.versions.length === 0) return <Message>등록된 버전이 없어요.</Message>;

  return (
    <div className="space-y-5">
      {data.versions.map((version) => (
        <VersionCards
          key={version.versionId}
          versionId={version.versionId}
          versionName={version.name}
          albumName={albumName}
        />
      ))}
    </div>
  );
}

export function CollectionTree({
  groupId,
  className = '',
}: {
  groupId: number | null;
  className?: string;
}) {
  const { data, isPending, isError } = useCollectionAlbums(groupId);

  if (isPending) return <Message>불러오는 중...</Message>;
  if (isError) return <Message>컬렉션을 불러오지 못했어요.</Message>;
  if (!data || data.albums.length === 0) return <Message>등록된 앨범이 없어요.</Message>;

  return (
    <div className={className}>
      {data.albums.map((album, index) => (
        <CollectionAccordion
          key={album.albumId}
          title={`${album.name} (${album.ownedCount}/${album.totalCount})`}
          defaultOpen={index === 0}
        >
          <AlbumVersions albumId={album.albumId} albumName={album.name} />
        </CollectionAccordion>
      ))}
    </div>
  );
}
