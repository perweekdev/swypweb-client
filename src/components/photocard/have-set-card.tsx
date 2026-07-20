import type { Photocard } from '@/types/photocard.types';

/**
 * 오버레이형 교환 세트 카드 (have-set-info). 사진 위에 라벨·정보·'외 N장'을 얹는다.
 * 계측: 108×120, 좌상단 라벨(있어요/구해요), 하단 그라데이션 위 정보 + 우하단 '외 N장'.
 *
 * ⚠️ EX 도메인 화면(교환 세트)용. 화면 디자인 핸드오프 후 오버레이 정보 순서/색을 재확인한다.
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
      {/* TODO: imageUrl 제공 시 next/image로 교체 */}
      <div
        className="size-full"
        style={{ backgroundColor: card.color }}
        role="img"
        aria-label={`${card.memberName} ${card.albumName} ${card.versionName}`}
      />

      <span className="absolute left-2 top-2 text-body3 font-medium text-white">{label}</span>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
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
