'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { EmptyState } from '@components/common/empty-state';
import { ExchangeRegisterEditor } from '@components/exchange/exchange-register-editor';
import { useInterestGroups } from '@hooks/use-groups';
import { ROUTES } from '@constants/routes';

/**
 * EX-007 등록 화면 진입 처리.
 *
 * 등록 API가 그룹 단위라 대상 그룹이 반드시 필요한데, **진입 경로마다 그룹 정보가 다르다**:
 *  - 내 교환(EX-001): 항상 한 그룹이 선택돼 있어 `?group=`이 붙는다
 *  - 홈(HOME-001): 필터가 '전체'일 수 있어 그룹이 없을 수 있다
 *
 * 그룹이 없으면 **내 첫 관심 그룹으로 보정**한다. 관심 그룹조차 없으면 등록할 대상이 없으므로
 * 추가 화면으로 안내한다. (그룹 선택 화면은 디자인 미핸드오프)
 */
export function ExchangeRegisterEntry() {
  const router = useRouter();
  const groupParam = useSearchParams().get('group');
  const { data: interestGroups, isPending } = useInterestGroups();

  const fallbackGroupId = interestGroups?.[0]?.id ?? null;
  const groupId = groupParam ?? fallbackGroupId;

  if (groupId) return <ExchangeRegisterEditor groupId={Number(groupId)} />;

  return (
    <>
      <Header title="교환 세트 등록" />
      {isPending ? (
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          불러오는 중...
        </p>
      ) : (
        <EmptyState
          title="관심 그룹을 먼저 추가해주세요"
          description="교환 세트는 그룹별로 등록돼요."
          action={
            <Button variant="primary" size="md" onClick={() => router.push(ROUTES.myGroupsAdd)}>
              관심그룹 추가하기
            </Button>
          }
        />
      )}
    </>
  );
}
