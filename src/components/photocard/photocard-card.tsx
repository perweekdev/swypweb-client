import type { Photocard } from '@/types/photocard.types';

/**
 * 포카 사진 박스 — 스토리보드 공통 "포카 사진 뒤에 박스로 배경 표시".
 * 이미지 에셋 제공 전이라 포카 비율(55:85) 색상 블록으로 대체한다.
 */
export function PhotocardBox({ card, className = '' }: { card: Photocard; className?: string }) {
  return (
    <div
      className={`flex aspect-square items-center justify-center rounded-xl bg-secondary-10 p-2 ${className}`}
    >
      {/* TODO: imageUrl 제공 시 next/image로 교체 */}
      <div
        className="aspect-[55/85] h-full rounded-md"
        style={{ backgroundColor: card.color }}
        role="img"
        aria-label={`${card.memberName} ${card.albumName} ${card.versionName}`}
      />
    </div>
  );
}

/**
 * 포카 카드 = 사진 박스 + 정보.
 * 정보 표기 순서는 전 화면 공통으로 멤버명 → 앨범명 → 앨범 버전.
 */
export function PhotocardCard({ card, className = '' }: { card: Photocard; className?: string }) {
  return (
    <div className={className}>
      <PhotocardBox card={card} />
      <p className="mt-2 truncate text-body3 text-secondary-900">{card.memberName}</p>
      <p className="truncate text-body2 text-secondary-900">{card.albumName}</p>
      <p className="truncate text-body3 text-secondary-300">{card.versionName}</p>
    </div>
  );
}
