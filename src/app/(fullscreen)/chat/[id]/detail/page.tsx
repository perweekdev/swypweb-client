'use client';

import { useParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { useChatProposal } from '@hooks/use-chat';

/** CHAT-003 교환 포카 정보 (조회 전용) */
export default function ChatExchangeDetailPage() {
  const chatId = String(useParams().id ?? '');
  const { data: proposal, isPending, isError } = useChatProposal(chatId);

  return (
    <>
      <Header title="교환 포카 정보" />

      {isPending && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">불러오는 중...</p>
      )}
      {isError && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">
          교환 정보를 불러오지 못했어요.
        </p>
      )}

      {proposal && (
        <div className="px-4 pt-1">
          <ExchangeCardSections haveCards={proposal.myCards} wantCards={proposal.partnerCards} />
        </div>
      )}
    </>
  );
}
