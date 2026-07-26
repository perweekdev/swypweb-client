import { api } from '@lib/api-client';
import { toCursorPage } from '@lib/cursor';
import type { CursorPage } from '@/types/api.types';
import type { Photocard } from '@/types/photocard.types';

/** 추천 매칭 API. 근거: docs/api-reference.md §7.6 */

const PLACEHOLDER_COLOR = '#E6E8EB';

interface MatchedCardResponse {
  photoCardId: number;
  imageUrl: string | null;
}

interface MatchResponse {
  /** 상대의 교환 세트 id — 매칭을 식별하는 값이기도 하다 */
  tradeSetId: number;
  userId: number;
  nickname: string;
  profileImageUrl?: string | null;
  matchScore: number;
  matchedHaveCards: MatchedCardResponse[];
  matchedWantCards: MatchedCardResponse[];
}

export interface MatchCandidate {
  /** 상대 교환 세트 id */
  id: string;
  partnerId: string;
  nickname: string;
  avatarUrl: string | null;
  matchScore: number;
  haveCards: Photocard[];
  wantCards: Photocard[];
}

/**
 * ⚠️ 매칭 카드는 **id와 이미지만** 온다(멤버/앨범/버전명 없음).
 * 목록(EX-001)은 이미지만 쓰므로 문제없고, 이름이 필요한 화면은 교환 세트 상세(7.3)를 쓴다.
 */
function toCards(cards: MatchedCardResponse[]): Photocard[] {
  return cards.map((card) => ({
    id: String(card.photoCardId),
    memberName: '',
    albumName: '',
    versionName: '',
    imageUrl: card.imageUrl,
    color: PLACEHOLDER_COLOR,
  }));
}

/**
 * 내 교환 세트에 대한 추천 매칭 목록.
 * 커서는 **문자열(Base64 opaque)** 이며 `matchScore` 내림차순 + 최신순.
 * ⚠️ Bearer 필수 — 토큰 없이 호출하면 401이 아니라 500이 난다(§1.9).
 */
export async function getMatches(params: { tradeSetId: string; cursor?: string; size?: number }) {
  const raw = await api.get<unknown>(`/trade-sets/${params.tradeSetId}/matches`, {
    query: { cursor: params.cursor, size: params.size },
  });

  const page = toCursorPage<MatchResponse, string>(raw, 'matches');
  return {
    items: page.items.map((match) => ({
      id: String(match.tradeSetId),
      partnerId: String(match.userId),
      nickname: match.nickname,
      avatarUrl: match.profileImageUrl ?? null,
      matchScore: match.matchScore,
      haveCards: toCards(match.matchedHaveCards),
      wantCards: toCards(match.matchedWantCards),
    })),
    nextCursor: page.nextCursor,
    hasNext: page.hasNext,
  } satisfies CursorPage<MatchCandidate, string>;
}
