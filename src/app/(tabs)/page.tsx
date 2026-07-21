'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/auth-store';
import { TabHeader } from '@components/layout/tab-header';
import { GroupFilter } from '@components/common/group-filter';
import { HomeFeedCard } from '@components/common/home-feed-card';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';
import { PlusIcon } from '@components/icons';
import { ROUTES, POST_ROUTES } from '@constants/routes';
import { mockFeedPosts } from '@/mocks/home';
import { mockAllArtists, mockInterestGroups } from '@/mocks/my';

// 관심(추가) 그룹은 하트 배지 표시 — mockInterestGroups를 관심 여부로 사용
const favIds = new Set(mockInterestGroups.map((g) => g.id));
const filterGroups = mockAllArtists.map((g) => ({
  id: g.id,
  name: g.name,
  color: g.color,
  favorited: favIds.has(g.id),
}));

/** HOME-001 홈 피드 (교환글 탐색 메인) */
export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  // 회원 전용 동작은 비회원이면 로그인 유도 시트를 띄운다 (IA: 관심그룹 추가/제안/채팅)
  const requireAuth = (action: () => void) => () => {
    if (!isAuthenticated) setLoginOpen(true);
    else action();
  };

  // TODO: 선택 그룹으로 교환글 필터링 (그룹 태깅된 데이터/API 연동 후). 현재는 선택 상태만 유지.
  const posts = mockFeedPosts;

  return (
    <>
      <TabHeader title="포카매치" />

      <GroupFilter
        className="px-4 pb-3 pt-1"
        groups={filterGroups}
        value={selectedGroup}
        onChange={setSelectedGroup}
        onAdd={requireAuth(() => router.push(ROUTES.myGroupsAdd))}
      />

      <div className="pb-24">
        {posts.map((post, i) => (
          <div key={post.id}>
            {i > 0 && <div className="mx-4 border-t border-secondary-50" />}
            <HomeFeedCard
              className="px-4 py-4"
              name={post.author.nickname}
              avatarColor={post.author.avatarColor}
              haveCards={post.haveCards}
              wantCards={post.wantCards}
              onOffer={requireAuth(() => router.push(POST_ROUTES.detail(post.id)))}
            />
          </div>
        ))}
      </div>

      {/* 플로팅 CTA: 프레임 폭(max-w-420)에 맞춰 우측 하단, 탭바 위에 뜬다 */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[420px] justify-end px-4 pb-[calc(64px_+_env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={requireAuth(() => router.push(ROUTES.exchangeRegister))}
          className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-primary-900 px-5 py-3.5 text-button1 text-white shadow-lg"
        >
          <PlusIcon className="size-5" />
          교환 등록하기
        </button>
      </div>

      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
