/**
 * 진행 바 (progress). 상단 라벨 + 현재/최대 수, 하단 트랙.
 * 계측: 트랙 bg secondary-50, 채움 primary-900. 현재값 primary-900 / 최대값 secondary-300.
 * 예: 컬렉션 보유 수(9/200).
 */
export function ProgressBar({
  label,
  value,
  max,
  className = '',
}: {
  label?: string;
  value: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        {label && <span className="text-body2 text-secondary-900">{label}</span>}
        <span className="ml-auto text-body2">
          <span className="text-primary-900">{value}</span>
          <span className="text-secondary-300">/{max}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary-50">
        <div className="h-full rounded-full bg-primary-900" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
