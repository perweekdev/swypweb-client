import { notFound } from 'next/navigation';
import { OfferCardSelector } from '@components/common/offer-card-selector';
import { findMockMatchResult, mockMatchResults } from '@/mocks/exchange';

export function generateStaticParams() {
  return mockMatchResults.map((match) => ({ id: match.id }));
}

/** EX-006 교환할 포카 선택 (매칭 상대에게 제안) */
export default async function MatchSelectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = findMockMatchResult(id);
  if (!match) notFound();

  // 있어요 = 내가 보낼 수 있는 포카(내 포카), 구해요 = 상대에게 받을 포카(상대방 포카)
  return <OfferCardSelector myCards={match.haveCards} partnerCards={match.wantCards} />;
}
