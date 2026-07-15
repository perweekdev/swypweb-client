import type { ReactNode } from 'react';

type IconProps = { className?: string };

// 공통 아웃라인 아이콘 래퍼 (currentColor 기반 → 부모 text 색상 상속)
function Icon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 9.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5" />
      <path d="M10 20v-4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20" />
    </Icon>
  );
}

export function CollectionIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M6 4a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a2 2 0 0 1-2-2V4Z" />
      <path d="M6 17.5h11" />
    </Icon>
  );
}

export function ExchangeIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 8.5h13l-3.2-3.2" />
      <path d="M20 15.5H7l3.2 3.2" />
    </Icon>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4V6a1 1 0 0 1 1-1Z" />
    </Icon>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="8" r="3.3" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </Icon>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m9 6 6 6-6 6" />
    </Icon>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m15 6-6 6 6 6" />
    </Icon>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

/** 선택 표시 (CHAT-004 포카 선택) */
export function CheckIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Icon>
  );
}

/** 닫기 / 입력 지우기 */
export function CloseIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

/** 교환 방향 표시 (CHAT-002 매치 정보의 두 포카 사이) */
export function SwapIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3 8.5h18l-4-4" />
      <path d="M21 15.5H3l4 4" />
    </Icon>
  );
}

/** 메시지 보내기 (종이비행기) */
export function SendIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M21 3 10.5 13.5" />
      <path d="M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" />
    </Icon>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.1" />
    </Icon>
  );
}
