'use client';

import type { ReactNode } from 'react';
import { AllChip } from '@components/ui/all-chip';
import { GroupLogo } from '@components/ui/group-logo';
import { useDragScroll } from '@hooks/use-drag-scroll';

/**
 * 아티스트 그룹 필터 (group-filter). 가로 스크롤: 추가하기 → 전체(ALL) → 아티스트 로고들.
 * 계측(HOME-001): 원 지름 ~48(md), 아이템 pitch 66(w-14 + gap-x-2.5). 각 항목은 로고 + 하단 라벨.
 * 선택된 아티스트는 GroupLogo selected(보라 링), 관심(추가) 그룹은 하트 배지. value=null이면 '전체'.
 *
 * `showAll`: HOME-001은 전체 아티스트 중에서 고르므로 '전체' 칩이 있고,
 * EX-001은 내 관심 그룹만 나열해 항상 한 그룹이 선택된 상태라 '전체' 칩이 없다(계측).
 */
type Group = {
  id: string;
  name: string;
  color?: string;
  logoUrl?: string | null;
  favorited?: boolean;
};

export function GroupFilter({
  groups,
  value,
  onChange,
  onAdd,
  addLabel = '관심그룹 추가하기',
  showAll = true,
  className = '',
}: {
  groups: Group[];
  value: string | null;
  onChange: (id: string | null) => void;
  onAdd?: () => void;
  /** 추가 버튼 라벨 — HOME-001 '관심그룹 추가하기' / EX-001 '추가하기'(계측) */
  addLabel?: string;
  showAll?: boolean;
  className?: string;
}) {
  const scrollRef = useDragScroll<HTMLDivElement>();

  // 관심 등록한 그룹(하트)을 앞쪽에 모은다. showAll이 아닐 때는 애초에 관심 그룹만 들어온다.
  const myGroups = showAll ? groups.filter((g) => g.favorited) : groups;
  const otherGroups = showAll ? groups.filter((g) => !g.favorited) : [];

  const item = (key: string, label: string, node: ReactNode, onClick?: () => void) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className="flex w-14 shrink-0 flex-col items-center gap-1.5"
    >
      {node}
      {/* break-keep: 한국어는 단어 중간에서 끊지 않는다 ('관심그룹 추가/하기' → '관심그룹/추가하기') */}
      <span className="line-clamp-2 w-full break-keep text-center text-body4 text-secondary-900">
        {label}
      </span>
    </button>
  );

  const renderGroup = (g: Group) =>
    item(
      g.id,
      g.name,
      <GroupLogo
        size="md"
        name={g.name}
        color={g.color}
        logoUrl={g.logoUrl}
        favorited={g.favorited}
        state={value === g.id ? 'selected' : 'default'}
      />,
      () => onChange(g.id)
    );

  return (
    <div ref={scrollRef} className={`flex gap-x-2.5 overflow-x-auto scrollbar-hide ${className}`}>
      {item('add', addLabel, <GroupLogo size="md" state="add" />, onAdd)}

      {/* 내 관심 그룹은 '추가하기' 바로 옆(구분선 왼쪽)에 모아 둔다 */}
      {myGroups.map(renderGroup)}

      {/* HOME-001은 '내 그룹'과 '전체 탐색' 사이에 세로 구분선이 있다(EX-001엔 없음).
          관심 그룹이 없으면(비회원·미설정) 나눌 것이 없으므로 그리지 않는다 — 디자인도 동일. */}
      {showAll && myGroups.length > 0 && (
        <span className="my-1.5 h-12 w-px shrink-0 self-start bg-secondary-50" />
      )}
      {showAll &&
        item(
          'all',
          '전체',
          <AllChip
            className={`size-12 ${value === null ? 'ring-2 ring-primary-900 ring-offset-2 ring-offset-background' : ''}`}
          />,
          () => onChange(null)
        )}
      {otherGroups.map(renderGroup)}
    </div>
  );
}
