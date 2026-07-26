'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { EmptyState } from '@components/common/empty-state';
import { SelectableCardGrid } from '@components/photocard/selectable-card-grid';
import { useChatProposal, useCompleteChatExchange } from '@hooks/use-chat';
import { isApiError } from '@lib/api-error';
import { CHAT_ROUTES } from '@constants/routes';

const toggleIn = (set: Set<string>, id: string) => {
  const next = new Set(set);
  if (!next.delete(id)) next.add(id);
  return next;
};

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

/**
 * CHAT-004 교환 완료 포카 선택.
 *
 * ⚠️ **교환 완료는 제안을 '받은' 쪽만 처리할 수 있다**(제안한 쪽에는 버튼이 보이면 안 된다).
 * 그런데 채팅 응답(8.2·8.3·8.4) 어디에도 **내가 제안자인지 수신자인지 구분할 값이 없다.**
 * 그래서 지금은 버튼을 가리지 못하고, 권한 없이 눌렀을 때 안내만 한다.
 * 서버가 구분 필드를 주면 진입 자체를 막는다.
 *
 * 완료 후 삭제 팝업의 선택은 `deleteTradedCards`(필수)로 전달되고, **세트 정리는 서버가 한다.**
 * 그래서 프론트가 교환 세트 id를 알 필요가 없다.
 * 취소(`아니요`)도 교환 완료 자체는 진행된다 — 팝업은 '정리 여부'만 묻는다(스토리보드).
 */
export function ChatCompleteSelector() {
  const router = useRouter();
  const chatId = String(useParams().id ?? '');

  const { data: proposal, isPending, isError } = useChatProposal(chatId);
  const completeExchange = useCompleteChatExchange(chatId);

  const [myPicked, setMyPicked] = useState<Set<string>>(new Set());
  const [partnerPicked, setPartnerPicked] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<DeleteDialog | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 스토리보드: '내 포카'와 '상대방 포카' 각각 1개 이상 선택 시 '완료' 활성화
  const canComplete = myPicked.size > 0 && partnerPicked.size > 0 && !completeExchange.isPending;

  const openDeleteDialog = () => {
    if (!canComplete || !proposal) return;
    // 한쪽이라도 전부 선택했다면 세트가 통째로 비므로 세트 삭제를 묻는다.
    const clearsASide =
      myPicked.size === proposal.myCards.length ||
      partnerPicked.size === proposal.partnerCards.length;
    setDialog(clearsASide ? 'set' : 'cards');
  };

  /** 팝업의 선택이 곧 `deleteTradedCards`다. 어느 쪽을 골라도 교환 완료는 진행된다. */
  const complete = async (deleteTradedCards: boolean) => {
    setDialog(null);
    setError(null);

    try {
      await completeExchange.mutateAsync(deleteTradedCards);
      router.replace(CHAT_ROUTES.room(chatId));
    } catch (caught) {
      if (!isApiError(caught)) {
        setError('교환 완료 처리에 실패했어요.');
        return;
      }
      // 완료는 제안을 받은 쪽만 할 수 있다(AUTH_007).
      if (caught.status === 403) {
        setError('교환 완료는 제안을 받은 분만 처리할 수 있어요.');
        return;
      }
      if (caught.status === 409) {
        setError('이미 교환이 완료된 채팅이에요.');
        return;
      }
      setError('교환 완료 처리에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
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
            onClick={openDeleteDialog}
            className="disabled:bg-secondary-100"
          >
            {completeExchange.isPending ? '처리 중' : '완료'}
          </Button>
        }
      />

      {isPending && (
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          불러오는 중...
        </p>
      )}

      {isError && (
        <EmptyState
          title="교환 정보를 불러오지 못했어요."
          description="잠시 후 다시 시도해주세요."
        />
      )}

      {proposal && (
        <div className="px-4">
          <p className="whitespace-pre-line text-h3 text-black">
            {'교환이 완료된 포카를\n선택하세요.'}
          </p>

          <section className="mt-6">
            <h2 className="text-button2 text-secondary-900">내 포카</h2>
            <SelectableCardGrid
              cards={proposal.myCards}
              selected={myPicked}
              onToggle={(id) => setMyPicked((prev) => toggleIn(prev, id))}
              className="mt-1.5"
            />
          </section>

          <section className="mt-5">
            <h2 className="text-button2 text-secondary-900">상대방 포카</h2>
            <SelectableCardGrid
              cards={proposal.partnerCards}
              selected={partnerPicked}
              onToggle={(id) => setPartnerPicked((prev) => toggleIn(prev, id))}
              className="mt-1.5"
            />
          </section>

          {error && <p className="mt-4 text-center text-body3 text-red-900">{error}</p>}
        </div>
      )}

      {dialog && (
        <ConfirmDialog
          open
          title={DIALOG_COPY[dialog].title}
          description={DIALOG_COPY[dialog].description}
          cancelText="아니요"
          confirmText={DIALOG_COPY[dialog].confirmText}
          // 스토리보드: 취소/삭제 모두 교환은 완료되고 채팅방으로 돌아간다.
          onCancel={() => void complete(false)}
          onConfirm={() => void complete(true)}
        />
      )}
    </>
  );
}
