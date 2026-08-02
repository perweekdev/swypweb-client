'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@store/auth-store';
import { useCollectionDraftStore } from '@store/collection-draft-store';
import { TabHeader } from '@components/layout/tab-header';
import { Button } from '@components/ui/button';
import { EmptyState } from '@components/common/empty-state';
import { FloatingCta } from '@components/common/floating-cta';
import { GroupFilter } from '@components/common/group-filter';
import { Toast } from '@components/common/toast';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';
import { CollectionTree } from '@components/collection/collection-tree';
import { PencilIcon } from '@components/icons';
import { useInterestGroups } from '@hooks/use-groups';
import { ROUTES, COLLECTION_ROUTES } from '@constants/routes';

/** COL-001 컬렉션 메인 (그룹별 앨범 트리 + 보유 여부) */
function CollectionView() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // 편집을 마치고 돌아오면 `?group=`으로 보던 그룹이 전달된다(COL-003 → COL-001).
  const groupFromQuery = useSearchParams().get('group');
  const [pickedGroup, setPickedGroup] = useState<string | null>(groupFromQuery);
  const [loginOpen, setLoginOpen] = useState(false);
  const { justSaved, consumeSaved } = useCollectionDraftStore();

  // COL-001 필터는 EX-001과 같다 — '전체' 칩 없이 내 관심 그룹만 나열한다(계측).
  const { data: interestGroups } = useInterestGroups();
  const filterGroups = (interestGroups ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    color: g.color,
    logoUrl: g.logoUrl,
  }));
  // 선택 전에는 첫 관심 그룹을 보여준다(항상 한 그룹이 선택된 화면).
  const selectedGroup = pickedGroup ?? filterGroups[0]?.id ?? '';

  // COL-003 편집 완료 직후 진입하면 토스트를 3초간 노출한다(그동안 편집하기 FAB이 위로 올라감)
  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(consumeSaved, 3000);
    return () => clearTimeout(timer);
  }, [justSaved, consumeSaved]);

  const goAddGroup = () => {
    if (!isAuthenticated) setLoginOpen(true);
    else router.push(ROUTES.myGroupsAdd);
  };

  // 비회원은 관심 그룹이 없는 상태로 본다 (memo: 비회원 기본 화면 = 관심 그룹 없음)
  const groups = isAuthenticated ? filterGroups : [];

  if (groups.length === 0) {
    return (
      <>
        <TabHeader title="컬렉션" />
        <EmptyState
          title="관심 그룹을 추가해보세요"
          description="관심 그룹을 설정하고 컬렉션을 확인해보세요"
          action={
            <Button variant="primary" size="md" onClick={goAddGroup}>
              관심그룹 추가하기
            </Button>
          }
        />
        <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  return (
    <>
      <TabHeader title="컬렉션" />

      <GroupFilter
        className="px-4 pb-3 pt-1"
        groups={groups}
        value={selectedGroup}
        onChange={(id) => setPickedGroup(id ?? selectedGroup)}
        onAdd={goAddGroup}
        addLabel="추가하기"
        showAll={false}
      />

      <CollectionTree
        className="flex-1 px-4 pb-28"
        groupId={selectedGroup ? Number(selectedGroup) : null}
      />

      <FloatingCta
        label="편집하기"
        icon={<PencilIcon className="size-5" />}
        onClick={() => router.push(COLLECTION_ROUTES.edit(selectedGroup))}
        below={<Toast open={justSaved} className="mt-2" message="컬렉션이 변경되었어요!" />}
      />

      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default function CollectionPage() {
  return (
    <Suspense>
      <CollectionView />
    </Suspense>
  );
}
