import type { ReactNode } from 'react';

/**
 * 가운데 정렬 빈 상태 (EX-001 관심 그룹 없음 / 교환 세트 없음).
 * 계측: 제목 text-h3 #000000, 설명 text-body2 gray-900, 액션은 8~16 아래.
 * 남은 높이를 채우려면 부모가 flex 컬럼이어야 한다(`(tabs)/layout`의 main은 flex-1 컬럼).
 */
export function EmptyState({
  title,
  description,
  action,
  className = '',
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center px-4 text-center ${className}`}
    >
      <p className="text-h3 text-black">{title}</p>
      {description && (
        <p className="mt-2 whitespace-pre-line text-body2 text-gray-900">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
