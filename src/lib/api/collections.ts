import { api } from '@lib/api-client';

/**
 * 컬렉션 API. 근거: docs/api-reference.md §6
 *
 * 트리는 **그룹 → 앨범 → 버전 → 포카** 4단계이고 각 단계가 별도 엔드포인트다.
 * 한 번에 다 받을 수 없으므로 화면에서 **아코디언을 펼칠 때 단계별로** 불러온다.
 */

export interface CollectionCount {
  ownedCount: number;
  totalCount: number;
}

export interface CollectionAlbumSummary extends CollectionCount {
  albumId: number;
  name: string;
}

export interface CollectionVersionSummary extends CollectionCount {
  versionId: number;
  name: string;
}

export interface CollectionPhotocard {
  photoCardId: number;
  photoCardName: string;
  memberName: string;
  imageUrl: string | null;
  isOwned: boolean;
}

/** 6.1 그룹의 앨범 목록. 없는 그룹 → 404 `RESOURCE_001` */
export function getAlbums(groupId: number) {
  return api.get<
    CollectionCount & { groupId: number; groupName: string; albums: CollectionAlbumSummary[] }
  >(`/users/collections/groups/${groupId}/albums`);
}

/** 6.2 앨범의 버전 목록 */
export function getVersions(albumId: number) {
  return api.get<
    CollectionCount & { albumId: number; albumName: string; versions: CollectionVersionSummary[] }
  >(`/users/collections/albums/${albumId}/versions`);
}

/**
 * 6.3 버전의 포토카드 목록.
 * ⚠️ 카드 아이템에는 `albumName`/`versionName`이 없다(상위 응답이 제공). `isOwned`가 보유 여부.
 */
export function getPhotocards(versionId: number) {
  return api.get<
    CollectionCount & { versionId: number; versionName: string; photoCards: CollectionPhotocard[] }
  >(`/users/collections/versions/${versionId}/photocards`);
}

/**
 * 6.4 그룹 단위 일괄 저장 — 보유 포카 id 집합을 **통째로 교체**한다.
 * 그룹 밖 포카 id가 섞이면 400 `VALIDATION_007`.
 */
export function saveOwnedPhotocards(groupId: number, photoCardIds: number[]) {
  return api.put<{ groupId: number } & CollectionCount>(
    `/users/me/collections/groups/${groupId}/photocards`,
    { photoCardIds }
  );
}
