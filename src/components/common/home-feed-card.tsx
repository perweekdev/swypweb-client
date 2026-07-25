import { UserProfile } from '@components/common/user-profile';
import { PhotocardRow } from '@components/photocard/photocard-row';
import type { Photocard } from '@/types/photocard.types';

/**
 * 홈 피드 교환글 카드 (home-feed-exchange-info).
 * 상대 프로필(제안하기) + 있어요/구해요 포카 가로 스크롤. EX-001 매칭 리스트도 같은 구성을 쓴다.
 */
export function HomeFeedCard({
  name,
  avatarColor,
  avatarUrl,
  haveCards,
  wantCards,
  onOffer,
  onClick,
  isMine = false,
  className = '',
}: {
  name: string;
  avatarColor?: string;
  avatarUrl?: string | null;
  haveCards: Photocard[];
  wantCards: Photocard[];
  onOffer?: () => void;
  /** 카드 전체 클릭 (EX-001 매칭 결과 → EX-005 상세). '제안하기' 버튼은 전파를 막는다. */
  onClick?: () => void;
  /** 내가 쓴 교환글 — 자기 자신에게는 제안할 수 없어(AUTH_006) 버튼을 숨긴다. */
  isMine?: boolean;
  className?: string;
}) {
  return (
    <article className={className} onClick={onClick}>
      <UserProfile
        name={name}
        avatarColor={avatarColor}
        avatarUrl={avatarUrl}
        variant={isMine ? 'info' : 'offer'}
        onAction={onOffer}
      />
      <div className="mt-3 space-y-3">
        <PhotocardRow label={`있어요 ${haveCards.length}`} cards={haveCards} />
        <PhotocardRow label={`구해요 ${wantCards.length}`} cards={wantCards} />
      </div>
    </article>
  );
}
