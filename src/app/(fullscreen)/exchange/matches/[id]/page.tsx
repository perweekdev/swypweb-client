import { notFound } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { DetailActionBar } from '@components/common/detail-action-bar';
import { EXCHANGE_ROUTES } from '@constants/routes';
import { findMockMatchResult, mockMatchResults } from '@/mocks/exchange';

export function generateStaticParams() {
  return mockMatchResults.map((match) => ({ id: match.id }));
}

/** EX-005 매칭 결과 상세 (조회 + 제안 진입) */
export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = findMockMatchResult(id);
  if (!match) notFound();

  return (
    <>
      <Header title="매치 상세 정보" />
      <div className="flex-1 px-4 pb-4 pt-1">
        <ExchangeCardSections haveCards={match.haveCards} wantCards={match.wantCards} />
      </div>
      <DetailActionBar
        name={match.partner.nickname}
        avatarColor={match.partner.avatarColor}
        groups={match.partner.groups}
        label="제안하기"
        href={EXCHANGE_ROUTES.matchSelect(match.id)}
      />
    </>
  );
}
