'use client';

import { useState } from 'react';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { GroupLogo } from '@components/ui/group-logo';
import { EmptyState } from '@components/common/empty-state';
import { useInterestGroups, useRemoveInterestGroup } from '@hooks/use-groups';

// MY-003 나의 관심그룹 (관리) — 등록된 그룹 목록 + 해제(확인 모달)
export default function MyGroupsPage() {
  const { data: groups, isPending, isError } = useInterestGroups();
  const removeGroup = useRemoveInterestGroup();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const confirmRemove = () => {
    if (pendingId) removeGroup.mutate(Number(pendingId));
    setPendingId(null);
  };

  return (
    <>
      <Header title="나의 관심그룹" />

      {isPending && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">불러오는 중...</p>
      )}

      {isError && (
        <EmptyState
          title="관심 그룹을 불러오지 못했어요."
          description="잠시 후 다시 시도해주세요."
        />
      )}

      {groups && groups.length === 0 && (
        <EmptyState
          title="등록한 관심 그룹이 없어요."
          description="관심 그룹을 추가하면 교환글을 더 쉽게 찾을 수 있어요."
        />
      )}

      <ul className="px-4">
        {groups?.map((group) => (
          <li key={group.id} className="flex items-center gap-3 border-b border-secondary-50 py-3">
            <GroupLogo size="sm" name={group.name} color={group.color} logoUrl={group.logoUrl} />
            <span className="flex-1 text-body1 text-secondary-900">{group.name}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={removeGroup.isPending}
              onClick={() => setPendingId(group.id)}
            >
              해제하기
            </Button>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={pendingId !== null}
        title="관심 그룹을 해제할까요?"
        description="이 그룹의 컬렉션과 교환 리스트가 사라져요."
        confirmText="해제"
        onCancel={() => setPendingId(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
