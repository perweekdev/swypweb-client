'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { SettingRow } from '@components/ui/setting-row';
import { TabHeader } from '@components/layout/tab-header';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';
import { ROUTES } from '@constants/routes';

/** MY-004 비회원 마이페이지 */
export function GuestMyPage() {
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <TabHeader title="마이페이지" />

      <div className="flex items-center justify-between px-4 py-4">
        <p className="text-body1 text-secondary-900">로그인을 해주세요.</p>
        <Button variant="navy" size="sm" onClick={() => setLoginOpen(true)}>
          로그인하기
        </Button>
      </div>

      <div className="mx-4 border-b border-secondary-50" />

      <section className="px-4 pt-5">
        <h2 className="text-body2 text-secondary-500">정보</h2>
        <SettingRow label="개인정보 처리방침" onClick={() => router.push(ROUTES.privacy)} />
        <SettingRow label="이용약관" onClick={() => router.push(ROUTES.terms)} />
      </section>

      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
