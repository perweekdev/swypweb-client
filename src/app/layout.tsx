import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import { QueryProvider } from '@components/providers/query-provider';
import './globals.css';

// 영문/숫자 폰트. 한글은 globals.css의 font-sans 스택에서 Pretendard로 폴백된다.
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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
