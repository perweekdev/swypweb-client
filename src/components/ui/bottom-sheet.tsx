'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * 하단에서 올라오는 BottomSheet.
 * 배경 딤 클릭 또는 Esc로 닫힌다. 프레임 폭(max 420)에 맞춰 가운데 정렬.
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[420px] rounded-t-2xl bg-white px-5 pb-8 pt-3">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-secondary-100" />
        {children}
      </div>
    </div>
  );
}
