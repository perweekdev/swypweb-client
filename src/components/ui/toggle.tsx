'use client';

/** ON/OFF 스위치 토글 (ON = primary 보라, knob이 우측으로 슬라이드) */
export function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`inline-flex h-7 w-12 items-center rounded-full px-0.5 transition-colors ${
        checked ? 'bg-primary-900' : 'bg-secondary-100'
      }`}
    >
      {/* 계측: track 48×28, knob 24, ON 시 20px 슬라이드 */}
      <span
        className={`size-6 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
