'use client';

import { useState } from 'react';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { ArtistAvatar } from '@components/my/artist-avatar';
import { mockInterestGroups } from '@/mocks/my';

// MY-003 나의 관심그룹 (관리) — 등록된 그룹 목록 + 해제(확인 모달)
export default function MyGroupsPage() {
  const [groups, setGroups] = useState(mockInterestGroups);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // TODO: 실제 해제 API 연동 (현재는 로컬 상태)
  const confirmRemove = () => {
    setGroups((prev) => prev.filter((g) => g.id !== pendingId));
    setPendingId(null);
  };

  return (
    <>
      <Header title="나의 관심그룹" />

      <ul className="px-5">
        {groups.map((group) => (
          <li key={group.id} className="flex items-center gap-3 border-b border-secondary-50 py-3">
            <ArtistAvatar name={group.name} color={group.color} className="size-10" />
            <span className="flex-1 text-body1 text-secondary-900">{group.name}</span>
            <Button variant="outline" size="sm" onClick={() => setPendingId(group.id)}>
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
