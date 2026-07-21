import { CheckIcon } from '@components/icons';

/**
 * 성공/안내 토스트 (set-add-success).
 * 계측: bg gray-900, 흰 글자 body2 + 좌측 체크. 하단에 잠깐 떴다 사라지는 바.
 * 노출/자동 사라짐은 화면(또는 훅)에서 제어 — 여기선 표현만.
 */
export function Toast({ message, className = '' }: { message: string; className?: string }) {
  return (
    <div
      className={`flex w-full items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-body2 text-white ${className}`}
    >
      <CheckIcon className="size-4 shrink-0" />
      {message}
    </div>
  );
}
