'use client';

import { type ReactNode, useState } from 'react';
import { Button } from '@components/ui/button';
import { CloseButton } from '@components/ui/close-button';
import { IconButton } from '@components/ui/icon-button';
import { LoginButton } from '@components/ui/login-button';
import { TabButton } from '@components/ui/tab-button';
import { Toggle } from '@components/ui/toggle';
import { CheckCircle } from '@components/ui/check-circle';
import { ImageCheck } from '@components/ui/image-check';
import { StatusChip } from '@components/ui/status-chip';
import { AllChip } from '@components/ui/all-chip';
import { GroupLogo } from '@components/ui/group-logo';
import { Avatar } from '@components/ui/avatar';
import { ChatBubble } from '@components/chat/chat-bubble';
import { ChatInputBar } from '@components/chat/chat-input-bar';
import { ChatListRow } from '@components/chat/chat-list-row';
import { PhotocardCard } from '@components/photocard/photocard-card';
import { SelectableCard } from '@components/photocard/selectable-card';
import { DeletableCard } from '@components/photocard/deletable-card';
import { CardSetInfo } from '@components/photocard/card-set-info';
import { HaveSetCard } from '@components/photocard/have-set-card';
import { Subtitle } from '@components/ui/subtitle';
import { SettingRow } from '@components/ui/setting-row';
import { ViewSetAllLink } from '@components/ui/view-set-all-link';
import { HaveWantTab } from '@components/ui/have-want-tab';
import { CollectionAccordion } from '@components/ui/collection-accordion';
import { TradingStatusSelect } from '@components/ui/trading-status-select';
import { Header } from '@components/layout/header';
import { BottomTabNav } from '@components/layout/bottom-tab-nav';
import { ConfirmDialog } from '@components/ui/confirm-dialog';
import { ActionSheet } from '@components/common/action-sheet';
import { Toast } from '@components/common/toast';
import { ProgressBar } from '@components/common/progress-bar';
import { LoginBottomSheet } from '@components/my/login-bottom-sheet';
import { ChatMessageList } from '@components/chat/chat-message-list';
import { SelectableCardGrid } from '@components/photocard/selectable-card-grid';
import { DeletableCardGrid } from '@components/photocard/deletable-card-grid';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { ExchangeInfoHeader } from '@components/common/exchange-info-header';
import { ExchangeSetFrame } from '@components/common/exchange-set-frame';
import { UserProfile } from '@components/common/user-profile';
import { GroupFilter } from '@components/common/group-filter';
import { HomeFeedCard } from '@components/common/home-feed-card';
import { mockChatRoomSummaries, mockChatRooms } from '@/mocks/chat';
import type { Photocard } from '@/types/photocard.types';
import { ChevronLeftIcon, MoreIcon } from '@components/icons';

const CARD_COLORS = ['#D8C3E8', '#B7D3C2', '#8FA98C', '#E8B4A0', '#A8C0E8', '#E8D4A0'];
const demoCards: Photocard[] = CARD_COLORS.map((color, i) => ({
  id: `demo-${i}`,
  memberName: '멤버명',
  albumName: '앨범명',
  versionName: '버전명',
  imageUrl: null,
  color,
}));
const demoGroups = [
  { id: 'ive', name: 'IVE', color: '#F4A8C0', favorited: true },
  { id: 'aespa', name: 'aespa', color: '#1F1F1F' },
  { id: 'illit', name: 'ILLIT', color: '#5BC0DE' },
];

