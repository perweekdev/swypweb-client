'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useEnterExit } from '@hooks/use-enter-exit';

/** 시트 슬라이드 길이. 아래 duration-200과 맞춘다. */
const TRANSITION_MS = 200;

/**
 * 하단에서 올라오는 BottomSheet.
 * 배경 딤 클릭 또는 Esc로 닫힌다. 프레임 폭(max 420)에 맞춰 가운데 정렬.
 *
 * 열고 닫을 때 **아래에서 올라오고 다시 내려간다**(디자인 요청).
 * 닫는 애니메이션을 보여주려면 닫힌 뒤에도 잠깐 DOM에 남아야 해서 `useEnterExit`으로
 * 마운트 시점을 늦춘다(`open`은 그대로 받는다 — 호출부는 바뀌지 않는다).
 */
export function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const { present, shown } = useEnterExit(open, TRANSITION_MS);

  if (!present) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="닫기"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full max-w-[420px] rounded-t-2xl bg-white px-5 pb-8 pt-3 transition-transform duration-200 ease-out ${
          shown ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* 핸들 계측: 61×5 gray-100 (EX-006 제안 확인 시트 · EX-003 액션 시트 공통) */}
        <div className="mx-auto mb-4 h-[5px] w-[61px] rounded-full bg-gray-100" />
        {children}
      </div>
    </div>
  );
}
