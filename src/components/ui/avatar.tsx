import { UserIcon } from '@components/icons';

/** 원형 아바타. 실제 이미지 에셋 연동 전에는 중립 placeholder 표시. */
export function Avatar({ className = 'size-12' }: { className?: string }) {
  // TODO: 실제 아바타 이미지 연동 시 next/image 사용
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-secondary-50 text-secondary-300 ${className}`}
    >
      <UserIcon className="size-1/2" />
    </span>
  );
}
