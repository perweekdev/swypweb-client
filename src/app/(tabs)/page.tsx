'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/auth-store';
import { TabHeader } from '@components/layout/tab-header';
import { GroupFilter } from '@components/common/group-filter';
import { HomeFeedCard } from '@components/common/home-feed-card';
import { EmptyState } from '@components/common/empty-state';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';
import { FloatingCta } from '@components/common/floating-cta';
import { useHomeFeed, useInfiniteScrollSentinel } from '@hooks/use-home-feed';
import { useAllGroups, useInterestGroups } from '@hooks/use-groups';
import { useMyProfile } from '@hooks/use-my-profile';
import { ROUTES, POST_ROUTES } from '@constants/routes';

/** HOME-001 홈 피드 (교환글 탐색 메인) */
export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  // 내 교환글에는 제안할 수 없다(서버 AUTH_006) → 목록에서 미리 버튼을 숨긴다.
  const { data: myProfile } = useMyProfile();
  const myUserId = myProfile ? String(myProfile.userId) : null;

  // 비로그인은 그룹 목록을 못 받으므로(인증 필요) 필터가 비어 '전체'만 보인다 — 의도된 동작.
  const { data: allGroups } = useAllGroups();
  const { data: interestGroups } = useInterestGroups();
  const favoriteIds = new Set(interestGroups?.map((g) => g.id) ?? []);
  const filterGroups = (allGroups ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    color: g.color,
    logoUrl: g.logoUrl,
    favorited: favoriteIds.has(g.id),
  }));

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useHomeFeed(
    selectedGroup ? Number(selectedGroup) : undefined
  );
  const posts = data?.pages.flatMap((page) => page.items) ?? [];
  const sentinelRef = useInfiniteScrollSentinel(
    () => void fetchNextPage(),
    hasNextPage && !isFetchingNextPage
  );

  // 회원 전용 동작은 비회원이면 로그인 유도 시트를 띄운다 (IA: 관심그룹 추가/제안/채팅)
  const requireAuth = (action: () => void) => () => {
    if (!isAuthenticated) setLoginOpen(true);
    else action();
  };

  return (
    <>
      <TabHeader title="포카매치" logo />

      <GroupFilter
        className="px-4 pb-3 pt-1"
        groups={filterGroups}
        value={selectedGroup}
        onChange={setSelectedGroup}
        onAdd={requireAuth(() => router.push(ROUTES.myGroupsAdd))}
      />

      {isPending && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">불러오는 중...</p>
      )}

      {isError && (
        <EmptyState title="교환글을 불러오지 못했어요." description="잠시 후 다시 시도해주세요." />
      )}

      {!isPending && !isError && posts.length === 0 && (
        <EmptyState title="아직 등록된 교환글이 없어요." description="첫 교환글을 등록해보세요!" />
      )}

      <div className="pb-24">
        {posts.map((post, i) => {
          // 상세 응답에 작성자가 없어(§7.3) 피드에서 받은 값을 쿼리로 넘긴다.
          const openDetail = requireAuth(() =>
            router.push(
              POST_ROUTES.detail(post.id, {
                nickname: post.author.nickname,
                groups: post.author.groups,
                authorId: post.author.id,
              })
            )
          );

          return (
            <div key={post.id}>
              {i > 0 && <div className="mx-4 border-t border-secondary-50" />}
              <HomeFeedCard
                className="cursor-pointer px-4 py-4"
                name={post.author.nickname}
                avatarColor={post.author.avatarColor}
                haveCards={post.haveCards}
                wantCards={post.wantCards}
                isMine={myUserId !== null && post.author.id === myUserId}
                // 내 글은 '제안하기'가 없으므로 카드 자체를 눌러 상세로 들어간다.
                onClick={openDetail}
                onOffer={openDetail}
              />
            </div>
          );
        })}
        {hasNextPage && <div ref={sentinelRef} className="h-1" aria-hidden />}
        {isFetchingNextPage && (
          <p className="py-4 text-center text-body3 text-secondary-500">더 불러오는 중...</p>
        )}
      </div>

      <FloatingCta
        label="교환 등록하기"
        onClick={requireAuth(() => router.push(ROUTES.exchangeRegister))}
      />

      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
