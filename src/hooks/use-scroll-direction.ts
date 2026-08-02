'use client';

import { useEffect, useState } from 'react';

/** 관성 스크롤·주소창 노출로 방향이 계속 뒤집히지 않도록 두는 최소 이동량 */
const THRESHOLD_PX = 6;

export interface ScrollState {
  /** 마지막으로 감지한 방향이 위쪽인지 */
  up: boolean;
  /** `offset`보다 아래로 내려왔는지 */
  passed: boolean;
}

/**
 * 세로 스크롤 방향. 상단 바를 감췄다 되살리는 화면(HOME-001)에서 쓴다.
 *
 * `offset`은 "이만큼 내려오기 전에는 아직 지나지 않은 것으로 본다"는 기준이다.
 * 상단 바 높이를 넘겨 쓰면, 바가 화면에 아직 걸쳐 있는 동안 감추다가 빈 띠가 생기는 걸 막는다.
 *
 * 스크롤마다 setState를 하면 프레임마다 리렌더가 나므로, 값이 실제로 바뀔 때만 새 객체를
 * 만든다(같은 참조를 돌려주면 React가 리렌더를 건너뛴다).
 */
export function useScrollDirection(offset = 0): ScrollState {
  const [state, setState] = useState<ScrollState>({ up: true, passed: false });

  useEffect(() => {
    let last = window.scrollY;

    const apply = () => {
      const y = window.scrollY;
      const moved = y - last;

      // 방향은 임계값을 넘었을 때만 갱신한다. 그 사이에도 passed는 계속 반영한다.
      let direction: boolean | null = null;
      if (Math.abs(moved) >= THRESHOLD_PX) {
        direction = moved < 0;
        last = y;
      }

      setState((prev) => {
        const next: ScrollState = { up: direction ?? prev.up, passed: y > offset };
        return prev.up === next.up && prev.passed === next.passed ? prev : next;
      });
    };

    window.addEventListener('scroll', apply, { passive: true });
    apply();
    return () => window.removeEventListener('scroll', apply);
  }, [offset]);

  return state;
}
