import { notFound } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { findMockChatRoom, mockChatRooms } from '@/mocks/chat';

export function generateStaticParams() {
  return mockChatRooms.map((room) => ({ id: room.id }));
}

/** CHAT-003 교환 포카 정보 (조회 전용) */
export default async function ChatExchangeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = findMockChatRoom(id);
  if (!room) notFound();

  return (
    <>
      <Header title="교환 포카 정보" />
      <div className="px-4 pt-1">
        <ExchangeCardSections
          haveCards={room.exchangeSet.myCards}
          wantCards={room.exchangeSet.partnerCards}
        />
      </div>
    </>
  );
}
