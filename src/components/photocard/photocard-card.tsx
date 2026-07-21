import type { Photocard } from '@/types/photocard.types';

/**
 * 포카 사진 자체 (뒤 박스 없음). 세로 비율 55:85, 이미지 에셋 전 색상 블록.
 * 선택/삭제 카드(SelectableCard·DeletableCard)와 오버레이 카드의 베이스.
 * 기본은 셀 너비를 채우는 55:85. className으로 고정 크기 지정 가능.
 */
export function PhotocardImage({
  card,
  className = 'aspect-[55/85] w-full',
}: {
  card: Photocard;
  className?: string;
}) {
  return (
    // TODO: imageUrl 제공 시 next/image로 교체
    <div
      className={`overflow-hidden rounded-lg ${className}`}
      style={{ backgroundColor: card.color }}
      role="img"
      aria-label={`${card.memberName} ${card.albumName} ${card.versionName}`}
    />
  );
}

/**
 * 포카 사진 박스 — 스토리보드 공통 "포카 사진 뒤에 박스로 배경 표시".
 * 이미지 에셋 제공 전이라 포카 비율(55:85) 색상 블록으로 대체한다.
 * 계측(CHAT-003): 박스 110×129, 안쪽 사진 높이 = 박스의 86%.
 */
export function PhotocardBox({ card, className = '' }: { card: Photocard; className?: string }) {
  return (
    <div
      className={`flex aspect-[110/129] items-center justify-center rounded-2xl bg-secondary-10 ${className}`}
    >
      {/* TODO: imageUrl 제공 시 next/image로 교체 */}
      <div
        className="aspect-[55/85] h-[86%] rounded"
        style={{ backgroundColor: card.color }}
        role="img"
        aria-label={`${card.memberName} ${card.albumName} ${card.versionName}`}
      />
    </div>
  );
}

/**
 * 포카 정보 — 표기 순서는 전 화면 공통으로 멤버명 → 앨범명 → 앨범 버전.
 * CHAT-002 매치 정보와 CHAT-003/004 카드가 같은 스타일을 쓴다(계측 확인).
 */
export function PhotocardMeta({ card }: { card: Photocard }) {
  return (
    <>
      <p className="truncate text-body3 text-secondary-900">{card.memberName}</p>
      <p className="truncate text-body2 text-secondary-900">{card.albumName}</p>
      <p className="truncate text-body3 text-secondary-500">{card.versionName}</p>
    </>
  );
}

/** 포카 카드 = 사진 박스 + 정보 (3열 그리드용) */
export function PhotocardCard({ card, className = '' }: { card: Photocard; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <PhotocardBox card={card} />
      <div className="mt-2">
        <PhotocardMeta card={card} />
      </div>
    </div>
  );
}
