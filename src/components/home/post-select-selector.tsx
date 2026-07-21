'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { BottomSheet } from '@components/ui/bottom-sheet';
import { SelectableCardGrid } from '@components/photocard/selectable-card-grid';
import { PhotocardImage } from '@components/photocard/photocard-card';
import { ROUTES } from '@constants/routes';
import type { Photocard } from '@/types/photocard.types';

const toggleIn = (set: Set<string>, id: string) => {
  const next = new Set(set);
  if (!next.delete(id)) next.add(id);
  return next;
};

/** 제안 확인 시트의 선택 포카 미리보기 행 */
function PreviewRow({
  label,
  cards,
  className = '',
}: {
  label: string;
  cards: Photocard[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-body2 text-secondary-500">{`${label} ${cards.length}`}</p>
      <ul className="mt-2 flex gap-2">
        {cards.map((card) => (
          <li key={card.id} className="w-14">
            <PhotocardImage card={card} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** HOME-004 교환할 포카 선택 + 제안 확인 */
export function PostSelectSelector({
  myCards,
  partnerCards,
}: {
  myCards: Photocard[];
  partnerCards: Photocard[];
}) {
  const router = useRouter();
  const [myPicked, setMyPicked] = useState<Set<string>>(new Set());
  const [partnerPicked, setPartnerPicked] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);

  // 스토리보드: 내 포카/상대방 포카 각각 1장 이상 선택 시 '완료' 활성화
  const canComplete = myPicked.size > 0 && partnerPicked.size > 0;
  const selectedMy = myCards.filter((c) => myPicked.has(c.id));
  const selectedPartner = partnerCards.filter((c) => partnerPicked.has(c.id));

  const propose = () => {
    // TODO: 실제 교환 제안 → 채팅방 생성 API(첫 메시지 전송 시 생성). 현재는 채팅 목록으로 이동(mock).
    router.push(ROUTES.chat);
  };

  return (
    <>
      <Header
        title="교환 포카 선택"
        right={
          <Button
            variant="navy"
            size="sm"
            disabled={!canComplete}
            onClick={() => setSheetOpen(true)}
            className="disabled:bg-secondary-100"
          >
            완료
          </Button>
        }
      />

      <div className="px-4 pb-8">
        <p className="whitespace-pre-line text-h3 text-black">
          {'교환할 내 포카와\n상대방 포카를 선택하세요'}
        </p>

        <section className="mt-6">
          <h2 className="text-button2 text-secondary-900">내 포카</h2>
          <SelectableCardGrid
            cards={myCards}
            selected={myPicked}
            onToggle={(id) => setMyPicked((prev) => toggleIn(prev, id))}
            className="mt-1.5"
          />
        </section>

        <section className="mt-5">
          <h2 className="text-button2 text-secondary-900">상대방 포카</h2>
          <SelectableCardGrid
            cards={partnerCards}
            selected={partnerPicked}
            onToggle={(id) => setPartnerPicked((prev) => toggleIn(prev, id))}
            className="mt-1.5"
          />
        </section>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <h3 className="text-h1 text-secondary-900">제안할 포카를 확인해주세요</h3>
        <PreviewRow label="내 포카" cards={selectedMy} className="mt-4" />
        <PreviewRow label="상대방 포카" cards={selectedPartner} className="mt-4" />
        <Button size="lg" onClick={propose} className="mt-6">
          채팅으로 교환 제안하기
        </Button>
      </BottomSheet>
    </>
  );
}
