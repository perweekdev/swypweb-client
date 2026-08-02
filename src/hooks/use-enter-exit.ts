'use client';

import { useEffect, useState } from 'react';

export interface EnterExit {
  /** DOM에 있어야 하는지 — 퇴장 애니메이션이 끝날 때까지 true */
  present: boolean;
  /** 최종(보이는) 상태인지 — 클래스 토글에 쓴다 */
  shown: boolean;
}

/**
 * 등장/퇴장 애니메이션 상태. 토스트·하단 시트가 공유한다.
 *
 * 호출부에서 `{open && <Sheet/>}`처럼 조건부로 렌더하면 닫는 순간 사라져
 * **퇴장 애니메이션이 재생될 틈이 없다.** 그래서 `open`은 prop으로 받고,
 * 실제 마운트 여부(`present`)는 여기서 붙잡고 있다가 늦춰서 푼다.
 *
 * `shown`을 한 프레임 뒤에 켜는 이유: 붙자마자 최종 상태를 주면 브라우저가
 * 시작 상태를 그린 적이 없어 전이 없이 결과만 나온다.
 */
export function useEnterExit(open: boolean, durationMs: number): EnterExit {
  const [present, setPresent] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      let reveal = 0;
      const mount = requestAnimationFrame(() => {
        setPresent(true);
        reveal = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(mount);
        cancelAnimationFrame(reveal);
      };
    }

    const hide = requestAnimationFrame(() => setShown(false));
    const remove = setTimeout(() => setPresent(false), durationMs);
    return () => {
      cancelAnimationFrame(hide);
      clearTimeout(remove);
    };
  }, [open, durationMs]);

  return { present, shown };
}
