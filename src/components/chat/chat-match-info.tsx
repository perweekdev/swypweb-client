'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { ExchangeInfoHeader } from '@components/common/exchange-info-header';
import { CHAT_ROUTES } from '@constants/routes';
import type { ExchangeStatus } from '@/types/chat.types';
import type { ExchangeSet } from '@/types/photocard.types';

/**
 * CHAT-002 상단 교환 정보. 스크롤해도 상단에 유지된다(sticky).
 * 교환 요약(ExchangeInfoHeader: 교환 포카 정보 링크 + 대표 포카 ⇄ 대표 포카) +
 * 교환 완료하기. 완료 후에는 요약만 남는다.
 *
 * `isReceiver`: 교환 완료는 **제안을 받은 쪽만** 할 수 있어 그 사람에게만 버튼을 보인다.
 * `null`(서버가 구분 값을 주지 않아 판단 불가)이면 가리지 않는다.
 */
export function ChatMatchInfo({
  roomId,
  exchangeSet,
  status,
  isReceiver,
}: {
  roomId: string;
  exchangeSet: ExchangeSet;
  status: ExchangeStatus;
  isReceiver: boolean | null;
}) {
  const router = useRouter();
  const canComplete = status === 'ongoing' && isReceiver !== false;

  return (
    <section className="border-b border-secondary-50 px-4 pb-3 pt-3">
      <ExchangeInfoHeader
        exchangeSet={exchangeSet}
        onViewAll={() => router.push(CHAT_ROUTES.roomDetail(roomId))}
      />
      {canComplete && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full py-2.5"
          onClick={() => router.push(CHAT_ROUTES.roomComplete(roomId))}
        >
          교환 완료하기
        </Button>
      )}
    </section>
  );
}
