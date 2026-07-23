import type { Photocard } from '@/types/photocard.types';
import type { CollectionAlbum, GroupCollection } from '@/types/collection.types';
import { CARD_COLORS, makeCards } from '@/mocks/photocard';

/**
 * BE 연동 전 임시 컬렉션 목 데이터 (COL-001 / COL-003).
 *
 * 컬렉션이 포카 트리의 **원본**이라, EX-007 교환 세트 등록도 이 파일을 참조한다.
 * (E0에서는 `mocks/exchange.ts`에 있었으나 C0에서 이곳으로 옮겼다.)
 */

function makeVersionCards(albumId: string, versionId: 'photobook' | 'poster', albumName: string) {
  return makeCards(`${albumId}-${versionId}`, 7).map((card, i) => ({
    ...card,
    albumName,
    versionName: versionId === 'photobook' ? 'Photobook ver.' : 'Poster ver.',
    color: CARD_COLORS[(i + albumName.length) % CARD_COLORS.length],
  }));
}

function makeAlbum(id: string, name: string): CollectionAlbum {
  return {
    id,
    name,
    versions: [
      {
        id: `${id}-photobook`,
        name: 'Photobook ver.',
        cards: makeVersionCards(id, 'photobook', name),
      },
      { id: `${id}-poster`, name: 'Poster ver.', cards: makeVersionCards(id, 'poster', name) },
    ],
  };
}

/** 그룹별 컬렉션 트리. 그룹 id는 `mocks/my.ts`의 관심 그룹과 맞춘다. */
export const mockGroupCollections: GroupCollection[] = [
  {
    groupId: 'red-velvet',
    albums: [makeAlbum('cosmic', 'Cosmic'), makeAlbum('chill-kill', 'Chill Kill')],
  },
  {
    groupId: 'ive',
    albums: [makeAlbum('i-am', 'I AM'), makeAlbum('ive-switch', 'IVE SWITCH')],
  },
];

export const findGroupCollection = (groupId: string) =>
  mockGroupCollections.find((c) => c.groupId === groupId);

/** 그룹의 앨범 목록 (없는 그룹이면 빈 배열 — 컬렉션 데이터가 아직 없는 그룹) */
export const getCollectionAlbums = (groupId: string): CollectionAlbum[] =>
  findGroupCollection(groupId)?.albums ?? [];

/** 그룹의 전체 포카 수 — COL-003 진행도의 분모(디자인 `9/200`) */
export const countGroupCards = (groupId: string) =>
  getCollectionAlbums(groupId).reduce(
    (sum, album) => sum + album.versions.reduce((s, v) => s + v.cards.length, 0),
    0
  );

/** 전체 그룹의 앨범을 평탄화 — EX-007에서 컬렉션 전체를 훑을 때 사용 */
export const mockCollectionAlbums: CollectionAlbum[] = mockGroupCollections.flatMap(
  (c) => c.albums
);

/** 앨범/버전 트리를 평탄화한 조회용 맵 (드래프트에 담긴 id → 포카) */
const collectionCardMap = new Map<string, Photocard>(
  mockCollectionAlbums.flatMap((album) =>
    album.versions.flatMap((version) => version.cards.map((card) => [card.id, card] as const))
  )
);

export const findMockCollectionCard = (id: string) => collectionCardMap.get(id);

/** 선택 id 목록을 선택 순서대로 포카 배열로 변환 */
export const toCollectionCards = (ids: string[]): Photocard[] =>
  ids.map(findMockCollectionCard).filter((card): card is Photocard => card != null);

/**
 * 초기 보유 포카 id (그룹별).
 * 디자인 COL-001은 보유(선명)/미보유(반투명)가 섞여 있고, COL-003은 그 보유분이 선택된 상태다.
 */
export const mockOwnedCardIdsByGroup: Record<string, string[]> = {
  'red-velvet': [
    'cosmic-photobook-0',
    'cosmic-photobook-1',
    'cosmic-photobook-4',
    'cosmic-poster-0',
    'cosmic-poster-1',
    'cosmic-poster-2',
    'cosmic-poster-3',
    'cosmic-poster-4',
    'cosmic-poster-5',
    'chill-kill-photobook-2',
    'chill-kill-photobook-3',
  ],
  ive: ['i-am-photobook-0', 'i-am-photobook-3', 'i-am-poster-6'],
};
