import { CloseIcon } from '@components/icons';
import { PhotocardImage } from '@components/photocard/photocard-card';
import type { Photocard } from '@/types/photocard.types';

/**
 * 삭제 가능한 포카 (card-set-deleting-card). 세로 사진 우상단에 어두운 원 X.
 * 교환 세트 등록/수정 그리드에서 선택된 포카를 뺄 때 사용.
 */
export function DeletableCard({
  card,
  onDelete,
  className = '',
}: {
  card: Photocard;
  onDelete?: () => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <PhotocardImage card={card} className="aspect-[55/85] w-full" />
      <button
        type="button"
        aria-label="삭제"
        onClick={onDelete}
        className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-gray-700 text-white"
      >
        <CloseIcon className="size-3" />
      </button>
    </div>
  );
}
