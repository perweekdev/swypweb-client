import type { FeedPost } from '@/types/home.types';
import { makeCards } from '@/mocks/photocard';

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
