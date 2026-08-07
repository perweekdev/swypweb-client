'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyProfile } from '@hooks/use-my-profile';
import { isApiError } from '@lib/api-error';
import { logout as requestLogout } from '@lib/api/auth';
import { withdraw } from '@lib/api/users';
import { useAuthStore } from '@store/auth-store';
import { Toggle } from '@components/ui/toggle';
import { SettingRow } from '@components/ui/setting-row';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { UserProfile } from '@components/common/user-profile';
import { InterestGroupSection } from '@components/my/interest-group-section';
import { TabHeader } from '@components/layout/tab-header';
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

  /**
   * 서버 세션 정리 + 로컬 토큰 폐기.
   *
   * 서버 호출이 실패해도 **로컬 삭제는 반드시 진행한다.** 네트워크 문제로 로그아웃이 막히면
   * 사용자가 빠져나갈 방법이 없다. 서버는 쿠키가 없어도 200을 주므로 응답으로 분기할 것도 없다(§2.4).
   */
  const clearSession = async () => {
    try {
      await requestLogout();
    } catch {
      /* 서버 폐기 실패는 무시한다 — 아래 로컬 삭제가 사용자 입장에서의 로그아웃이다 */
    }
    logout();
  };

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

    // ⚠️ 탈퇴는 리프레시 토큰을 폐기하지 않는다(§1.2) → 로그아웃을 함께 호출해 서버 세션도 끊는다.
    //    accessToken도 서버에 블랙리스트가 없어 만료 전까지 유효하므로 로컬에서 즉시 폐기한다.
    await clearSession();
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

      {/* 계측(MY-001): 프로필·관심그룹·설정·정보를 구분선으로 나눈다 */}
      <div className="mx-4 border-b border-secondary-50" />

      {/* 관심 그룹 — 비회원 화면(MY-004)과 마크업을 공유한다 */}
      <InterestGroupSection
        groups={interestGroups}
        add={{ href: ROUTES.myGroupsAdd }}
        edit={{ href: ROUTES.myGroups }}
      />

      <div className="mx-4 mt-6 border-b border-secondary-50" />

      {/* 설정 — 헤딩은 본문과 같은 16(body1)/secondary-900이다(계측). 회색 소제목이 아니다 */}
      <section className="px-4 pt-4">
        <h2 className="text-body1 text-secondary-900">설정</h2>
        <SettingRow
          label="채팅 알림"
          right={<Toggle checked={chatAlarm} onChange={setChatAlarm} ariaLabel="채팅 알림" />}
        />
      </section>

      <div className="mx-4 border-b border-secondary-50" />

      {/* 정보 */}
      <section className="px-4 pt-4">
        <h2 className="text-body1 text-secondary-900">정보</h2>
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
          void clearSession();
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
