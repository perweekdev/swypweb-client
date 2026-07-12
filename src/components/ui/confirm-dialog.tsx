'use client';

import { Button } from '@components/ui/button';

/** 가운데 확인 다이얼로그 (취소 / 확인). description·confirmText로 문구 재사용. */
export function ConfirmDialog({
  open,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-8"
      role="dialog"
      aria-modal="true"
    >
      <button type="button" aria-label="닫기" className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-[320px] rounded-2xl bg-white px-5 py-6">
        <p className="text-center text-h3 text-secondary-900">{title}</p>
        {description && (
          <p className="mt-1.5 text-center text-body3 text-secondary-500">{description}</p>
        )}
        <div className="mt-5 flex gap-2">
          <Button variant="outline" size="lg" className="flex-1" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" size="lg" className="flex-1" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
