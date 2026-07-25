import Image from 'next/image';
import { ProfileIcon } from '@components/icons';

/**
 * 원형 아바타.
 * - src 있음: 실제 프로필 이미지(S3 URL 또는 로컬 미리보기 blob)
 * - color 있음: 색상 원 (상대 프로필 placeholder)
 * - 둘 다 없음: 기본 아바타(image-profile: secondary-50 원 + secondary-500 실루엣)
 */
export function Avatar({
  className = 'size-12',
  color,
  src,
  alt = '',
}: {
  className?: string;
  color?: string;
  src?: string | null;
  alt?: string;
}) {
  if (src) {
    return (
      <span className={`relative inline-block overflow-hidden rounded-full ${className}`}>
        {/* blob(로컬 미리보기)은 최적화 대상이 아니므로 우회한다 */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="96px"
          className="object-cover"
          unoptimized={src.startsWith('blob:')}
        />
      </span>
    );
  }

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
      className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-secondary-50 text-secondary-500 ${className}`}
    >
      <ProfileIcon className="size-full" />
    </span>
  );
}
