import type { Photocard } from '@/types/photocard.types';

/**
 * 홈 피드 교환글 (다른 유저의 교환 등록).
 * ⚠️ 교환 API 도메인 미첨부 → 필드는 디자인(HOME-001/003) 기준 잠정. API 확정 시 정렬.
 */
export interface FeedPost {
  id: string;
  author: {
    id: string;
    nickname: string;
    /** 이미지 에셋 제공 전 placeholder 배경색 */
    avatarColor: string;
    /** 작성자 관심 그룹 표기 (예: '레드벨벳 · 아이브'). HOME-003 상세에서 노출 */
    groups?: string;
  };
  /** 있어요 = 작성자 보유(HAVE) */
  haveCards: Photocard[];
  /** 구해요 = 작성자 희망(WANT) */
  wantCards: Photocard[];
}
