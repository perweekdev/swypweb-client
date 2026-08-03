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

  // 기본 아바타는 원을 꽉 채우는 그림이다(profile.svg) — 배경색을 따로 두지 않는다.
  return (
    <span className={`inline-block overflow-hidden rounded-full ${className}`}>
      <ProfileIcon className="size-full" />
    </span>
  );
}
