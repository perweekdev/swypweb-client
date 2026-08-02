import type { ReactNode } from 'react';
import { PlusIcon } from '@components/icons';

/**
 * 플로팅 CTA (FAB) — HOME-001 / EX-001 '교환 등록하기', COL-001 '편집하기'.
 * 계측: 높이 48 pill, primary-900, 우측 여백 16, 하단 탭바 위. (EX-001 147×48 / COL-001 116×48 — 폭은 내용에 따름)
 *
 * 프레임 폭(max-w-420)에 맞춘 fixed 컨테이너를 함께 제공한다.
 * `below`에 토스트 등을 주면 CTA 아래에 쌓이고, 그만큼 CTA가 위로 올라간다(EX-001/COL-001 토스트 동작).
 *
 * ⚠️ 간격은 `below`가 직접 갖는다(`mt-2` 등). 컨테이너에 `gap`을 두면 토스트가 감춰져
 * 아무것도 안 그려질 때도 그만큼 CTA가 떠버린다 — 토스트는 퇴장 애니메이션 때문에
 * 항상 넘어오고 자기가 알아서 `null`이 된다.
 */
export function FloatingCta({
  label,
  onClick,
  below,
  icon = <PlusIcon className="size-5" />,
}: {
  label: string;
  onClick?: () => void;
  below?: ReactNode;
  /** 라벨 왼쪽 아이콘 — 기본 ＋(등록), COL-001은 연필(편집) */
  icon?: ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[420px] flex-col items-end px-4 pb-[calc(64px_+_env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto inline-flex h-12 items-center gap-1 rounded-full bg-primary-900 px-5 text-button1 text-white shadow-lg"
      >
        {icon}
        {label}
      </button>
      {below && <div className="pointer-events-auto w-full">{below}</div>}
    </div>
  );
}
