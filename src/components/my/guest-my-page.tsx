'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { SettingRow } from '@components/ui/setting-row';
import { TabHeader } from '@components/layout/tab-header';
import { InterestGroupSection } from '@components/my/interest-group-section';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';
import { ROUTES } from '@constants/routes';

/**
 * MY-004 비회원 마이페이지.
 *
 * 로그인해야 쓸 수 있는 기능도 **숨기지 않고 그대로 노출**한다(디자인 MY-001-guest).
 * 무엇을 할 수 있는 서비스인지 보여주고, 누를 때 로그인을 유도한다.
 */
export function GuestMyPage() {
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const requireLogin = () => setLoginOpen(true);

  return (
    <>
      <TabHeader title="마이페이지" />

      <div className="flex items-center justify-between px-4 py-4">
        <p className="text-body1 text-secondary-900">로그인을 해주세요.</p>
        <Button variant="navy" size="sm" onClick={requireLogin}>
          로그인하기
        </Button>
      </div>

      <div className="mx-4 border-b border-secondary-50" />

      {/* 회원 화면과 같은 섹션. 등록한 그룹이 없으니 '추가하기'만 보이고, 누르면 로그인 시트 */}
      <InterestGroupSection add={{ onClick: requireLogin }} edit={{ onClick: requireLogin }} />

      <div className="mx-4 mt-6 border-b border-secondary-50" />

      <section className="px-4 pt-5">
        <h2 className="text-body2 text-secondary-500">정보</h2>
        <SettingRow label="개인정보 처리방침" onClick={() => router.push(ROUTES.privacy)} />
        <SettingRow label="이용약관" onClick={() => router.push(ROUTES.terms)} />
      </section>

      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
