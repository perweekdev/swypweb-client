import type { ReactNode } from 'react';

/**
 * 가운데 정렬 빈 상태 (EX-001 관심 그룹 없음 / 교환 세트 없음).
 * 계측: 제목 text-h3 #000000, 설명 text-body2 gray-900, 액션은 8~16 아래.
 *
 * ⚠️ **안내 텍스트 위치는 전 화면 공통으로 "남은 영역의 세로 중앙"이다**(디자인 지정).
 * 그러려면 부모가 **flex 컬럼**이어야 `flex-1`이 먹는다. 일반 블록 div 안에 넣으면
 * 높이가 내용만큼만 잡혀 화면 상단에 붙어버린다(화면마다 위치가 달라 보이던 원인).
 *
 * `title` 없이 `description`만 줄 수도 있다 — EX-001 '교환 가능한 상대 0'처럼
 * 한 줄 안내만 있는 자리에 쓴다.
 */
export function EmptyState({
  title,
  description,
  action,
  className = '',
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center px-4 text-center ${className}`}
    >
      {title && <p className="text-h3 text-black">{title}</p>}
      {description && (
        <p className={`whitespace-pre-line text-body2 text-gray-900 ${title ? 'mt-2' : ''}`}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
