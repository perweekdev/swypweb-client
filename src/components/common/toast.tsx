'use client';

import { CheckIcon } from '@components/icons';
import { useEnterExit } from '@hooks/use-enter-exit';

/** 등장/퇴장 길이. 아래 duration-200과 맞춘다. */
const TRANSITION_MS = 200;

/**
 * 성공/안내 토스트 (set-add-success).
 * 계측: bg gray-900, 흰 글자 body2 + 좌측 체크. 하단에 잠깐 떴다 사라지는 바.
 *
 * **아래에서 위로 올라왔다가 다시 내려가며 사라진다**(디자인 요청).
 * 그래서 호출부에서 `{flag && <Toast/>}`로 껐다 켜지 말고 **`open`으로 넘긴다** —
 * 즉시 언마운트되면 퇴장 애니메이션이 재생될 틈이 없다.
 *
 * 감춰진 동안에는 `null`을 반환해 자리를 차지하지 않는다(FAB이 밀려 올라가지 않는다).
 * 노출 시간(자동 사라짐)은 지금처럼 화면에서 제어한다.
 */
export function Toast({
  message,
  open = true,
  className = '',
}: {
  message: string;
  open?: boolean;
  className?: string;
}) {
  const { present, shown } = useEnterExit(open, TRANSITION_MS);

  if (!present) return null;

  return (
    <div
      role="status"
      className={`flex w-full items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-body2 text-white transition-[transform,opacity] duration-200 ease-out ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      } ${className}`}
    >
      <CheckIcon className="size-4 shrink-0" />
      {message}
    </div>
  );
}
