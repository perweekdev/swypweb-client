/**
 * 포토카드 공통 타입 (docs/storyboard 기준)
 *
 * HOME / COLLECTION / EXCHANGE / CHAT 전 도메인이 같은 포카 데이터를 쓴다.
 * 화면마다 라벨만 다르므로(있어요·구해요 / 보낼 수 있어요·받을 수 있어요 / 내 포카·상대방 포카)
 * 타입은 라벨이 아닌 소유 기준(my / partner)으로 둔다.
 */

/** 포토카드 1장. 표기 순서는 전 화면 공통으로 멤버명 → 앨범명 → 앨범 버전. */
export interface Photocard {
  id: string;
  /** 멤버명 */
  memberName: string;
  /** 앨범명 */
  albumName: string;
  /** 앨범 버전 */
  versionName: string;
  imageUrl: string | null;
  /** 이미지 에셋 제공 전 placeholder 배경색 */
  color: string;
}

/**
 * 교환 세트 — 있어요/구해요 한 쌍. EX-007에서 등록하며 각각 최대 10장.
 * 화면별 라벨: 있어요·구해요(CHAT-003) / 내 포카·상대방 포카(CHAT-004)
 */
export interface ExchangeSet {
  /** 있어요 = 내가 보낼 포카 */
  myCards: Photocard[];
  /** 구해요 = 내가 받을 포카 */
  partnerCards: Photocard[];
}

/** 교환 세트에서 포카를 담는 두 축 */
export type CardSide = 'my' | 'partner';
