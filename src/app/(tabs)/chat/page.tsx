'use client';

import { useState } from 'react';
import { useAuthStore } from '@store/auth-store';
import { useLeftChatStore } from '@store/left-chat-store';
import { TabHeader } from '@components/layout/tab-header';
import { Button } from '@components/ui/button';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { IconButton } from '@components/ui/icon-button';
import { SettingsIcon } from '@components/icons';
import { ActionSheet } from '@components/common/action-sheet';
import { ChatEmptyState } from '@components/chat/chat-empty-state';
import { ChatListRow } from '@components/chat/chat-list-row';
import { LEAVE_CHAT_CONFIRM } from '@components/chat/leave-chat-confirm';
import { useChatRooms, useLeaveChatRooms } from '@hooks/use-chat';
import { useInfiniteScrollSentinel } from '@hooks/use-home-feed';

/**
 * CHAT-001 채팅 목록. 비회원이거나 진행된 채팅이 없으면 빈 상태(CHAT-005).
 *
 * 편집 모드(디자인 CHAT-001-edit): ⚙ → 시트 → '채팅방 편집하기'.
 * 여러 방을 골라 한 번에 나갈 수 있고, '완료'는 선택을 버리고 목록으로 돌아간다.
 *
 * 편집 모드는 **화면 전체를 덮는 레이어**로 그린다.
 *  - 디자인상 이때는 **하단 탭바가 없고** 그 자리를 '채팅방 나가기'가 차지한다.
 *  - 버튼을 목록 아래에 두면 방이 많을 때 화면 밖으로 밀린다. 레이어로 높이를 고정해야
 *    **버튼은 제자리에 두고 목록만 스크롤**시킬 수 있다(문서 스크롤로는 불가능하다).
 */
export default function ChatPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatRooms();
  // 목록은 커서 페이지네이션이라 첫 페이지만 받아온다 — 끝에 닿으면 다음 장을 이어 붙인다.
  const sentinelRef = useInfiniteScrollSentinel(
    () => void fetchNextPage(),
    hasNextPage && !isFetchingNextPage
  );

  // 나간 방은 서버가 목록에서 빼주지 않아 화면에서 직접 숨긴다(§8.10 결함 우회).
  // 복구 전에는 숨길 대상을 모르므로 목록을 그리지 않는다 — 안 그러면 나간 방이 잠깐 보였다 사라진다.
  const leftIds = useLeftChatStore((s) => s.ids);
  const leftHydrated = useLeftChatStore((s) => s.hydrated);
  const rooms = (data?.pages.flatMap((page) => page.items) ?? []).filter(
    (room) => !leftIds.includes(room.id)
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const leaveRooms = useLeaveChatRooms();

  const exitEditing = () => {
    setEditing(false);
    setPicked([]);
    setError(null);
  };

  const toggle = (chatId: string) =>
    setPicked((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]
    );

  const confirmLeave = async () => {
    setConfirmOpen(false);
    setError(null);
    try {
      await leaveRooms.mutateAsync(picked);
      exitEditing();
    } catch {
      setError('채팅방을 나가지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  /** 목록 본체 + 다음 장 로딩 지점. 편집 모드와 일반 목록이 공유한다. */
  const roomList = (
    <>
      <ul className="divide-y divide-secondary-50">
        {rooms.map((room) => (
          <ChatListRow
            key={room.id}
            room={room}
            selection={
              editing
                ? { checked: picked.includes(room.id), onToggle: () => toggle(room.id) }
                : undefined
            }
          />
        ))}
      </ul>
      {hasNextPage && <div ref={sentinelRef} className="h-1" aria-hidden />}
      {isFetchingNextPage && (
        <p className="py-4 text-center text-body3 text-secondary-500">더 불러오는 중...</p>
      )}
    </>
  );

  // 비회원은 채팅 내역이 없으므로 빈 상태를 보여준다.
  if (!isAuthenticated) {
    return (
      <>
        <TabHeader title="채팅" />
        <ChatEmptyState />
      </>
    );
  }

  if (editing) {
    return (
      // 프레임 폭에 맞춘 전체 화면 레이어. 높이가 고정돼야 목록만 스크롤된다.
      <div className="fixed inset-0 z-30 mx-auto flex min-w-[375px] max-w-[420px] flex-col bg-background">
        {/* 계측: 제목은 가운데 **h3**(목록의 '채팅' h1보다 작다), 우측 '완료'는 53×39 navy pill.
            제목을 절대 배치해 버튼 폭과 무관하게 정확히 가운데 오도록 한다(`Header`와 같은 방식). */}
        <header className="flex shrink-0 items-center px-4 pb-2 pt-4">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-h3 text-secondary-900">
            채팅방 편집
          </h1>
          <Button variant="navy" size="sm" className="ml-auto" onClick={exitEditing}>
            완료
          </Button>
        </header>

        {/* `min-h-0` — flex 아이템의 기본 `min-height: auto`가 내용 높이를 잡아버려서,
            이게 없으면 overflow를 줘도 목록이 늘어나기만 하고 스크롤이 걸리지 않는다.
            `scrollbar-hide` — 전역 CSS는 **페이지** 스크롤바만 숨긴다. 안쪽 스크롤 영역은 따로 꺼야
            일반 목록(문서 스크롤)과 같은 모습이 된다. */}
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide px-4">{roomList}</div>

        {/* 계측: 버튼 343×41(md/cta) · 좌우 16 · 하단 32 */}
        <div className="shrink-0 px-4 pb-8 pt-3">
          {error && <p className="mb-2 text-center text-body3 text-red-900">{error}</p>}
          <Button
            size="md"
            shape="cta"
            className="w-full"
            disabled={picked.length === 0 || leaveRooms.isPending}
            onClick={() => setConfirmOpen(true)}
          >
            {leaveRooms.isPending ? '나가는 중...' : '채팅방 나가기'}
          </Button>
        </div>

        <ConfirmDialog
          open={confirmOpen}
          title={LEAVE_CHAT_CONFIRM.title}
          description={LEAVE_CHAT_CONFIRM.description}
          confirmText={LEAVE_CHAT_CONFIRM.confirmText}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => void confirmLeave()}
        />
      </div>
    );
  }

  const showList = !isPending && !isError && leftHydrated;

  return (
    <>
      <TabHeader
        title="채팅"
        right={
          rooms.length > 0 ? (
            <IconButton aria-label="채팅방 편집" area={32} onClick={() => setSheetOpen(true)}>
              <SettingsIcon className="size-6 text-secondary-900" />
            </IconButton>
          ) : undefined
        }
      />

      {isPending && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">불러오는 중...</p>
      )}
      {isError && (
        <p className="px-4 py-10 text-center text-body2 text-secondary-500">
          채팅 목록을 불러오지 못했어요.
        </p>
      )}

      {showList &&
        (rooms.length === 0 ? (
          <ChatEmptyState />
        ) : (
          // 하단 여백을 두지 않는다 — 탭바는 sticky라 **자기 자리를 차지**하므로 끝까지 내리면
          // 마지막 방이 가려지지 않는다. (홈이 pb-24를 두는 건 탭바가 아니라 fixed인 FAB 때문이다)
          <div className="px-4">{roomList}</div>
        ))}

      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        closeLabel="닫기"
        actions={[
          {
            label: '채팅방 편집하기',
            onClick: () => {
              setSheetOpen(false);
              setEditing(true);
            },
          },
        ]}
      />
    </>
  );
}
