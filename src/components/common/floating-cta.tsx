import type { ReactNode } from 'react';
import { PlusIcon } from '@components/icons';

/**
 * 플로팅 CTA (FAB) — HOME-001 / EX-001 우하단 '교환 등록하기'.
 * 계측(EX-001): 147×48 pill, primary-900, 우측 여백 16, 하단 탭바 위.
 *
 * 프레임 폭(max-w-420)에 맞춘 fixed 컨테이너를 함께 제공한다.
 * `below`에 토스트 등을 주면 CTA 아래에 쌓이고, 그만큼 CTA가 위로 올라간다(EX-001 등록 토스트 동작).
 */
export function FloatingCta({
  label,
  onClick,
  below,
}: {
  label: string;
  onClick?: () => void;
  below?: ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[420px] flex-col items-end gap-2 px-4 pb-[calc(64px_+_env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto inline-flex h-12 items-center gap-1 rounded-full bg-primary-900 px-5 text-button1 text-white shadow-lg"
      >
        <PlusIcon className="size-5" />
        {label}
      </button>
      {below && <div className="pointer-events-auto w-full">{below}</div>}
    </div>
  );
}
