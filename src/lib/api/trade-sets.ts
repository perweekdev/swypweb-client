import { api } from '@lib/api-client';
import type { Photocard } from '@/types/photocard.types';
import { PLACEHOLDER_COLOR } from '@constants/colors';

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
  /** 작성자 정보 (서버 추가분) */
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  haveCards: TradeSetCardResponse[];
  wantCards: TradeSetCardResponse[];
}

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
  /** 수정 화면에서 컬렉션 트리를 불러올 때 필요하다 */
  groupId: number;
  groupName: string;
  author: {
    id: string;
    nickname: string;
    avatarUrl: string | null;
  };
  haveCards: Photocard[];
  wantCards: Photocard[];
}

export interface TradeSetSummary {
  id: string;
  groupId: number;
  haveCount: number;
  wantCount: number;
  /** 목록은 축별 **대표 카드 1장**만 준다(전체 카드는 상세에서). */
  haveRepresentative: Photocard;
  wantRepresentative: Photocard;
  createdAt: string;
}

interface TradeSetListItemResponse {
  tradeSetId: number;
  groupId: number;
  haveCount: number;
  wantCount: number;
  haveImage: string | null;
  haveRepresentAlbumName: string | null;
  haveRepresentVersionName: string | null;
  wantImage: string | null;
  wantRepresentAlbumName: string | null;
  wantRepresentVersionName: string | null;
  createdAt: string;
}

/** 이미지가 없으면 색상 placeholder로 렌더되도록 imageUrl만 null로 둔다. */
function toRepresentative(
  id: string,
  imageUrl: string | null,
  albumName: string | null,
  versionName: string | null
): Photocard {
  return {
    id,
    memberName: '',
    albumName: albumName ?? '',
    versionName: versionName ?? '',
    imageUrl,
    color: PLACEHOLDER_COLOR,
  };
}

/**
 * 7.2 내 교환 세트 목록. `groupId` 필수, 커서 없이 전체 반환.
 * ⚠️ 문서상 공개 경로지만 컨트롤러가 토큰을 요구한다 — **Bearer 없이 호출하면 500**(§1.9).
 */
export async function getMyTradeSets(groupId: number): Promise<TradeSetSummary[]> {
  const data = await api.get<{ tradeSets: TradeSetListItemResponse[] }>('/trade-sets', {
    query: { groupId },
  });

  return (data.tradeSets ?? []).map((item) => ({
    id: String(item.tradeSetId),
    groupId: item.groupId,
    haveCount: item.haveCount,
    wantCount: item.wantCount,
    haveRepresentative: toRepresentative(
      `${item.tradeSetId}-have`,
      item.haveImage,
      item.haveRepresentAlbumName,
      item.haveRepresentVersionName
    ),
    wantRepresentative: toRepresentative(
      `${item.tradeSetId}-want`,
      item.wantImage,
      item.wantRepresentAlbumName,
      item.wantRepresentVersionName
    ),
    createdAt: item.createdAt,
  }));
}

export interface TradeSetPayload {
  haveCardIds: number[];
  wantCardIds: number[];
}

/**
 * 7.1 교환 세트 등록. 두 축 모두 1장 이상.
 * 카드 중복 → 409 `RESOURCE_004` / 유효하지 않은 카드 → 400 `VALIDATION_008`.
 * (성공은 201이 아니라 **HTTP 200**이다 — §1.3)
 */
export function createTradeSet(groupId: number, payload: TradeSetPayload) {
  return api.post<{ tradeSetId: number }>(`/trade-sets/${groupId}`, payload);
}

/** 7.4 교환 세트 수정. 소유자 아님 → 403 `AUTH_005` */
export function updateTradeSet(tradeSetId: string, payload: TradeSetPayload) {
  return api.put<{ tradeSetId: number }>(`/trade-sets/${tradeSetId}`, payload);
}

/** 7.5 교환 세트 삭제 */
export function deleteTradeSet(tradeSetId: string) {
  return api.delete<{ tradeSetId: number }>(`/trade-sets/${tradeSetId}`);
}

/**
 * 7.3 교환 세트 상세. **공개 API**(인증 불필요).
 * 작성자 정보를 함께 준다 — 화면은 이 값을 쓰면 되고 따로 전달할 필요가 없다.
 * 없는 세트 → 404.
 */
export async function getTradeSetDetail(tradeSetId: string): Promise<TradeSetDetail> {
  const data = await api.get<TradeSetDetailResponse>(`/trade-sets/${tradeSetId}`, { auth: false });

  return {
    id: String(data.tradeSetId),
    groupId: data.groupId,
    groupName: data.groupName,
    author: {
      id: String(data.userId),
      nickname: data.nickname,
      avatarUrl: data.profileImageUrl,
    },
    haveCards: data.haveCards.map(toCard),
    wantCards: data.wantCards.map(toCard),
  };
}
