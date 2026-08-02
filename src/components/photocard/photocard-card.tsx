import Image from 'next/image';
import type { Photocard } from '@/types/photocard.types';

/** 이름 필드가 비어 있을 수 있다(홈 피드는 이미지 URL만 준다). */
export function cardLabel(card: Photocard): string {
  const label = [card.memberName, card.albumName, card.versionName].filter(Boolean).join(' ');
  return label || '포토카드';
}

/**
 * 포카 사진 자체 (뒤 박스 없음). 비율은 공통 토큰 `aspect-card`(61:98, 디자인 실측).
 * imageUrl이 있으면 실제 이미지, 없으면 색상 블록(에셋 전 placeholder).
 * 선택/삭제 카드(SelectableCard·DeletableCard)와 오버레이 카드의 베이스.
 */
export function PhotocardImage({
  card,
  className = 'aspect-card w-full',
}: {
  card: Photocard;
  className?: string;
}) {
  if (card.imageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        <Image
          src={card.imageUrl}
          alt={cardLabel(card)}
          fill
          sizes="(max-width: 420px) 20vw, 84px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-lg ${className}`}
      style={{ backgroundColor: card.color }}
      role="img"
      aria-label={cardLabel(card)}
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
      {card.imageUrl ? (
        <div className="relative aspect-card h-[86%] overflow-hidden rounded">
          <Image
            src={card.imageUrl}
            alt={cardLabel(card)}
            fill
            sizes="(max-width: 420px) 30vw, 110px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className="aspect-card h-[86%] rounded"
          style={{ backgroundColor: card.color }}
          role="img"
          aria-label={cardLabel(card)}
        />
      )}
    </div>
  );
}

/**
 * 포카 정보 — 표기 순서는 전 화면 공통으로 멤버명 → 앨범명 → 앨범 버전.
 *
 * 긴 이름 처리는 **화면마다 다르다**(디자인 지정).
 *  - `wrap` — 배경 박스가 있는 상세 카드(HOME-003·CHAT-003)는 **줄바꿈**해 전체를 보여준다.
 *  - 기본   — 채팅 상단 요약(CHAT-002)처럼 높이가 고정된 자리는 **말줄임**.
 *
 * 줄바꿈에는 `break-keep`(한국어를 단어 중간에서 끊지 않음)과
 * `break-words`(공백 없는 긴 영문 앨범명은 강제로 끊음)를 함께 건다.
 */
export function PhotocardMeta({ card, wrap = false }: { card: Photocard; wrap?: boolean }) {
  const overflow = wrap ? 'break-keep break-words' : 'truncate';

  return (
    <>
      <p className={`${overflow} text-body3 text-secondary-900`}>{card.memberName}</p>
      <p className={`${overflow} text-body2 text-secondary-900`}>{card.albumName}</p>
      <p className={`${overflow} text-body3 text-secondary-500`}>{card.versionName}</p>
    </>
  );
}

/** 포카 카드 = 사진 박스 + 정보 (3열 그리드용). 이름이 길면 줄바꿈된다(디자인 HOME-003). */
export function PhotocardCard({ card, className = '' }: { card: Photocard; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <PhotocardBox card={card} />
      <div className="mt-2">
        <PhotocardMeta card={card} wrap />
      </div>
    </div>
  );
}
