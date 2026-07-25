import { Suspense } from 'react';
import { MatchDetailView } from '@components/exchange/match-detail-view';

/**
 * EX-005 매칭 결과 상세.
 * `id`는 상대의 교환 세트 id다(런타임에만 알 수 있어 정적 생성하지 않는다).
 */
export default function MatchDetailPage() {
  return (
    <Suspense>
      <MatchDetailView />
    </Suspense>
  );
}
