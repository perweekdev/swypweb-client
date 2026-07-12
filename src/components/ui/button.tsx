import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'navy' | 'outline';
type Size = 'sm' | 'lg';

// primary: 보라 filled CTA / navy: 네이비 filled / outline: 외곽선 pill
const VARIANT: Record<Variant, string> = {
  primary: 'bg-primary-900 text-white disabled:bg-primary-300',
  navy: 'bg-secondary-900 text-white disabled:bg-secondary-300',
  outline:
    'border border-secondary-100 bg-transparent text-secondary-900 disabled:text-secondary-300',
};

// sm: 작은 액션 pill / lg: 하단 고정형 CTA (full width)
const SIZE: Record<Size, string> = {
  sm: 'rounded-full px-4 py-2 text-button2',
  lg: 'w-full rounded-xl py-3.5 text-button1',
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'lg',
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
