/**
 * '전체(ALL)' 필터 칩 (image-all).
 * 계측: primary-50 채운 원 + 검정 'ALL'. 그룹 필터에서 아티스트 로고들과 같은 크기로 나란히 놓인다.
 *
 * **테두리는 없다.** 예전에 secondary-100 테두리를 뒀는데 디자인에 없는 것으로 확인됐다.
 * 선택 표시(보라 링)는 그 테두리가 있던 자리, 즉 원 가장자리에 바로 붙는다(`GroupFilter`).
 */
export function AllChip({ className = 'size-16' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-primary-50 text-button2 font-semibold text-black ${className}`}
    >
      ALL
    </span>
  );
}
