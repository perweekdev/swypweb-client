import { UserIcon } from '@components/icons';

/**
 * 원형 아바타. 실제 이미지 에셋 연동 전 placeholder.
 * - color 있음: 프로필 사진을 등록한 사용자 → 색상 원으로 대체
 * - color 없음: 프로필 사진 미등록 → 기본 아바타(사람 아이콘)
 */
export function Avatar({ className = 'size-12', color }: { className?: string; color?: string }) {
  // TODO: 실제 아바타 이미지 연동 시 next/image 사용
  if (color) {
    return (
      <span
        className={`inline-block overflow-hidden rounded-full ${className}`}
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-secondary-50 text-secondary-300 ${className}`}
    >
      <UserIcon className="size-1/2" />
    </span>
  );
}
