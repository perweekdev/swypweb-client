import { api } from '@lib/api-client';
import { toCursorPage } from '@lib/cursor';
import type { CursorPage } from '@/types/api.types';
import type { FeedPost } from '@/types/home.types';
import type { Photocard } from '@/types/photocard.types';

/** 홈 피드 API. 근거: docs/api-reference.md §7.7 */

interface FeedItemResponse {
  tradeSetId: number;
  groupId: number;
  groupName: string;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  /** ⚠️ 이미지 URL 배열뿐 — photoCardId 등 식별자가 없다 */
  haveImages: string[];
  wantImages: string[];
  createdAt: string;
}

/** 이미지 에셋 전 placeholder와 동일한 중립색(secondary-50) */
const PLACEHOLDER_COLOR = '#E6E8EB';

/**
 * 피드는 이미지 URL만 주므로 Photocard의 이름 필드를 채울 수 없다.
 * 화면(PhotocardRow)은 이미지만 쓰므로 빈 문자열로 두고, 상세(7.3)에서 실제 이름을 받는다.
 */
function toCards(images: string[], keyPrefix: string): Photocard[] {
  return images.map((imageUrl, index) => ({
    id: `${keyPrefix}-${index}`,
    memberName: '',
    albumName: '',
    versionName: '',
    imageUrl,
    color: PLACEHOLDER_COLOR,
  }));
}

function toFeedPost(item: FeedItemResponse): FeedPost {
  return {
    id: String(item.tradeSetId),
    author: {
      id: String(item.userId),
      nickname: item.nickname,
      avatarUrl: item.profileImageUrl,
      groups: item.groupName,
    },
    haveCards: toCards(item.haveImages, `${item.tradeSetId}-have`),
    wantCards: toCards(item.wantImages, `${item.tradeSetId}-want`),
  };
}

/**
 * 홈 피드 목록. **인증 불필요**(비로그인도 200).
 * 정렬은 tradeSetId 내림차순(최신순), 커서는 숫자(`nextCursor`).
 * 없는 groupId → HTTP 400(코드는 `RESOURCE_001`이므로 status로 판정).
 */
export async function getHomeFeed(params: { cursor?: number; groupId?: number; size?: number }) {
  const raw = await api.get<unknown>('/home/trade-sets', {
    query: { cursor: params.cursor, groupId: params.groupId, size: params.size },
    auth: false,
  });

  const page = toCursorPage<FeedItemResponse, number>(raw, 'feed');
  return {
    items: page.items.map(toFeedPost),
    nextCursor: page.nextCursor,
    hasNext: page.hasNext,
  } satisfies CursorPage<FeedPost, number>;
}
