/**
 * '전체(ALL)' 필터 칩 (image-all).
 * 계측: primary-50 채운 원 + secondary-100 테두리 + 검정 'ALL'.
 * 그룹 필터에서 아티스트 로고들과 같은 크기로 나란히 놓인다.
 */
export function AllChip({ className = 'size-16' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-secondary-100 bg-primary-50 text-button2 font-semibold text-black ${className}`}
    >
      ALL
    </span>
  );
}
