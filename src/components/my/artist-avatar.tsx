/** 아티스트 원형 아바타 (로고 에셋 전 placeholder: 색상 원 + 이니셜). selected 시 보라 링. */
export function ArtistAvatar({
  name,
  color,
  className = 'size-16',
  selected = false,
}: {
  name: string;
  color: string;
  className?: string;
  selected?: boolean;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full text-body1 text-white ${
        selected ? 'ring-2 ring-primary-900 ring-offset-2 ring-offset-background' : ''
      } ${className}`}
      style={{ backgroundColor: color }}
    >
      {name.charAt(0)}
    </span>
  );
}
