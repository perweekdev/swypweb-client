'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { GroupLogo } from '@components/ui/group-logo';
import { ChevronRightIcon } from '@components/icons';
import { useDragScroll } from '@hooks/use-drag-scroll';
import type { InterestGroup } from '@/types/my.types';

/**
 * 마이페이지 관심 그룹 섹션 (MY-001).
 *
 * **회원·비회원이 같은 화면을 쓴다.** 비회원에게도 숨기지 않고 그대로 노출하되(디자인 MY-001-guest),
 * 누르면 로그인 시트를 띄운다. 두 화면이 어긋나지 않도록 마크업을 여기 한 곳에 둔다.
 *
 * 이동 방식이 달라 `href`(회원 라우팅)와 `onClick`(비회원 로그인 유도)을 둘 다 받는다.
 * href가 있으면 `Link`로, 없으면 `button`으로 렌더한다.
 */
type Action = { href?: string; onClick?: () => void };

function ActionArea({
  action,
  className,
  ariaLabel,
  children,
}: {
  action: Action;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return action.href ? (
    <Link href={action.href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={action.onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function InterestGroupSection({
  groups,
  add,
  edit,
}: {
  /** 비회원·로딩 중에는 비어 있다 — '추가하기'만 보인다 */
  groups?: InterestGroup[];
  add: Action;
  edit: Action;
}) {
  const scrollRef = useDragScroll<HTMLUListElement>();

  return (
    // 계측(MY-001): 구분선 → 제목 17, 라벨 아래 여백은 다음 구분선까지 32
    <section className="pt-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-body1 text-secondary-900">관심 그룹</h2>
        <ActionArea
          action={edit}
          className="flex items-center gap-0.5 text-body3 text-secondary-500"
        >
          편집하기
          <ChevronRightIcon className="size-4" />
        </ActionArea>
      </div>

      <ul ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-1 pt-3">
        {/* '추가하기'가 가장 왼쪽 — 등록한 그룹은 그 오른쪽에 차례로 온다(디자인) */}
        <li className="flex w-16 shrink-0 flex-col items-center gap-1.5">
          <ActionArea action={add} ariaLabel="관심 그룹 추가">
            <GroupLogo size="lg" state="add" />
          </ActionArea>
          {/* 계측: 그룹 이름과 같은 secondary-900. 회색이 아니다 */}
          <span className="text-body3 text-secondary-900">추가하기</span>
        </li>
        {groups?.map((group) => (
          <li key={group.id} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
            <GroupLogo size="lg" name={group.name} color={group.color} logoUrl={group.logoUrl} />
            <span className="w-full truncate text-center text-body3 text-secondary-900">
              {group.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
