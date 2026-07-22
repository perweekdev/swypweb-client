import { notFound } from 'next/navigation';
import { OfferCardSelector } from '@components/common/offer-card-selector';
import { findMockFeedPost, mockFeedPosts } from '@/mocks/home';

export function generateStaticParams() {
  return mockFeedPosts.map((post) => ({ id: post.id }));
}

/** HOME-004 교환할 포카 선택 */
export default async function PostSelectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = findMockFeedPost(id);
  if (!post) notFound();

  // mock: 내 포카/상대방 포카 그리드를 교환글의 두 카드 세트로 채운다(내 컬렉션 목 없음).
  return <OfferCardSelector myCards={post.haveCards} partnerCards={post.wantCards} />;
}
