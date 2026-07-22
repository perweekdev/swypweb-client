'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/auth-store';
import { TabHeader } from '@components/layout/tab-header';
import { GroupFilter } from '@components/common/group-filter';
import { HomeFeedCard } from '@components/common/home-feed-card';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';
import { FloatingCta } from '@components/common/floating-cta';
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

      <FloatingCta
        label="교환 등록하기"
        onClick={requireAuth(() => router.push(ROUTES.exchangeRegister))}
      />

      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
