import type { Photocard } from '@/types/photocard.types';

/**
 * EXCHANGE(내교환) 도메인 타입.
 * ⚠️ 교환 API 미첨부 → 필드는 디자인(EX-001~008) + 스토리보드 기준 잠정. API 확정 시 정렬.
 */

/**
 * 교환 세트를 이루는 두 축.
 * `have`(있어요) = 내가 보낼 수 있는 포카 · `want`(구해요) = 내가 받고 싶은 포카.
 * `ExchangeSet.myCards`/`partnerCards`와 같은 축이며, 화면 라벨이 있어요/구해요라 이 이름을 쓴다.
 * (참고: `HaveWantTab`도 동일한 `'have' | 'want'`를 쓴다.)
 */
export type ExchangeSide = 'have' | 'want';

/** 교환 상대(매칭된 유저) 요약. `FeedPost['author']`와 같은 모양 — API 확정 시 공용 타입으로 통합. */
export interface ExchangePartner {
  id: string;
  nickname: string;
  /** 이미지 에셋 제공 전 placeholder 배경색 */
  avatarColor: string;
  /** 관심 그룹 표기 (예: 'Red Velvet · IVE') */
  groups?: string;
}

/** 내가 등록한 교환 세트 (EX-001 세트 박스 / EX-003 목록). 각 축 최대 10장. */
export interface ExchangeSetSummary {
  id: string;
  haveCards: Photocard[];
  wantCards: Photocard[];
}

/** 교환 가능한 상대 (EX-001 매칭 리스트 / EX-005 상세). 카드 축은 상대 기준이 아닌 내 기준이다. */
export interface MatchResult {
  id: string;
  partner: ExchangePartner;
  /** 있어요 = 내가 상대에게 보낼 수 있는 포카 */
  haveCards: Photocard[];
  /** 구해요 = 내가 상대에게 받을 수 있는 포카 */
  wantCards: Photocard[];
}

/** 앨범 버전 (EX-007 'Photobook ver.' 등) — 포카 선택 그리드의 단위 */
export interface CollectionVersion {
  id: string;
  name: string;
  cards: Photocard[];
}

/** 앨범 (EX-007 아코디언 단위) */
export interface CollectionAlbum {
  id: string;
  name: string;
  versions: CollectionVersion[];
}
