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
 * 교환 완료하기(진행중일 때만). 완료 후에는 요약만 남는다.
 */
export function ChatMatchInfo({
  roomId,
  exchangeSet,
  status,
}: {
  roomId: string;
  exchangeSet: ExchangeSet;
  status: ExchangeStatus;
}) {
  const router = useRouter();

  return (
    <section className="border-b border-secondary-50 px-4 pb-3 pt-3">
      <ExchangeInfoHeader
        exchangeSet={exchangeSet}
        onViewAll={() => router.push(CHAT_ROUTES.roomDetail(roomId))}
      />
      {status === 'ongoing' && (
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
