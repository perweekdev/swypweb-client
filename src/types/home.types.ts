import type { Photocard } from '@/types/photocard.types';

/**
 * 홈 피드 교환글 (다른 유저의 교환 등록).
 * `id`는 서버의 tradeSetId. 매핑은 @lib/api/home 참고.
 */
export interface FeedPost {
  id: string;
  author: {
    id: string;
    nickname: string;
    /** placeholder 배경색(이미지가 없을 때만 쓰인다) */
    avatarColor?: string;
    /** 서버 `profileImageUrl` */
    avatarUrl?: string | null;
    /** 작성자 관심 그룹 표기 (예: '레드벨벳 · 아이브'). HOME-003 상세에서 노출 */
    groups?: string;
  };
  /** 있어요 = 작성자 보유(HAVE) */
  haveCards: Photocard[];
  /** 구해요 = 작성자 희망(WANT) */
  wantCards: Photocard[];
}
