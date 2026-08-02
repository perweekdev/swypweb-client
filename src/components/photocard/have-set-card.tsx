import Image from 'next/image';
import { cardLabel } from '@components/photocard/photocard-card';
import type { Photocard } from '@/types/photocard.types';

/**
 * 오버레이형 교환 세트 카드 (have-set-info). 사진 위에 라벨·정보·'외 N장'을 얹는다.
 * 계측: 108×120, 좌상단 라벨(있어요/구해요), 하단에 정보 + 우하단 '외 N장'.
 *
 * 사진 **전체**에 검정 60% 오버레이를 깐다(EX-001). 하단 그라데이션만으로는
 * 좌상단 '있어요' 라벨이 밝은 사진 위에서 읽히지 않았다.
 * 60%는 디자인 실측 — 오버레이 영역의 최대 밝기가 101(=255×0.4)이었다.
 */
export function HaveSetCard({
  card,
  label = '있어요',
  extraCount = 0,
  className = '',
}: {
  card: Photocard;
  label?: string;
  extraCount?: number;
  className?: string;
}) {
  return (
    <div className={`relative aspect-[108/120] overflow-hidden rounded-xl ${className}`}>
      {card.imageUrl ? (
        <Image
          src={card.imageUrl}
          alt={cardLabel(card)}
          fill
          sizes="(max-width: 420px) 30vw, 108px"
          className="object-cover"
        />
      ) : (
        <div
          className="size-full"
          style={{ backgroundColor: card.color }}
          role="img"
          aria-label={cardLabel(card)}
        />
      )}

      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <span className="absolute left-2 top-2 text-body3 font-medium text-white">{label}</span>

      <div className="absolute inset-x-0 bottom-0 p-2">
        <p className="truncate text-body3 text-white">{card.albumName}</p>
        <p className="truncate text-body4 text-white/80">{card.versionName}</p>
        <div className="flex items-end justify-between gap-1">
          <span className="truncate text-body4 text-white">{card.memberName}</span>
          {extraCount > 0 && (
            <span className="shrink-0 text-body4 text-white">외 {extraCount}장</span>
          )}
        </div>
      </div>
    </div>
  );
}
