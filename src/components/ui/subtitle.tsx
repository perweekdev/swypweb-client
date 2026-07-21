import type { ReactNode } from 'react';

/** 섹션 소제목 (subtitle). 계측: text-h3(16 medium) secondary-900. */
export function Subtitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={`text-h3 text-secondary-900 ${className}`}>{children}</h2>;
}
