import type { ReactNode } from 'react';
import { ChevronRightIcon } from '@components/icons';

/**
 * 설정/메뉴 행 (setting). 라벨 + 우측 컨트롤.
 * - onClick만 주면 우측 셰브론(이동형 행)
 * - right에 토글 등 컨트롤을 주면 그대로 표시(비이동형 행)
 */
export function SettingRow({
  label,
  right,
  onClick,
}: {
  label: string;
  right?: ReactNode;
  onClick?: () => void;
}) {
  const showChevron = onClick && !right;
  const inner = (
    <>
      <span className="text-body1 text-secondary-900">{label}</span>
      {showChevron ? <ChevronRightIcon className="size-5 text-secondary-300" /> : right}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        {inner}
      </button>
    );
  }

  return <div className="flex items-center justify-between py-4">{inner}</div>;
}
