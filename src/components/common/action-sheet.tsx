'use client';

/**
 * 하단 액션 시트 (btn-toast). 옵션 목록 카드.
 * 계측: bg secondary-10, 옵션 행 가운데 정렬 body1, 구분선. 파괴적 액션(삭제)은 red-900.
 */
type Action = {
  label: string;
  onClick: () => void;
  destructive?: boolean;
};

export function ActionSheet({
  open,
  onClose,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  actions: Action[];
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <ul className="relative z-10 m-4 w-full max-w-[412px] divide-y divide-secondary-50 overflow-hidden rounded-2xl bg-secondary-10">
        {actions.map((action) => (
          <li key={action.label}>
            <button
              type="button"
              onClick={() => {
                action.onClick();
                onClose();
              }}
              className={`w-full py-4 text-center text-body1 ${
                action.destructive ? 'text-red-900' : 'text-secondary-900'
              }`}
            >
              {action.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
