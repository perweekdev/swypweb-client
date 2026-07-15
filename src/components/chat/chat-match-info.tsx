import Link from 'next/link';
import { SwapIcon } from '@components/icons';
import { Button } from '@components/ui/button';
import { CHAT_ROUTES } from '@constants/routes';
import type { ExchangeStatus } from '@/types/chat.types';
import type { ExchangeSet, Photocard } from '@/types/photocard.types';

/** 대표 포카 1장 + 정보 (멤버명 / 앨범명 / 앨범 버전) */
function RepresentativeCard({ card }: { card: Photocard }) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-2">
      {/* TODO: imageUrl 제공 시 next/image로 교체 */}
      <div
        className="h-[75px] w-[46px] shrink-0 rounded-md"
        style={{ backgroundColor: card.color }}
        role="img"
        aria-label={`${card.memberName} ${card.albumName} ${card.versionName}`}
      />
      <div className="min-w-0 pt-1">
        <p className="truncate text-body4 text-secondary-500">{card.memberName}</p>
        <p className="truncate text-body3 text-secondary-900">{card.albumName}</p>
        <p className="truncate text-body4 text-secondary-300">{card.versionName}</p>
      </div>
    </div>
  );
}

/**
 * CHAT-002 상단 교환 정보. 스크롤해도 상단에 유지된다(memo).
 * 교환 완료 후에는 '교환 완료하기'가 사라지고 '상세 정보 보기'만 남는다.
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
  const { myCards, partnerCards } = exchangeSet;
  // 구해요(원해요)로 등록한 포카 중 대표 1장을 뺀 나머지 장 수. 그래서 우측(구해요)에만 표시된다.
  const extraCount = partnerCards.length - 1;

  return (
    <section className="border-b border-secondary-50 px-4 pt-3">
      <div className="flex items-start gap-2">
        <RepresentativeCard card={myCards[0]} />
        <SwapIcon className="mt-8 size-4 shrink-0 text-secondary-300" />
        <RepresentativeCard card={partnerCards[0]} />
      </div>

      <p className="mt-1 h-4 text-right text-body4 text-secondary-300">
        {extraCount > 0 && `외 ${extraCount}장`}
      </p>

      <div className="flex gap-1.5 pb-3 pt-1">
        <Link href={CHAT_ROUTES.roomDetail(roomId)} className="flex-1">
          <Button variant="outline" size="sm" className="w-full py-2.5">
            상세 정보 보기
          </Button>
        </Link>
        {status === 'ongoing' && (
          <Link href={CHAT_ROUTES.roomComplete(roomId)} className="flex-1">
            <Button variant="outline" size="sm" className="w-full py-2.5">
              교환 완료하기
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
