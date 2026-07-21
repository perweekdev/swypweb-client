'use client';

import { useEffect, useRef } from 'react';

/**
 * 마우스 드래그(그랩)로 가로 스크롤. 데스크톱에서 스크롤바 없이 영역을 잡고 끌어 스크롤한다.
 * - 터치/펜은 네이티브 스와이프를 유지하도록 **마우스 포인터만** 처리한다.
 * - 3px 초과로 드래그하면 그 직후 클릭을 억제해 자식 버튼 오작동(예: 그룹 필터 오선택)을 막는다.
 * - move/up은 window에 붙여 커서가 영역 밖으로 나가도 드래그가 이어진다.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // 터치/펜은 네이티브 스크롤
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      el.scrollLeft = startLeft - dx;
    };

    const endDrag = () => {
      if (!down) return;
      down = false;
      el.style.cursor = 'grab';
      el.style.userSelect = '';
    };

    // 드래그 직후 발생하는 클릭만 억제 (자식 버튼 오선택 방지)
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    el.addEventListener('click', onClickCapture, true);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  return ref;
}
