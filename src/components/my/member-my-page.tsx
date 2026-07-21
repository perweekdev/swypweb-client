'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@store/auth-store';
import { Toggle } from '@components/ui/toggle';
import { SettingRow } from '@components/ui/setting-row';
import { GroupLogo } from '@components/ui/group-logo';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { UserProfile } from '@components/common/user-profile';
import { ChevronRightIcon } from '@components/icons';
import { ROUTES } from '@constants/routes';
import { mockInterestGroups, mockUser } from '@/mocks/my';

/** MY-001 회원 마이페이지 */
export function MemberMyPage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [chatAlarm, setChatAlarm] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <>
      <header className="px-4 pb-2 pt-4">
        <h1 className="text-h1 text-secondary-900">마이페이지</h1>
      </header>

      {/* 프로필 */}
      <UserProfile
        name={mockUser.nickname}
        variant="editable"
        onAction={() => router.push(ROUTES.myProfile)}
        className="px-4 py-4"
      />

      {/* 관심 그룹 */}
      <section className="pt-3">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-body1 text-secondary-900">관심 그룹</h2>
          <Link
            href={ROUTES.myGroups}
            className="flex items-center gap-0.5 text-body3 text-secondary-500"
          >
            편집하기
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>
        <ul className="flex gap-4 overflow-x-auto px-4 pb-1 pt-3">
          {mockInterestGroups.map((group) => (
            <li key={group.id} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <GroupLogo size="lg" name={group.name} color={group.color} />
              <span className="w-full truncate text-center text-body3 text-secondary-900">
                {group.name}
              </span>
            </li>
          ))}
          <li className="flex w-16 shrink-0 flex-col items-center gap-1.5">
            <Link href={ROUTES.myGroupsAdd} aria-label="관심 그룹 추가">
              <GroupLogo size="lg" state="add" />
            </Link>
            <span className="text-body3 text-secondary-500">추가하기</span>
          </li>
        </ul>
      </section>

      {/* 설정 */}
      <section className="px-4 pt-6">
        <h2 className="text-body2 text-secondary-500">설정</h2>
        <SettingRow
          label="채팅 알림"
          right={<Toggle checked={chatAlarm} onChange={setChatAlarm} ariaLabel="채팅 알림" />}
        />
      </section>

      {/* 정보 */}
      <section className="px-4">
        <h2 className="text-body2 text-secondary-500">정보</h2>
        {/* TODO: 개인정보 처리방침 / 이용약관 화면 라우팅 */}
        <SettingRow label="개인정보 처리방침" onClick={() => {}} />
        <SettingRow label="이용약관" onClick={() => {}} />
      </section>

      {/* 로그아웃 / 회원탈퇴 */}
      <div className="mt-4 flex items-center justify-center gap-4 text-body3 text-secondary-300">
        <button type="button" onClick={() => setLogoutOpen(true)}>
          로그아웃
        </button>
        <span className="h-3 w-px bg-secondary-100" />
        <button type="button" onClick={() => setWithdrawOpen(true)}>
          회원탈퇴
        </button>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title="로그아웃 할까요?"
        confirmText="로그아웃"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          logout();
        }}
      />

      <ConfirmDialog
        open={withdrawOpen}
        title="정말 탈퇴하실 건가요?"
        confirmText="탈퇴"
        onCancel={() => setWithdrawOpen(false)}
        onConfirm={() => {
          // TODO: 실제 회원탈퇴 API 연동 (현재는 로그아웃 처리)
          setWithdrawOpen(false);
          logout();
        }}
      />
    </>
  );
}
