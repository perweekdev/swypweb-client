import type { Photocard } from '@/types/photocard.types';
import type { FeedPost } from '@/types/home.types';

// BE 연동 전 임시 목 데이터 (이미지 에셋 전 placeholder 색상 = 포카 사진 자리)
const CARD_COLORS = ['#C9B7A3', '#8FA98C', '#B5C7D3', '#D9B8C4', '#A7A9BC', '#CBB89D'];

function makeCards(prefix: string, count: number): Photocard[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    memberName: 'Member',
    albumName: 'Album name',
    versionName: 'Version name',
    imageUrl: null,
    color: CARD_COLORS[i % CARD_COLORS.length],
  }));
}

export const mockFeedPosts: FeedPost[] = [
  {
    id: 'post-1',
    author: { id: 'u1', nickname: '포카요정', avatarColor: '#8FA98C', groups: '레드벨벳 · 아이브' },
    haveCards: makeCards('post-1-have', 3),
    wantCards: makeCards('post-1-want', 6),
  },
  {
    id: 'post-2',
    author: { id: 'u2', nickname: '포카컬렉터', avatarColor: '#B5C7D3', groups: '에스파' },
    haveCards: makeCards('post-2-have', 3),
    wantCards: makeCards('post-2-want', 4),
  },
  {
    id: 'post-3',
    author: { id: 'u3', nickname: '카드마스터', avatarColor: '#D9B8C4', groups: '아이브' },
    haveCards: makeCards('post-3-have', 5),
    wantCards: makeCards('post-3-want', 2),
  },
];

export const findMockFeedPost = (id: string) => mockFeedPosts.find((post) => post.id === id);
