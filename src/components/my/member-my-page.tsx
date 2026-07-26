'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyProfile } from '@hooks/use-my-profile';
import { isApiError } from '@lib/api-error';
import { withdraw } from '@lib/api/users';
import { useAuthStore } from '@store/auth-store';
import { Toggle } from '@components/ui/toggle';
import { SettingRow } from '@components/ui/setting-row';
import { GroupLogo } from '@components/ui/group-logo';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { UserProfile } from '@components/common/user-profile';
import { TabHeader } from '@components/layout/tab-header';
import { useDragScroll } from '@hooks/use-drag-scroll';
import { ChevronRightIcon } from '@components/icons';
import { ROUTES } from '@constants/routes';
import { useInterestGroups } from '@hooks/use-groups';

/** MY-001 회원 마이페이지 */
export function MemberMyPage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const storedNickname = useAuthStore((s) => s.nickname);
  const { data: profile } = useMyProfile();
  const { data: interestGroups } = useInterestGroups();
  // 조회 실패·로딩 중에는 세션에 남은 닉네임으로 degrade한다(화면을 비우지 않는다).
  const nickname = profile?.nickname ?? storedNickname ?? '';
  const [chatAlarm, setChatAlarm] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const groupScrollRef = useDragScroll<HTMLUListElement>();

  const confirmWithdraw = async () => {
    setWithdrawOpen(false);
    setWithdrawError(null);

    try {
      await withdraw();
    } catch (caught) {
      // 이미 탈퇴한 계정(409)은 목적이 이미 달성된 상태이므로 정상 종료로 본다.
      const alreadyWithdrawn = isApiError(caught) && caught.status === 409;
      if (!alreadyWithdrawn) {
        setWithdrawError(
          isApiError(caught) ? caught.message : '탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.'
        );
        return;
      }
    }

    // ⚠️ 서버가 토큰을 무효화하지 않는다(최대 1시간 유효) → 즉시 로컬 토큰을 폐기한다.
    logout();
    router.replace(ROUTES.home);
  };

  return (
    <>
      <TabHeader title="마이페이지" />

      {/* 프로필 */}
      <UserProfile
        name={nickname}
        avatarUrl={profile?.profileImageUrl}
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
        <ul
          ref={groupScrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-1 pt-3"
        >
          {/* '추가하기'가 가장 왼쪽 — 등록한 그룹은 그 오른쪽에 차례로 온다(디자인) */}
          <li className="flex w-16 shrink-0 flex-col items-center gap-1.5">
            <Link href={ROUTES.myGroupsAdd} aria-label="관심 그룹 추가">
              <GroupLogo size="lg" state="add" />
            </Link>
            <span className="text-body3 text-secondary-500">추가하기</span>
          </li>
          {interestGroups?.map((group) => (
            <li key={group.id} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <GroupLogo size="lg" name={group.name} color={group.color} logoUrl={group.logoUrl} />
              <span className="w-full truncate text-center text-body3 text-secondary-900">
                {group.name}
              </span>
            </li>
          ))}
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
        <SettingRow label="개인정보 처리방침" onClick={() => router.push(ROUTES.privacy)} />
        <SettingRow label="이용약관" onClick={() => router.push(ROUTES.terms)} />
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
      {withdrawError && (
        <p className="mt-2 px-4 text-center text-body3 text-red-900">{withdrawError}</p>
      )}

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
        onConfirm={confirmWithdraw}
      />
    </>
  );
}
