import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * 디자인 시스템 버튼.
 * - 색(variant): primary(보라 CTA) / navy(네이비) / outline(외곽선)
 * - 형태(shape): cta(rounded-xl, 하단 고정형) / pill(rounded-full, 인라인 액션)
 * - 크기(size): lg / md / sm — 형태별로 높이 스케일이 다르다(계측)
 *
 * shape 미지정 시 size로 파생(lg→cta, 그 외→pill)해 기존 호출부와 호환된다.
 *
 * 계측 근거(docs/designed/component/atoms):
 *   btn-cta   big 56 / medium 41, primary-900, disabled primary-300
 *   btn-circled fill(navy) L43·M41·S38, disabled secondary-100 / outline border secondary-100
 */
type Variant = 'primary' | 'navy' | 'outline';
type Size = 'lg' | 'md' | 'sm';
type Shape = 'cta' | 'pill';

const COLOR: Record<Variant, string> = {
  primary: 'bg-primary-900 text-white disabled:bg-primary-300',
  navy: 'bg-secondary-900 text-white disabled:bg-secondary-100',
  outline:
    'border border-secondary-100 bg-transparent text-secondary-900 disabled:text-secondary-300',
};

const SHAPE: Record<Shape, string> = {
  cta: 'rounded-xl',
  pill: 'rounded-full',
};

// 형태별 높이/여백/타이포 (px는 계측값)
const SIZE: Record<Shape, Record<Size, string>> = {
  cta: {
    lg: 'h-14 w-full text-button1', // 56, 하단 고정 full-width
    md: 'h-[41px] px-6 text-button2',
    sm: 'h-[38px] px-5 text-button2',
  },
  pill: {
    lg: 'h-[43px] px-5 text-button2',
    md: 'h-[41px] px-4 text-button2',
    sm: 'h-[38px] px-4 text-button2',
  },
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'lg',
  shape,
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const resolvedShape: Shape = shape ?? (size === 'lg' ? 'cta' : 'pill');

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed ${COLOR[variant]} ${SHAPE[resolvedShape]} ${SIZE[resolvedShape][size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
