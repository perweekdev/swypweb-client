'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
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

/**
 * CHAT-004 교환 완료 포카 선택.
 *
 * ⚠️ **교환 완료는 제안을 '받은' 쪽만 처리할 수 있다**(제안한 쪽에는 버튼이 보이면 안 된다).
 * 그런데 채팅 응답(8.2·8.3·8.4) 어디에도 **내가 제안자인지 수신자인지 구분할 값이 없다.**
 * 그래서 지금은 버튼을 가리지 못하고, 권한 없이 눌렀을 때 안내만 한다.
 * 서버가 구분 필드를 주면 진입 자체를 막는다.
 *
 * ⏸️ **교환 세트 정리(포카/세트 삭제)는 아직 붙이지 않았다.**
 * 스토리보드에는 완료 후 "이 포카를 교환 세트에서 삭제할까요?" 팝업이 있지만,
 * 채팅방 응답에 **관련 교환 세트 id가 없어** 프론트가 어떤 세트를 고칠지 알 수 없다.
 * 서버가 완료 시 함께 정리하는지, 아니면 프론트가 따로 호출해야 하는지 확인 후 붙인다.
 * (확인 전까지 팝업을 띄우면 '삭제할까요?'에 예를 눌러도 아무 일이 없어 오히려 혼란스럽다)
 */
export function ChatCompleteSelector() {
  const router = useRouter();
  const chatId = String(useParams().id ?? '');

  const { data: proposal, isPending, isError } = useChatProposal(chatId);
  const completeExchange = useCompleteChatExchange(chatId);

  const [myPicked, setMyPicked] = useState<Set<string>>(new Set());
  const [partnerPicked, setPartnerPicked] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // 스토리보드: '내 포카'와 '상대방 포카' 각각 1개 이상 선택 시 '완료' 활성화
  const canComplete = myPicked.size > 0 && partnerPicked.size > 0 && !completeExchange.isPending;

  const handleComplete = async () => {
    if (!canComplete) return;
    setError(null);

    try {
      await completeExchange.mutateAsync();
      router.replace(CHAT_ROUTES.room(chatId));
    } catch (caught) {
      // 제안한 쪽이 누른 경우 — 완료는 제안을 받은 쪽만 할 수 있다.
      if (isApiError(caught) && caught.status === 403) {
        setError('교환 완료는 제안을 받은 분만 처리할 수 있어요.');
        return;
      }
      setError(isApiError(caught) ? caught.message : '교환 완료 처리에 실패했어요.');
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
            onClick={handleComplete}
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
    </>
  );
}
