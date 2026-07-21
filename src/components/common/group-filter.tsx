'use client';

import type { ReactNode } from 'react';
import { AllChip } from '@components/ui/all-chip';
import { GroupLogo } from '@components/ui/group-logo';
import { useDragScroll } from '@hooks/use-drag-scroll';

/**
 * 아티스트 그룹 필터 (group-filter). 가로 스크롤: 추가하기 → 전체(ALL) → 아티스트 로고들.
 * 계측(HOME-001): 원 지름 ~48(md), 아이템 pitch 66(w-14 + gap-x-2.5). 각 항목은 로고 + 하단 라벨.
 * 선택된 아티스트는 GroupLogo selected(보라 링), 관심(추가) 그룹은 하트 배지. value=null이면 '전체'.
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
  const scrollRef = useDragScroll<HTMLDivElement>();

  const item = (key: string, label: string, node: ReactNode, onClick?: () => void) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className="flex w-14 shrink-0 flex-col items-center gap-1.5"
    >
      {node}
      <span className="line-clamp-2 w-full text-center text-body4 text-secondary-900">{label}</span>
    </button>
  );

  return (
    <div ref={scrollRef} className={`flex gap-x-2.5 overflow-x-auto scrollbar-hide ${className}`}>
      {item('add', '관심그룹 추가하기', <GroupLogo size="md" state="add" />, onAdd)}
      {item(
        'all',
        '전체',
        <AllChip
          className={`size-12 ${value === null ? 'ring-2 ring-primary-900 ring-offset-2 ring-offset-background' : ''}`}
        />,
        () => onChange(null)
      )}
      {groups.map((g) =>
        item(
          g.id,
          g.name,
          <GroupLogo
            size="md"
            name={g.name}
            color={g.color}
            favorited={g.favorited}
            state={value === g.id ? 'selected' : 'default'}
          />,
          () => onChange(g.id)
        )
      )}
    </div>
  );
}
