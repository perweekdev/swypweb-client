import { PhotocardImage, PhotocardMeta } from '@components/photocard/photocard-card';
import type { Photocard } from '@/types/photocard.types';

/**
 * 가로형 대표 포카 카드 (card-set-info). 작은 사진 + 정보 + '외 N장'.
 * 계측: 대표 사진 46×75, 정보(멤버명/앨범명/앨범 버전), 우하단 '외 N장'.
 * CHAT-002 매치 정보·교환 세트 요약에서 이 카드를 좌우로 배치한다(청크 7에서 통합).
 */
export function CardSetInfo({
  card,
  extraCount = 0,
  className = '',
}: {
  card: Photocard;
  extraCount?: number;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 gap-2 ${className}`}>
      <PhotocardImage card={card} className="h-[75px] w-[46px] shrink-0 rounded-md" />
      <div className="flex min-w-0 flex-1 flex-col">
        <PhotocardMeta card={card} />
        {extraCount > 0 && (
          <span className="mt-auto text-right text-body4 text-secondary-300">
            외 {extraCount}장
          </span>
        )}
      </div>
    </div>
  );
}