/**
 * 공용 컴포넌트 카탈로그 (개발 확인용).
 * 도메인 화면과 무관하게 디자인 시스템 컴포넌트를 한눈에 확인한다.
 * 청크가 진행될 때마다 섹션을 추가한다.
 */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-secondary-50 py-8">
      <h2 className="mb-4 text-h3 text-secondary-900">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-body3 text-secondary-500">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function ComponentCatalogPage() {
  const [toggleOn, setToggleOn] = useState(true);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [side, setSide] = useState<'have' | 'want'>('have');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [gridSel, setGridSel] = useState<Set<string>>(new Set([demoCards[0].id]));
  const [groupVal, setGroupVal] = useState<string | null>(null);

  const toggleGrid = (id: string) =>
    setGridSel((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const { myCards: haveCards, partnerCards: wantCards } = mockChatRooms[0].exchangeSet;
  const cards = [...haveCards, ...wantCards]; // 카탈로그용 3장 확보

  return (
    <main className="mx-auto max-w-[480px] px-5 py-6">
      <header className="pb-2">
        <h1 className="text-h1 text-secondary-900">컴포넌트 카탈로그</h1>
        <p className="mt-1 text-body3 text-secondary-500">
          공용 컴포넌트 라이브러리 확인용 · 청크별로 추가됨
        </p>
      </header>

      {/* ── 청크 1: 버튼/액션 atoms ─────────────────────────── */}
      <Section title="Button — CTA (shape=cta)">
        <Row label="primary · lg (하단 고정 full-width)">
          <div className="w-full">
            <Button variant="primary" size="lg">
              확인
            </Button>
          </div>
        </Row>
        <Row label="primary · lg · disabled">
          <div className="w-full">
            <Button variant="primary" size="lg" disabled>
              확인
            </Button>
          </div>
        </Row>
        <Row label="primary · md / sm">
          <Button variant="primary" shape="cta" size="md">
            Medium
          </Button>
          <Button variant="primary" shape="cta" size="sm">
            Small
          </Button>
        </Row>
      </Section>

      <Section title="Button — Pill (shape=pill)">
        <Row label="navy · lg / md / sm">
          <Button variant="navy" size="lg" shape="pill">
            교환 완료하기
          </Button>
          <Button variant="navy" size="md">
            완료
          </Button>
          <Button variant="navy" size="sm">
            로그인하기
          </Button>
        </Row>
        <Row label="navy · disabled">
          <Button variant="navy" size="md" disabled>
            완료
          </Button>
        </Row>
        <Row label="outline · lg / md / sm">
          <Button variant="outline" size="lg" shape="pill">
            상세 정보 보기
          </Button>
          <Button variant="outline" size="md">
            해제하기
          </Button>
          <Button variant="outline" size="sm">
            프로필 편집하기
          </Button>
        </Row>
        <Row label="primary · pill (예: 내교환 확인하기)">
          <Button variant="primary" size="sm">
            내교환 확인하기
          </Button>
        </Row>
      </Section>

      <Section title="LoginButton">
        <div className="w-full space-y-3">
          <LoginButton service="google" />
          <LoginButton service="naver" />
        </div>
      </Section>

      <Section title="TabButton / CloseButton / IconButton">
        <Row label="TabButton">
          <TabButton>추가하기</TabButton>
        </Row>
        <Row label="CloseButton (btn-close, 20px)">
          <CloseButton />
        </Row>
        <Row label="IconButton (touch-area 48 / 32)">
          <span className="bg-secondary-10">
            <IconButton aria-label="뒤로가기" area={48}>
              <ChevronLeftIcon className="size-6" />
            </IconButton>
          </span>
          <span className="bg-secondary-10">
            <IconButton aria-label="뒤로가기" area={32}>
              <ChevronLeftIcon className="size-4" />
            </IconButton>
          </span>
        </Row>
      </Section>

      {/* ── 청크 2: 선택/상태/이미지 atoms ───────────────────── */}
      <Section title="Toggle / CheckCircle / ImageCheck">
        <Row label="Toggle (48×28)">
          <Toggle checked={toggleOn} onChange={setToggleOn} ariaLabel="예시 토글" />
          <Toggle checked={!toggleOn} onChange={(v) => setToggleOn(!v)} ariaLabel="예시 토글 2" />
        </Row>
        <Row label="CheckCircle — default / selected (control-checkbox-text)">
          <CheckCircle checked={false} />
          <CheckCircle checked />
        </Row>
        <Row label="ImageCheck — unselected / selected (control-checkbox-image)">
          <ImageCheck selected={false} />
          <ImageCheck selected />
        </Row>
      </Section>

      <Section title="StatusChip / AllChip">
        <Row label="StatusChip (chip-status)">
          <StatusChip />
        </Row>
        <Row label="AllChip (image-all)">
          <AllChip />
        </Row>
      </Section>

      <Section title="GroupLogo (group-logo)">
        <Row label="large — default / selected / add / favorited">
          <GroupLogo size="lg" name="IVE" color="#F4A8C0" />
          <GroupLogo size="lg" state="selected" name="aespa" color="#8B9DC3" />
          <GroupLogo size="lg" state="add" />
          <GroupLogo size="lg" name="Red Velvet" color="#C77DFF" favorited />
        </Row>
        <Row label="small — default / selected / add">
          <GroupLogo size="sm" name="IVE" color="#F4A8C0" />
          <GroupLogo size="sm" state="selected" name="ILLIT" color="#5BC0DE" />
          <GroupLogo size="sm" state="add" />
        </Row>
      </Section>

      <Section title="Avatar (image-profile)">
        <Row label="placeholder / 사진 등록(색상)">
          <Avatar />
          <Avatar color="#B089F4" />
          <Avatar className="size-16" />
        </Row>
      </Section>

      {/* ── 청크 3: 채팅 atoms/molecules ─────────────────────── */}
      <Section title="ChatBubble (sender/receiver)">
        <div className="space-y-2">
          <div className="flex">
            <ChatBubble variant="partner">안녕하세요 😊</ChatBubble>
          </div>
          <div className="flex justify-end">
            <ChatBubble variant="mine">네, 안녕하세요!</ChatBubble>
          </div>
        </div>
      </Section>

      <Section title="ChatInputBar (chat-input-status)">
        <div className="rounded-xl border border-secondary-50">
          <ChatInputBar />
        </div>
        <p className="text-body3 text-secondary-500">입력 시 X(지우기)·보내기 버튼이 활성화된다.</p>
      </Section>

      <Section title="ChatListRow (chat)">
        <ul className="divide-y divide-secondary-50">
          {mockChatRoomSummaries.slice(0, 3).map((room) => (
            <ChatListRow key={room.id} room={room} />
          ))}
        </ul>
      </Section>

      {/* ── 청크 4: 포카 카드 molecules ─────────────────────── */}
      <Section title="PhotocardCard (박스 + 정보, 3열)">
        <ul className="grid grid-cols-3 gap-2">
          {cards.slice(0, 3).map((card) => (
            <li key={card.id}>
              <PhotocardCard card={card} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="SelectableCard (crad-selecting-status)">
        <Row label="collected / not_collected / selected(클릭 토글)">
          <div className="w-20">
            <SelectableCard card={cards[0]} state="collected" />
          </div>
          <div className="w-20">
            <SelectableCard card={cards[1]} state="not_collected" />
          </div>
          <div className="w-20">
            <SelectableCard
              card={cards[2]}
              state={pickedId === cards[2].id ? 'selected' : 'collected'}
              onClick={() => setPickedId((id) => (id === cards[2].id ? null : cards[2].id))}
            />
          </div>
        </Row>
      </Section>

      <Section title="DeletableCard (card-set-deleting-card)">
        <div className="w-20">
          <DeletableCard card={cards[0]} />
        </div>
      </Section>

      <Section title="CardSetInfo (card-set-info)">
        <div className="max-w-[180px]">
          <CardSetInfo card={cards[0]} extraCount={wantCards.length - 1} />
        </div>
      </Section>

      <Section title="HaveSetCard (have-set-info · EX 오버레이)">
        <Row label="있어요 / 구해요 + 외 N장">
          <div className="w-28">
            <HaveSetCard card={cards[0]} label="있어요" extraCount={cards.length - 1} />
          </div>
          <div className="w-28">
            <HaveSetCard card={wantCards[0]} label="구해요" extraCount={wantCards.length - 1} />
          </div>
        </Row>
      </Section>

      {/* ── 청크 5: 네비/폼 molecules ───────────────────────── */}
      <Section title="Header (nav-bar) / BottomTabNav (tab-bar-mobile)">
        <Row label="Header — 뒤로가기 + 타이틀 + ⋮">
          <div className="w-full rounded-xl border border-secondary-50">
            <Header
              title="교환 포카 정보"
              right={
                <IconButton aria-label="더보기">
                  <MoreIcon className="size-6" />
                </IconButton>
              }
            />
          </div>
        </Row>
        <Row label="BottomTabNav — active 채운 아이콘 / inactive secondary-500">
          <div className="relative w-full overflow-hidden rounded-xl border border-secondary-50">
            <BottomTabNav />
          </div>
        </Row>
      </Section>

      <Section title="Subtitle / ViewSetAllLink / TradingStatusSelect">
        <Row label="Subtitle">
          <Subtitle>내 교환 세트</Subtitle>
        </Row>
        <Row label="ViewSetAllLink (view-set-all)">
          <ViewSetAllLink />
        </Row>
        <Row label="TradingStatusSelect (card-trading-status)">
          <TradingStatusSelect status="교환중" />
        </Row>
      </Section>

      <Section title="SettingRow (setting)">
        <div className="divide-y divide-secondary-50">
          <SettingRow label="개인정보 처리방침" onClick={() => {}} />
          <SettingRow
            label="채팅 알림"
            right={<Toggle checked={toggleOn} onChange={setToggleOn} ariaLabel="채팅 알림" />}
          />
        </div>
      </Section>

      <Section title="HaveWantTab (have-want-tab)">
        <HaveWantTab value={side} onChange={setSide} haveCount={9} wantCount={3} />
      </Section>

      <Section title="CollectionAccordion (collection-accordion)">
        <div className="divide-y divide-secondary-50">
          <CollectionAccordion title="앨범 이름 1" defaultOpen>
            <p className="text-body3 text-secondary-500">
              펼침 영역 — 컬렉션 카드 그리드 등이 들어간다.
            </p>
          </CollectionAccordion>
          <CollectionAccordion title="앨범 이름 2">
            <p className="text-body3 text-secondary-500">접힌 상태에서 클릭하면 펼쳐진다.</p>
          </CollectionAccordion>
        </div>
      </Section>

      {/* ── 청크 6: 오버레이/피드백 organisms ────────────────── */}
      <Section title="Toast / ProgressBar">
        <Row label="Toast (set-add-success)">
          <Toast message="교환 세트가 등록되었어요!" />
        </Row>
        <Row label="ProgressBar (progress)">
          <div className="w-full">
            <ProgressBar label="Red Velvet" value={9} max={200} />
          </div>
        </Row>
      </Section>

      <Section title="ConfirmDialog / ActionSheet / LoginBottomSheet">
        <Row label="열어서 확인">
          <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
            ConfirmDialog
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSheetOpen(true)}>
            ActionSheet
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLoginOpen(true)}>
            LoginBottomSheet
          </Button>
        </Row>
      </Section>

      <ConfirmDialog
        open={dialogOpen}
        title="포카 세트를 삭제할까요?"
        description="포카 세트가 교환 리스트에서 삭제돼요."
        confirmText="삭제"
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => setDialogOpen(false)}
      />
      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        actions={[
          { label: '이미지로 저장하기', onClick: () => {} },
          { label: '수정하기', onClick: () => {} },
          { label: '삭제하기', onClick: () => {}, destructive: true },
        ]}
      />
      <LoginBottomSheet open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* ── 청크 7: 교환/그리드 organisms ────────────────────── */}
      <Section title="ChatMessageList (chat_sender/receiver)">
        <div className="rounded-xl border border-secondary-50">
          <ChatMessageList
            messages={mockChatRooms[0].messages}
            partner={mockChatRooms[0].partner}
          />
        </div>
      </Section>

      <Section title="ExchangeInfoHeader (exchange-hint)">
        <ExchangeInfoHeader exchangeSet={mockChatRooms[0].exchangeSet} />
      </Section>

      <Section title="ExchangeCardSections (exchange_info · CHAT-003)">
        <ExchangeCardSections haveCards={demoCards.slice(0, 3)} wantCards={demoCards.slice(0, 6)} />
      </Section>

      <Section title="SelectableCardGrid (card-detail · CHAT-004)">
        <SelectableCardGrid
          cards={demoCards.slice(0, 3)}
          selected={gridSel}
          onToggle={toggleGrid}
        />
      </Section>

      <Section title="DeletableCardGrid (set-cards-selected)">
        <DeletableCardGrid cards={demoCards} max={10} />
      </Section>

      <Section title="ExchangeSetFrame (exchange-frame · EX)">
        <div className="space-y-4">
          <ExchangeSetFrame
            have={{ card: demoCards[0], extraCount: 5 }}
            want={{ card: demoCards[1], extraCount: 5 }}
          />
          <ExchangeSetFrame
            variant="highlighted"
            have={{ card: demoCards[2], extraCount: 5 }}
            want={{ card: demoCards[3], extraCount: 5 }}
          />
        </div>
      </Section>

      <Section title="UserProfile (user-profile)">
        <div className="space-y-4">
          <UserProfile
            name="포카요정"
            avatarColor="#F4A8C0"
            groups="레드벨벳 · 아이브"
            variant="editable"
          />
          <UserProfile name="포카요정" avatarColor="#8FA98C" variant="offer" />
        </div>
      </Section>

      <Section title="GroupFilter (group-filter · HOME/COL/EX)">
        <GroupFilter groups={demoGroups} value={groupVal} onChange={setGroupVal} />
      </Section>

      <Section title="HomeFeedCard (home-feed-exchange-info · HOME)">
        <HomeFeedCard
          name="포카요정"
          avatarColor="#A8C0E8"
          haveCards={demoCards.slice(0, 3)}
          wantCards={demoCards}
        />
      </Section>
    </main>
  );
}
