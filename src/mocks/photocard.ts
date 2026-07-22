import type { Photocard } from '@/types/photocard.types';

// BE 연동 전 임시 목 데이터 (이미지 에셋 전 placeholder 색상 = 포카 사진 자리)
export const CARD_COLORS = ['#C9B7A3', '#8FA98C', '#B5C7D3', '#D9B8C4', '#A7A9BC', '#CBB89D'];

/** 목 포카 N장 생성. id는 `${prefix}-${index}`로 화면 간 충돌을 피한다. */
export function makeCards(prefix: string, count: number): Photocard[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    memberName: 'Member',
    albumName: 'Album name',
    versionName: 'Version name',
    imageUrl: null,
    color: CARD_COLORS[i % CARD_COLORS.length],
  }));
}
