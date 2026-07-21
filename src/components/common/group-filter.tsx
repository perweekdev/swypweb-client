import type { ReactNode } from 'react';
import { AllChip } from '@components/ui/all-chip';
import { GroupLogo } from '@components/ui/group-logo';

/**
 * 아티스트 그룹 필터 (group-filter). 전체(ALL) + 아티스트 로고들 + 추가하기.
 * 각 항목은 로고 + 하단 라벨. 선택된 아티스트는 GroupLogo selected(보라 링).
 * value=null이면 '전체' 선택.
 *
 * ⚠️ HOME/COL/EX 도메인용. 화면 핸드오프 후 연결.
 */
type Group = { id: string; name: string; color?: string; favorited?: boolean };

export function GroupFilter({
  groups,
  value,
  onChange,
  onAdd,
  className = '',
}: {
  groups: Group[];
  value: string | null;
  onChange: (id: string | null) => void;
  onAdd?: () => void;
  className?: string;
}) {
  const item = (key: string, label: string, node: ReactNode, onClick?: () => void) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className="flex w-16 shrink-0 flex-col items-center gap-1.5"
    >
      {node}
      <span className="w-full truncate text-center text-body3 text-secondary-900">{label}</span>
    </button>
  );

  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-4 ${className}`}>
      {item('all', '전체', <AllChip className="size-16" />, () => onChange(null))}
      {groups.map((g) =>
        item(
          g.id,
          g.name,
          <GroupLogo
            size="lg"
            name={g.name}
            color={g.color}
            favorited={g.favorited}
            state={value === g.id ? 'selected' : 'default'}
          />,
          () => onChange(g.id)
        )
      )}
      {item('add', '추가하기', <GroupLogo size="lg" state="add" />, onAdd)}
    </div>
  );
}
