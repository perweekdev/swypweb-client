import { ChevronRightIcon } from '@components/icons';

/** 우측 셰브론을 가진 메뉴 행 (정보 > 개인정보 처리방침 / 이용약관 등) */
export function ListRow({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between py-4 text-left"
    >
      <span className="text-body1 text-secondary-900">{label}</span>
      <ChevronRightIcon className="size-5 text-secondary-300" />
    </button>
  );
}
