import type { Photocard } from '@/types/photocard.types';

/**
 * COLLECTION(컬렉션) 도메인 타입.
 *
 * 컬렉션 트리는 **그룹(아티스트) → 앨범 → 앨범 버전 → 포카** 4단계다.
 * 이 트리가 포카 데이터의 원본이고, EX-007(교환 세트 등록)은 같은 트리를 소비한다.
 * ⚠️ 컬렉션 API 미첨부 → 필드는 디자인(COL-001/003) + 스토리보드 기준 잠정. API 확정 시 정렬.
 */

/** 앨범 버전 ('Photobook ver.' 등) — 포카 그리드와 '전체 선택'의 단위 */
export interface CollectionVersion {
  id: string;
  name: string;
  cards: Photocard[];
}

/** 앨범 (아코디언 단위) */
export interface CollectionAlbum {
  id: string;
  name: string;
  versions: CollectionVersion[];
}

/**
 * 그룹 1개의 컬렉션 (COL-001 그룹 필터로 전환하는 단위).
 * 보유 여부는 카드에 붙이지 않고 **보유 id 목록**으로 분리한다 —
 * COL-003 편집이 결국 "보유 id 집합을 고치는 화면"이고, 트리 자체는 불변이기 때문.
 */
export interface GroupCollection {
  groupId: string;
  albums: CollectionAlbum[];
}
