import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import { AuthProvider } from '@components/providers/auth-provider';
import { QueryProvider } from '@components/providers/query-provider';
import './globals.css';

/**
 * 영문/숫자 폰트. 한글은 globals.css의 `--font-sans` 스택에서 Pretendard가 받는다.
 *
 * ⚠️ next/font는 `Plus Jakarta Sans Fallback`(= `local(Arial)` + size-adjust)을 만들어
 * `--font-jakarta`에 **함께** 넣는다. 이 폴백 페이스에는 `unicode-range`가 없어 한글까지 잡아버려,
 * 변수를 그대로 쓰면 한글이 Pretendard에 닿지 못하고 Arial로 렌더된다.
 * `adjustFontFallback: false`로 끄려 했으나 **Turbopack은 이 옵션을 무시한다**(빌드 산출 CSS로 실측).
 * → 실제 차단은 globals.css에서 **폴백을 뺀 실제 패밀리명을 직접 참조**해 한다.
 */
const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '포카매치',
  description: '직교환과 다중교환을 지원하는 아이돌 포토카드 교환 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
