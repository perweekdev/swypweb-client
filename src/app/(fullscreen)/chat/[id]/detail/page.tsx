import { notFound } from 'next/navigation';
import { Header } from '@components/layout/header';
import { PhotocardCard } from '@components/photocard/photocard-card';
import { findMockChatRoom, mockChatRooms } from '@/mocks/chat';
import type { Photocard } from '@/types/photocard.types';

export function generateStaticParams() {
  return mockChatRooms.map((room) => ({ id: room.id }));
}

/** 있어요 / 구해요 섹션 — 라벨 옆에 포카 수, 3열 그리드 */
function CardSection({
  label,
  cards,
  className = '',
}: {
  label: string;
  cards: Photocard[];
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="text-button2 text-secondary-900">
        {label} {cards.length}
      </h2>
      <ul className="mt-1.5 grid grid-cols-3 gap-2">
        {cards.map((card) => (
          <li key={card.id}>
            <PhotocardCard card={card} />
          </li>
        ))}
      </ul>
    </section>
  );
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
        <CardSection label="있어요" cards={room.exchangeSet.myCards} />
        <CardSection label="구해요" cards={room.exchangeSet.partnerCards} className="mt-5" />
      </div>
    </>
  );
}
