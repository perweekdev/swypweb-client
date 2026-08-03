'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { BottomSheet } from '@components/ui/bottom-sheet';
import { SelectableCardGrid } from '@components/photocard/selectable-card-grid';
import { PhotocardImage } from '@components/photocard/photocard-card';
import { useCreateChatRoom } from '@hooks/use-chat';
import { isApiError } from '@lib/api-error';
import { API_ERROR_CODES } from '@constants/api-error-codes';
import { CHAT_ROUTES } from '@constants/routes';
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

/**
 * 교환할 포카 선택 + 제안 확인. **HOME-004 / EX-006이 같은 화면**이라 공유한다.
 * 내 포카·상대방 포카를 각각 1장 이상 고르면 `완료`가 켜지고, 확인 시트에서 채팅으로 제안한다.
 * 계측: 제목 20 semibold `#000000` 2줄 · `완료` 53×38 pill(비활성 secondary-100 / 활성 secondary-900).
 */
export function OfferCardSelector({
  targetTradeSetId,
  myCards,
  partnerCards,
}: {
  /** 상대의 교환 세트 id — 제안 대상 */
  targetTradeSetId: string;
  myCards: Photocard[];
  partnerCards: Photocard[];
}) {
  const router = useRouter();
  const createChatRoom = useCreateChatRoom();
  const [myPicked, setMyPicked] = useState<Set<string>>(new Set());
  const [partnerPicked, setPartnerPicked] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 스토리보드: 내 포카/상대방 포카 각각 1장 이상 선택 시 '완료' 활성화
  const canComplete = myPicked.size > 0 && partnerPicked.size > 0;
  const selectedMy = myCards.filter((c) => myPicked.has(c.id));
  const selectedPartner = partnerCards.filter((c) => partnerPicked.has(c.id));

  const propose = async () => {
    if (createChatRoom.isPending) return;
    setError(null);

    try {
      const { chatRoomId } = await createChatRoom.mutateAsync({
        targetTradeSetId: Number(targetTradeSetId),
        // 내가 **받을** 카드 = 상대방 포카 / 내가 **줄** 카드 = 내 포카
        receiveCardIds: [...partnerPicked].map(Number),
        giveCardIds: [...myPicked].map(Number),
      });
      // 제안은 이미 끝났으므로 카드 선택 화면을 히스토리에서 지우고(replace),
      // 채팅방에서 뒤로가면 카드 선택 이전 화면이 아니라 채팅 목록으로 가도록 표시한다.
      router.replace(CHAT_ROUTES.createdRoom(String(chatRoomId)));
    } catch (caught) {
      if (!isApiError(caught)) {
        setError('잠시 후 다시 시도해주세요.');
        return;
      }
      if (caught.code === API_ERROR_CODES.SELF_TRADE_NOT_ALLOWED) {
        setError('내가 등록한 교환 세트에는 제안할 수 없어요.');
        return;
      }
      if (
        caught.code === API_ERROR_CODES.INVALID_RECEIVE_CARD ||
        caught.code === API_ERROR_CODES.INVALID_GIVE_CARD
      ) {
        setError('선택한 포카를 다시 확인해주세요.');
        return;
      }
      setError(caught.message);
    }
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
        <p className="whitespace-pre-line text-h1 text-black">
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
        {error && <p className="mt-3 text-center text-body3 text-red-900">{error}</p>}
        <Button size="lg" onClick={propose} disabled={createChatRoom.isPending} className="mt-6">
          {createChatRoom.isPending ? '제안하는 중...' : '채팅으로 교환 제안하기'}
        </Button>
      </BottomSheet>
    </>
  );
}
