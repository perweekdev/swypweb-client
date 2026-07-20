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
import { mockChatRoomSummaries } from '@/mocks/chat';
import { ChevronLeftIcon } from '@components/icons';

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
    </main>
  );
}
