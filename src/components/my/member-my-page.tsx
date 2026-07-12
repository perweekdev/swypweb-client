'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@store/auth-store';
import { Avatar } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Toggle } from '@components/ui/toggle';
import { ListRow } from '@components/ui/list-row';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { ChevronRightIcon, PlusIcon } from '@components/icons';
import { ROUTES } from '@constants/routes';
import { mockInterestGroups, mockUser } from '@/mocks/my';

/** MY-001 회원 마이페이지 */
export function MemberMyPage() {
  const logout = useAuthStore((s) => s.logout);
  const [chatAlarm, setChatAlarm] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <header className="px-5 pb-2 pt-4">
        <h1 className="text-h1 text-secondary-900">마이페이지</h1>
      </header>

      {/* 프로필 */}
      <div className="flex items-center gap-3 px-5 py-4">
        <Avatar className="size-14" />
        <span className="flex-1 text-h3 text-secondary-900">{mockUser.nickname}</span>
        <Link href={ROUTES.myProfile}>
          <Button variant="outline" size="sm">
            프로필 편집하기
          </Button>
        </Link>
      </div>

      {/* 관심 그룹 */}
      <section className="pt-3">
        <div className="flex items-center justify-between px-5">
          <h2 className="text-body1 text-secondary-900">관심 그룹</h2>
          <Link
            href={ROUTES.myGroups}
            className="flex items-center gap-0.5 text-body3 text-secondary-500"
          >
            편집하기
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>
        <ul className="flex gap-4 overflow-x-auto px-5 pb-1 pt-3">
          {mockInterestGroups.map((group) => (
            <li key={group.id} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <span
                className="flex size-16 items-center justify-center rounded-full text-body1 text-white"
                style={{ backgroundColor: group.color }}
              >
                {group.name.charAt(0)}
              </span>
              <span className="w-full truncate text-center text-body3 text-secondary-900">
                {group.name}
              </span>
            </li>
          ))}
          <li className="flex w-16 shrink-0 flex-col items-center gap-1.5">
            <Link
              href={ROUTES.myGroupsAdd}
              className="flex size-16 items-center justify-center rounded-full border border-dashed border-secondary-300 text-secondary-300"
              aria-label="관심 그룹 추가"
            >
              <PlusIcon className="size-6" />
            </Link>
            <span className="text-body3 text-secondary-500">추가하기</span>
          </li>
        </ul>
      </section>

      {/* 설정 */}
      <section className="px-5 pt-6">
        <h2 className="text-body2 text-secondary-500">설정</h2>
        <div className="flex items-center justify-between py-4">
          <span className="text-body1 text-secondary-900">채팅 알림</span>
          <Toggle checked={chatAlarm} onChange={setChatAlarm} ariaLabel="채팅 알림" />
        </div>
      </section>

      {/* 정보 */}
      <section className="px-5">
        <h2 className="text-body2 text-secondary-500">정보</h2>
        {/* TODO: 개인정보 처리방침 / 이용약관 화면 라우팅 */}
        <ListRow label="개인정보 처리방침" />
        <ListRow label="이용약관" />
      </section>

      {/* 로그아웃 / 회원탈퇴 */}
      <div className="mt-4 flex items-center justify-center gap-4 text-body3 text-secondary-300">
        <button type="button" onClick={() => setLogoutOpen(true)}>
          로그아웃
        </button>
        <span className="h-3 w-px bg-secondary-100" />
        {/* TODO: 회원탈퇴 플로우 */}
        <button type="button">회원탈퇴</button>
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
    </>
  );
}
