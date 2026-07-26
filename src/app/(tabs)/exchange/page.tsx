'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/auth-store';
import { useExchangeDraftStore } from '@store/exchange-draft-store';
import { TabHeader } from '@components/layout/tab-header';
import { Button } from '@components/ui/button';
import { Subtitle } from '@components/ui/subtitle';
import { ViewSetAllLink } from '@components/ui/view-set-all-link';
import { EmptyState } from '@components/common/empty-state';
import { FloatingCta } from '@components/common/floating-cta';
import { GroupFilter } from '@components/common/group-filter';
import { HomeFeedCard } from '@components/common/home-feed-card';
import { ExchangeSetFrame } from '@components/common/exchange-set-frame';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';
import { Toast } from '@components/common/toast';
import { useDragScroll } from '@hooks/use-drag-scroll';
import { useInterestGroups } from '@hooks/use-groups';
import { useMyTradeSets } from '@hooks/use-trade-sets';
import { useMatches } from '@hooks/use-matches';
import { ROUTES, EXCHANGE_ROUTES } from '@constants/routes';

/** EX-001 교환 메인 (내 교환 세트 + 교환 가능한 상대) */
export default function ExchangePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [pickedGroup, setPickedGroup] = useState<string | null>(null);
  const [pickedSet, setPickedSet] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const setScrollRef = useDragScroll<HTMLUListElement>();
  const { justRegistered, consumeRegistered } = useExchangeDraftStore();

  // EX-001 필터는 HOME-001과 달리 '전체'가 없고 **내 관심 그룹만** 나열한다(계측 + 스토리보드).
  const { data: interestGroups } = useInterestGroups();
  const filterGroups = (interestGroups ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    color: g.color,
    logoUrl: g.logoUrl,
  }));
  // 항상 한 그룹이 선택된 상태 ('전체' 칩 없음)
  const selectedGroup = pickedGroup ?? filterGroups[0]?.id ?? null;
  const { data: sets } = useMyTradeSets(selectedGroup ? Number(selectedGroup) : null);

  // EX-008 등록 직후 진입하면 토스트를 3초간 노출한다(그동안 FAB이 위로 올라감)
  useEffect(() => {
    if (!justRegistered) return;
    const timer = setTimeout(consumeRegistered, 3000);
    return () => clearTimeout(timer);
  }, [justRegistered, consumeRegistered]);

  const goAddGroup = () => {
    if (!isAuthenticated) setLoginOpen(true);
    else router.push(ROUTES.myGroupsAdd);
  };

  // 비회원은 관심 그룹이 없는 상태로 본다 (memo: 비회원 기본 화면 = 관심 그룹 없음)
  const groups = isAuthenticated ? filterGroups : [];

  const mySets = sets ?? [];
  // 매칭은 **교환 세트 단위**로 계산된다 → 사용자가 고른 세트의 매칭을 보여준다.
  // 고르기 전(또는 그룹을 바꿔 이전 선택이 사라졌으면) 가장 최근 세트를 기준으로 한다.
  const selectedSetId = mySets.find((set) => set.id === pickedSet)?.id ?? mySets[0]?.id ?? null;
  const { data: matchPages } = useMatches(selectedSetId);
  const matches = matchPages?.pages.flatMap((page) => page.items) ?? [];

  if (groups.length === 0) {
    return (
      <>
        <TabHeader title="내 교환" />
        <EmptyState
          title="관심 그룹을 추가해보세요"
          description="관심 그룹을 설정하고 카드를 교환해보세요"
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
      <TabHeader title="내 교환" />

      <GroupFilter
        className="px-4 pb-3 pt-1"
        groups={groups}
        value={selectedGroup}
        onChange={(id) => setPickedGroup(id ?? selectedGroup)}
        onAdd={goAddGroup}
        addLabel="추가하기"
        showAll={false}
      />

      <section className="pt-2">
        <div className="flex items-center justify-between px-4">
          <Subtitle>내 교환 세트 {mySets.length}</Subtitle>
          {mySets.length > 0 && selectedGroup && (
            <ViewSetAllLink
              label="전체 보기"
              onClick={() => router.push(EXCHANGE_ROUTES.setsOf(selectedGroup))}
            />
          )}
        </div>

        {mySets.length === 0 ? (
          <EmptyState
            title="등록된 교환 세트가 없어요"
            description="세트를 등록하면 교환 상대를 매치해드려요"
          />
        ) : (
          <ul ref={setScrollRef} className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide px-4">
            {mySets.map((set) => (
              <li key={set.id} className="shrink-0">
                {/*
                  세트 박스를 고르면 아래 '교환 가능한 상대'가 그 세트 기준으로 바뀐다(디자인 EX-001-matching).
                  매칭이 교환 세트 단위로 계산되기 때문이며, 상세(EX-004)는 EX-003에서 진입한다.
                */}
                {/* 목록 API는 축별 대표 카드 1장만 준다 → 나머지는 +N으로 표기 */}
                <button
                  type="button"
                  aria-pressed={set.id === selectedSetId}
                  onClick={() => setPickedSet(set.id)}
                  className="block text-left"
                >
                  <ExchangeSetFrame
                    variant={set.id === selectedSetId ? 'highlighted' : 'default'}
                    className="w-[276px]"
                    have={{ card: set.haveRepresentative, extraCount: set.haveCount - 1 }}
                    want={{ card: set.wantRepresentative, extraCount: set.wantCount - 1 }}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {mySets.length > 0 && (
        <section className="pb-28">
          <div className="mx-4 mt-4 border-t border-secondary-50" />
          <Subtitle className="px-4 pt-4">교환 가능한 상대 {matches.length}</Subtitle>

          {matches.map((match, i) => (
            <div key={match.id}>
              {i > 0 && <div className="mx-4 border-t border-secondary-50" />}
              <HomeFeedCard
                className="cursor-pointer px-4 py-4"
                name={match.nickname}
                avatarUrl={match.avatarUrl}
                haveCards={match.haveCards}
                wantCards={match.wantCards}
                onClick={() => router.push(EXCHANGE_ROUTES.matchDetail(match.id))}
                onOffer={() => router.push(EXCHANGE_ROUTES.matchSelect(match.id))}
              />
            </div>
          ))}
        </section>
      )}

      <FloatingCta
        label="교환 등록하기"
        onClick={() => selectedGroup && router.push(EXCHANGE_ROUTES.register(selectedGroup))}
        below={justRegistered && <Toast message="교환이 등록되었어요!" />}
      />

      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
