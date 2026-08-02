'use client';

import { useEnterExit } from '@hooks/use-enter-exit';

/** 시트 슬라이드 길이. 아래 duration-200과 맞춘다(BottomSheet와 동일). */
const TRANSITION_MS = 200;

/**
 * 하단 액션 시트 (btn-toast). 옵션 카드 + 별도의 '닫기' 카드.
 * 열고 닫을 때 **아래에서 올라오고 다시 내려간다**(디자인 요청 · BottomSheet와 같은 동작).
 * 계측(EX-003 ⋮): 카드 폭 343(m-4) rounded-2xl bg secondary-10, 옵션 행 48·가운데 body1,
 * 구분선 secondary-50, 파괴적 액션(삭제) red-900, 닫기 카드는 16 아래 별도 카드(행 40).
 * 시트 자체는 background(#FDFDFE) 라운드 패널, 상단 핸들 61×5 gray-100.
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
  closeLabel = '닫기',
}: {
  open: boolean;
  onClose: () => void;
  actions: Action[];
  closeLabel?: string;
}) {
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
      {/* 계측: 딤 위에 background(#FDFDFE) 라운드 패널 → 그 안에 핸들 + 옵션 카드 + 닫기 카드 */}
      <div
        className={`relative z-10 w-full max-w-[420px] rounded-t-2xl bg-background px-4 pb-8 pt-3 transition-transform duration-200 ease-out ${
          shown ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto mb-4 h-[5px] w-[61px] rounded-full bg-gray-100" />
        <ul className="divide-y divide-secondary-50 overflow-hidden rounded-2xl bg-secondary-10">
          {actions.map((action) => (
            <li key={action.label}>
              <button
                type="button"
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className={`w-full py-3 text-center text-body1 ${
                  action.destructive ? 'text-red-900' : 'text-secondary-900'
                }`}
              >
                {action.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-secondary-10 py-2 text-center text-body1 text-secondary-900"
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
