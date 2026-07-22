import { notFound } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { DetailActionBar } from '@components/common/detail-action-bar';
import { POST_ROUTES } from '@constants/routes';
import { findMockFeedPost, mockFeedPosts } from '@/mocks/home';

export function generateStaticParams() {
  return mockFeedPosts.map((post) => ({ id: post.id }));
}

/** HOME-003 교환글 상세 (조회 + 교환할 포카 선택 진입) */
export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = findMockFeedPost(id);
  if (!post) notFound();

  return (
    <>
      <Header title="상세 정보" />
      <div className="flex-1 px-4 pb-4 pt-1">
        <ExchangeCardSections haveCards={post.haveCards} wantCards={post.wantCards} />
      </div>
      <DetailActionBar
        name={post.author.nickname}
        avatarColor={post.author.avatarColor}
        groups={post.author.groups}
        label="교환할 포카 선택하기"
        href={POST_ROUTES.select(post.id)}
      />
    </>
  );
}
