'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { TabHeader } from '@components/layout/tab-header';
import { useScrollDirection } from '@hooks/use-scroll-direction';

/**
 * HOME-001 상단 바 (로고 + 그룹 필터).
 *
 * 스크롤 동작(디자인 `HOME-001-scroll.png`):
 *  - 바를 지나기 전 → 로고 + 필터 둘 다
 *  - 내려갈 때      → 둘 다 감춘다 (피드에 화면을 다 내준다)
 *  - 올라갈 때      → **필터만** 다시 올라온다 (그룹을 바꾸려고 올리는 동작이므로)
 *
 * 로고와 필터를 **한 덩어리(sticky)** 로 묶고 통째로 위로 밀어 구현한다.
 * 각각 따로 sticky를 걸면 둘 다 top:0을 잡아 겹친다.
 *  - 0                 : 전체 노출
 *  - -(로고 높이 - 4)  : 로고만 화면 밖 → 필터가 상단에서 8 떨어져 붙는다
 *  - -바 높이          : 전체 감춤
 *
 * 높이는 폰트·안전영역에 따라 달라져 **측정해서** 쓴다(하드코딩하면 필터 위치가 어긋난다).
 * 바 전체를 지나기 전에는 감추지 않는다 — 그 구간에서 감추면 원래 자리에 빈 띠가 남는다.
 */

/**
 * 필터만 남았을 때 원 위쪽에 두는 여백. 디자인 실측값(`HOME-001-scroll.png`에서 잉크가 y=8에서 시작).
 * 필터 블록이 자체 상단 여백(`pt-1` = 4)을 갖고 있어 그중 4는 이미 채워진다 → 나머지만 덜 민다.
 */
const FILTER_ONLY_TOP_GAP = 8;
const FILTER_BLOCK_TOP_PADDING = 4;
export function HomeTopBar({ children }: { children: ReactNode }) {
  const barRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ header: 0, bar: 0 });

  useEffect(() => {
    const bar = barRef.current;
    const header = headerRef.current;
    if (!bar || !header) return;

    const measure = () =>
      setSize((prev) => {
        const next = { header: header.offsetHeight, bar: bar.offsetHeight };
        return prev.header === next.header && prev.bar === next.bar ? prev : next;
      });

    // 폰트 적용·화면 회전 등으로 높이가 바뀌면 다시 잰다.
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const { up, passed } = useScrollDirection(size.bar);
  const filterOnlyShift = size.header - (FILTER_ONLY_TOP_GAP - FILTER_BLOCK_TOP_PADDING);
  const shift = !passed ? 0 : up ? filterOnlyShift : size.bar;

  return (
    <div
      ref={barRef}
      className="sticky top-0 z-20 bg-background transition-transform duration-200 ease-out"
      style={{ transform: `translateY(-${shift}px)` }}
    >
      <div ref={headerRef}>
        <TabHeader title="포카매치" logo sticky={false} />
      </div>
      {children}
    </div>
  );
}
