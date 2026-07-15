'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon } from '@components/icons';
import { Header } from '@components/layout/header';
import { PhotocardCard } from '@components/photocard/photocard-card';
import { Button } from '@components/ui/button';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { CHAT_ROUTES } from '@constants/routes';
import type { ChatRoom } from '@/types/chat.types';
import type { Photocard } from '@/types/photocard.types';

/** 어떤 삭제 팝업을 띄울지 (스토리보드 CHAT-004 동작 정의) */
type DeleteDialog = 'cards' | 'set';

const DIALOG_COPY = {
  cards: {
    title: '교환이 완료됐어요!\n이 포카를 교환 세트에서 삭제할까요?',
    description: '완료된 포카만 사라지고 다른 포카 매칭은 유지돼요.',
    confirmText: '포카 삭제하기',
  },
  set: {
    title: '모든 포카를 교환했어요!\n완료된 교환 세트를 삭제할까요?',
    description: '더 이상 매칭할 포카가 없어 이 교환 세트가 완전히 삭제돼요.',
    confirmText: '세트 삭제하기',
  },
} as const;

/** 선택 가능한 포카 카드. 미선택은 반투명, 체크 표시는 항상 선명하다(계측). */
function SelectableCard({
  card,
  selected,
  onToggle,
}: {
  card: Photocard;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className="relative block w-full text-left"
    >
      <div className={selected ? '' : 'opacity-50'}>
        <PhotocardCard card={card} />
      </div>
      <span
        className={`absolute right-2 top-2 flex size-5 items-center justify-center rounded-full text-white ${
          selected ? 'bg-primary-900' : 'bg-gray-500'
        }`}
      >
        <CheckIcon className="size-3" />
      </span>
    </button>
  );
}

function CardSection({
  label,
  cards,
  selected,
  onToggle,
  className = '',
}: {
  label: string;
  cards: Photocard[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="text-button2 text-secondary-900">{label}</h2>
      <ul className="mt-1.5 grid grid-cols-3 gap-2">
        {cards.map((card) => (
          <li key={card.id}>
            <SelectableCard
              card={card}
              selected={selected.has(card.id)}
              onToggle={() => onToggle(card.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

const toggleIn = (set: Set<string>, id: string) => {
  const next = new Set(set);
  if (!next.delete(id)) next.add(id);
  return next;
};

/** CHAT-004 교환 완료 포카 선택 */
export function ChatCompleteSelector({ room }: { room: ChatRoom }) {
  const router = useRouter();
  const { myCards, partnerCards } = room.exchangeSet;
  const [myPicked, setMyPicked] = useState<Set<string>>(new Set());
  const [partnerPicked, setPartnerPicked] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<DeleteDialog | null>(null);

  // 스토리보드: '내 포카'와 '상대방 포카' 각각 1개 이상 선택 시 '완료' 활성화
  const canComplete = myPicked.size > 0 && partnerPicked.size > 0;

  const backToRoom = () => router.replace(CHAT_ROUTES.room(room.id));

  const handleComplete = () => {
    // 예외 1: 홈 피드 제안으로 시작된 채팅은 매칭된 교환 세트가 없어 삭제 팝업을 띄우지 않는다
    if (room.fromFeed) {
      backToRoom();
      return;
    }
    // 한쪽이라도 전체 선택이면 세트가 통째로 사라진다 → 세트 삭제 팝업
    const clearsASide =
      myPicked.size === myCards.length || partnerPicked.size === partnerCards.length;
    setDialog(clearsASide ? 'set' : 'cards');
  };

  return (
    <>
      <Header
        title="상세 정보"
        right={
          <Button
            variant="navy"
            size="sm"
            disabled={!canComplete}
            onClick={handleComplete}
            className="disabled:bg-secondary-100"
          >
            완료
          </Button>
        }
      />

      <div className="px-4">
        <p className="whitespace-pre-line text-h3 text-black">
          {'교환이 완료된 포카를\n선택하세요.'}
        </p>

        <CardSection
          label="내 포카"
          cards={myCards}
          selected={myPicked}
          onToggle={(id) => setMyPicked((prev) => toggleIn(prev, id))}
          className="mt-6"
        />
        <CardSection
          label="상대방 포카"
          cards={partnerCards}
          selected={partnerPicked}
          onToggle={(id) => setPartnerPicked((prev) => toggleIn(prev, id))}
          className="mt-5"
        />
      </div>

      {dialog && (
        <ConfirmDialog
          open
          title={DIALOG_COPY[dialog].title}
          description={DIALOG_COPY[dialog].description}
          cancelText="아니요"
          confirmText={DIALOG_COPY[dialog].confirmText}
          // 스토리보드: 취소/삭제 모두 채팅방(CHAT-002)으로 돌아간다
          onCancel={backToRoom}
          onConfirm={() => {
            // TODO: 교환 완료 및 포카/세트 삭제 API 연동
            backToRoom();
          }}
        />
      )}
    </>
  );
}
