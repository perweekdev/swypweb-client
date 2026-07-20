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
      className="fixed inset-0 z-50 flex items-center justify-center px-10"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      {/* 계측: 다이얼로그 폭 293(좌우 여백 41), 배경은 흰색이 아니라 background 토큰 */}
      <div className="relative z-10 w-full max-w-[295px] rounded-2xl bg-background px-5 py-6">
        <p className="whitespace-pre-line text-center text-h3 text-secondary-900">{title}</p>
        {description && (
          <p className="mt-1.5 text-center text-body3 text-secondary-500">{description}</p>
        )}
        {/* set-delete-popup 계측: 버튼은 pill(취소 outline / 확인 primary) */}
        <div className="mt-5 flex gap-2">
          <Button variant="outline" size="lg" shape="pill" className="flex-1" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" size="lg" shape="pill" className="flex-1" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
