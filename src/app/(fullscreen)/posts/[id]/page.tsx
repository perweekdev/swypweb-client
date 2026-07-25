import { Suspense } from 'react';
import { PostDetailView } from '@components/home/post-detail-view';

/**
 * HOME-003 교환글 상세 (조회 + 교환할 포카 선택 진입).
 * `id`는 서버의 tradeSetId다. 목 데이터 시절의 generateStaticParams는 제거했다
 * (실제 id는 런타임에만 알 수 있다).
 */
export default function PostDetailPage() {
  return (
    <Suspense>
      <PostDetailView />
    </Suspense>
  );
}
