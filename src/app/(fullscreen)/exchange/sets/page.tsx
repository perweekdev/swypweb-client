'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@components/layout/header';
import { ExchangeSetList } from '@components/exchange/exchange-set-list';

/** EX-003 나의 교환 세트 관리 (그룹 단위 — 목록 API가 groupId 필수) */
function ExchangeSetsView() {
  const groupParam = useSearchParams().get('group');

  return (
    <>
      <Header title="내 교환 세트" />
      <ExchangeSetList groupId={groupParam ? Number(groupParam) : null} />
    </>
  );
}

export default function ExchangeSetsPage() {
  return (
    <Suspense>
      <ExchangeSetsView />
    </Suspense>
  );
}
