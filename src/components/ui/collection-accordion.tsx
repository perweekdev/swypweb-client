'use client';

import { type ReactNode, useState } from 'react';
import { ChevronDownIcon } from '@components/icons';

/**
 * 앨범 아코디언 (collection-accordion). 헤더(제목 + 아래 셰브론) + 펼침 영역.
 * 계측: 헤더 48px, 제목 secondary-900, 셰브론 secondary-500(펼치면 회전).
 */
export function CollectionAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-body1 text-secondary-900">{title}</span>
        <ChevronDownIcon
          className={`size-5 text-secondary-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}
