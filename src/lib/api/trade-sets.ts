import { api } from '@lib/api-client';
import type { Photocard } from '@/types/photocard.types';

/** 교환 세트 API. 근거: docs/api-reference.md §7 */

interface TradeSetCardResponse {
  photoCardId: number;
  albumName: string;
  versionName: string;
  /** 카드명. 서버가 memberName을 따로 주지 않아 이 값을 멤버명 자리에 쓴다. */
  photoCardName: string;
  imageUrl: string;
}

interface TradeSetDetailResponse {
  tradeSetId: number;
  groupId: number;
  groupName: string;
  createdAt: string;
  haveCards: TradeSetCardResponse[];
  wantCards: TradeSetCardResponse[];
}

const PLACEHOLDER_COLOR = '#E6E8EB';

function toCard(card: TradeSetCardResponse): Photocard {
  return {
    id: String(card.photoCardId),
    // ⚠️ 서버에 memberName이 없다(§9). 표기 순서상 첫 줄이므로 카드명을 넣는다.
    memberName: card.photoCardName,
    albumName: card.albumName,
    versionName: card.versionName,
    imageUrl: card.imageUrl,
    color: PLACEHOLDER_COLOR,
  };
}

export interface TradeSetDetail {
  id: string;
  groupName: string;
  haveCards: Photocard[];
  wantCards: Photocard[];
}

/**
 * 7.3 교환 세트 상세. **공개 API**(인증 불필요).
 * ⚠️ 작성자(author) 정보가 응답에 없다 → 홈 피드에서 받은 값을 화면으로 전달해야 한다.
 * 없는 세트 → 404.
 */
export async function getTradeSetDetail(tradeSetId: string): Promise<TradeSetDetail> {
  const data = await api.get<TradeSetDetailResponse>(`/trade-sets/${tradeSetId}`, { auth: false });

  return {
    id: String(data.tradeSetId),
    groupName: data.groupName,
    haveCards: data.haveCards.map(toCard),
    wantCards: data.wantCards.map(toCard),
  };
}
